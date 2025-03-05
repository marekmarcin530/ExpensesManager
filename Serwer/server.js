const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const session = require('express-session'); // Dodaj obsługę sesji
const app = express();
const port = 3000;
const path = require("path");
/////////////////////////////
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'expenses'
});
/////////////////////////////
connection.connect((err) => {
  if (err) {
    console.error('Błąd połączenia z bazą danych:', err);
    return;
  }
  console.log('Połączono z bazą danych MySQL');
});

/////////////////////////////
app.use(session({
  secret: 'some-secret-key',
  resave: false,
  saveUninitialized: false
}));
/////////////////////////////
app.use(express.json());
/////////////////////////////
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

/////////////////////////////
app.post('/loginUser', (req, res) => {
  const userData = req.body;

  const query = 'SELECT * FROM users WHERE Email = ? AND Haslo = ?';
  connection.query(query, [userData.Email, userData.Haslo], (err, result) => {
    if (err) {
      console.error('Błąd podczas logowania', err);
      res.status(500).send('Błąd podczas logowania');
      return;
    }

    if (result.length > 0) {
      const userImie = result[0].Imie;
      req.session.user = { userImie };
      console.log("Zalogowano");
      console.log(req.session.user);
      res.status(200).send("Zalogowano pomyślnie");
    } else {
      console.log('Logowanie nieudane');
      res.status(401).send('Logowanie nieudane. Sprawdź adres e-mail i hasło.');
    }
  });
});
/////////////////////////////
app.post('/addUser', (req, res) => {
  const userData = req.body;

  const query = 'INSERT INTO users (Imie, Nazwisko, Haslo, Telefon, Email) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [userData.Imie, userData.Nazwisko, userData.Haslo, userData.Telefon, userData.Email], (err, result) => {
    if (err) {
      console.error('Błąd podczas dodawania użytkownika:', err);
      res.status(500).send('Błąd podczas dodawania użytkownika');
      return;
    }
    console.log('Użytkownik został dodany do bazy danych');
    res.status(200).send('Użytkownik dodany do bazy danych');
  });
});
/////////////////////////////

app.get('/expensesList', (req, res) => {
  if (req.session.user) {
    const ownerName = req.session.user ? req.session.user.userImie : '';
    const query = 'SELECT * FROM wydatki WHERE Wlasciciel = ? ORDER BY Data';
    
    connection.query(query, [ownerName], (err, results) => {
      if (err) {
        console.error("Błąd podczas pobierania danych:", err);
        res.status(500).send("Błąd podczas pobierania danych");
        return;
      }
      
      // Generowanie treści HTML
      let expensesHtml = `
        <html lang="en">
          <!-- ... -->
          <body>
            <h1>Lista Wydatków</h1>
            <table style="margin: auto; text-align: center;">
              <thead>
                <tr>
                  <th style="width: auto; text-align: center;">Kwota</th>
                  <th style="width: auto; text-align: center;">Kategoria wydatku</th>
                  <th style="width: auto; text-align: center;">Data wydatku</th>
                  <th style="width: auto; text-align: center;">Kasowanie wydatku</th>
                </tr>
              </thead>
              <tbody>
      `;

      results.forEach(expense => {
        expensesHtml += `
          <tr>
            <td style="width: auto; text-align: center;">${expense.Kwota} zł</td>
            <td style="width: auto; text-align: center;">${expense.Kategoria}</td>
            <td style="width: auto; text-align: center;">${expense.Data}</td>
            <td style="width: auto; text-align: center;"><button class="btn" onclick="deleteExercise(${expense.Id})">Usuń</button></td>
          </tr>
        `;
      });

      expensesHtml += `
              </tbody>
            </table>
          </body>
        </html>
      `;

      res.setHeader("Content-Type", "text/html");
      res.send(expensesHtml);
    });
  } else {
    res.redirect("/Logowanie.html");
  }
});

////////
app.post("/deleteExpense", (req, res) => {
  const expenseId = req.body.Id;

  const query = "DELETE FROM wydatki WHERE Id = ?";
  connection.query(query, [expenseId], (err, result) => {
    if (err) {
      console.error("Błąd podczas usuwania wydatku:", err);
      res
        .status(500)
        .json({ success: false, error: "Błąd podczas usuwania wydatku" });
      return;
    }

    console.log("Wydatek usunięty z bazy danych");
    res.json({ success: true });
  });
});



/////////////////////////////
app.post('/dodajWydatek', (req, res) => {

  const ownerName = req.session.user ? req.session.user.userImie : '';

  const query = 'INSERT INTO wydatki (Kwota, Kategoria, Data, Wlasciciel) VALUES (?, ?, ?, ?)';
  connection.query(query, [req.body.Kwota, req.body.Kategoria, req.body.DataWydatku, ownerName], (err, result) => {
    if (err) {
      console.error('Błąd zapytania do bazy danych:', err);
      return res.status(500).json({ error: err.message });
    }
    else{
      console.log('Dodano wydatek');
      res.status(200).json({ message: 'Dodano wydatek' });
    }
  });
});
/////////////////////////////
app.get("/checkLoginStatus", (req, res) => {
  console.log("Session user:", req.session.user);
  const loggedIn = req.session.user !== undefined && req.session.user.userImie !== undefined;
  console.log("Logged In:", loggedIn);
  res.json({ loggedIn });
});
/////////////////////////////
app.get("/getUsername", (req, res) => {
  const userImie = req.session.user ? req.session.user.userImie : "";
  res.json({ userImie });
});
/////////////////////////////

app.post("/logout", (req, res) => {
  console.log(req.session.user);
  req.session.destroy((err) => {
    if (err) {
      console.error("Błąd podczas wylogowywania:", err);
      res.status(500).send("Błąd podczas wylogowywania");
    } else {
      console.log("Użytkownik wylogowany");

      res.status(200).send("Wylogowano pomyślnie");
    }
  });
});
/////////////////////////////
app.use(express.static("../Logowanie"));

app.use(express.static(path.join(__dirname, "../Main")));
app.use(express.static(path.join(__dirname, "../Logowanie")));
app.use(express.static(path.join(__dirname, "../Rejestracja")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Logowanie/Logowanie.html"));
});

app.listen(port, () => {
  console.log(`Serwer nasłuchuje na porcie ${port}`);
});
//////////
app.get('/expensesChart', (req, res) => {
  if (req.session.user) {
    const ownerName = req.session.user ? req.session.user.userImie : '';
    const query = 'SELECT * FROM wydatki WHERE Wlasciciel = ? ORDER BY Data';
    
    connection.query(query, [ownerName], (err, results) => {
      if (err) {
        console.error("Błąd podczas pobierania danych:", err);
        res.status(500).send("Błąd podczas pobierania danych");
        return;
      }
      
      // Generowanie treści HTML
      let expensesHtml = `
        <html lang="en">
          <!-- ... -->
          <body>
            <table style="margin: auto; text-align: center;">
        
              <tbody>
      `;

      results.forEach(expense => {
        expensesHtml += `
          <tr>
            <td style="width: auto; text-align: center;">${expense.Kwota} zł</td>
            <td style="width: auto; text-align: center;">${expense.Kategoria}</td>
            <td style="width: auto; text-align: center;">${expense.Data}</td>
          </tr>
        `;
      });

      expensesHtml += `
              </tbody>
            </table>
          </body>
        </html>
      `;

      res.setHeader("Content-Type", "text/html");
      res.send(expensesHtml);
    });
  } else {
    res.redirect("/Logowanie.html");
  }
});
//////////
app.get('/expensesSum', (req, res) => {
  if (req.session.user) {
    const ownerName = req.session.user ? req.session.user.userImie : '';
    const query = 'SELECT * FROM wydatki WHERE Wlasciciel = ? ';
    
    connection.query(query, [ownerName], (err, results) => {
      if (err) {
        console.error("Błąd podczas pobierania danych:", err);
        res.status(500).send("Błąd podczas pobierania danych");
        return;
      }

      let expensesSuma = 4;
      results.forEach(expense => {
        const amount = parseFloat(expense.Kwota);
        if (!isNaN(amount)) {
          expensesSuma += amount;
        }
      });
      

      res.send("Suma wydatków: " + expensesSuma + "zł"); 
    });
  } else {
    res.redirect("/Logowanie.html");
  }
});
//////////////

app.post('/dodajOszczednosc', (req, res) => {
  const ownerName = req.session.user ? req.session.user.userImie : '';
  const query = 'INSERT INTO savings (Kwota, Kategoria, Wlasciciel) SELECT ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM savings WHERE Kategoria = ? AND Wlasciciel = ?)';
  const values = [req.body.Kwota, req.body.Kategoria, ownerName, req.body.Kategoria, ownerName];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Błąd zapytania do bazy danych:', err);
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ success: 'Dodano oszczędność' });
    }
  });
});



//////////
app.get('/loadSavingsGoals', (req, res) => {
  if (req.session.user) {
    const ownerName = req.session.user ? req.session.user.userImie : '';
    const query = 'SELECT * FROM savings WHERE Wlasciciel = ? ';

    connection.query(query, [ownerName], (err, results) => {
      if (err) {
        console.error("Błąd podczas pobierania danych:", err);
        res.status(500).json({ error: "Błąd podczas pobierania danych" });
        return;
      }
      res.json(results);
      

    });
  } else {
    console.error("Użytkownik nie jest zalogowany");
    res.status(403).json({ error: "Użytkownik nie jest zalogowany" });
  }
});
// /////////////


app.get('/loadSavingsDeposits', (req, res) => {
  if (req.session.user) {
    const ownerName = req.session.user ? req.session.user.userImie : '';
    const query = 'SELECT * FROM savingsdeposits WHERE Wlasciciel = ? ';

    connection.query(query, [ownerName], (err, results) => {
      if (err) {
        console.error("Błąd podczas pobierania danych:", err);
        res.status(500).json({ error: "Błąd podczas pobierania danych" });
        return;
      }
      res.json(results);
      
    });
  } else {
    console.error("Użytkownik nie jest zalogowany");
    res.status(403).json({ error: "Użytkownik nie jest zalogowany" });
  }
});

///////////////////

app.get('/loadSavingsDepositsSum', (req, res) => {
  if (req.session.user) {
    const ownerName = req.session.user ? req.session.user.userImie : '';
    const query = 'SELECT Kwota FROM savingsdeposits WHERE Wlasciciel = ? ';
    
    connection.query(query, [ownerName], (err, results) => {
      if (err) {
        console.error("Błąd podczas pobierania danych:", err);
        res.status(500).json({ error: "Błąd podczas pobierania danych" });
        return;
      }
      res.json(results);
      
    });
  } else {
    console.error("Użytkownik nie jest zalogowany");
    res.status(403).json({ error: "Użytkownik nie jest zalogowany" });
  }
});

///////////////////
app.post('/dodajWplateOszczednosc', (req, res) => {
  const ownerName = req.session.user ? req.session.user.userImie : '';

  const query = 'INSERT INTO savingsdeposits (Kwota, Wlasciciel) VALUES (?, ?) ON DUPLICATE KEY UPDATE Kwota = Kwota + VALUES(Kwota)';
  
  connection.query(query, [req.body.Kwota, ownerName], (err, result) => {
    if (err) {
      console.error('Błąd zapytania do bazy danych:', err);
      return res.status(500).json({ error: err.message });
    } else {
      if (result.affectedRows > 0) {
        console.log('Aktualizowano lub dodano wpłatę');
        res.status(200).json({ message: 'Aktualizowano lub dodano wpłatę' });
      } else {
        console.log('Nie zmieniono wpłaty');
        res.status(200).json({ message: 'Nie zmieniono wpłaty' });
      }
    }
  });
});


////////////////////

app.get('/loadSavingsSum', (req, res) => {
  if (req.session.user) {
    const ownerName = req.session.user ? req.session.user.userImie : '';
    const query = 'SELECT Wlasciciel, SUM(Kwota) AS "Suma" FROM savings WHERE Wlasciciel = ?';

    connection.query(query, [ownerName], (err, results) => {
      if (err) {
        console.error("Błąd podczas pobierania danych:", err);
        res.status(500).json({ error: "Błąd podczas pobierania danych" });
        return;
      }
      res.json(results);
    });
  } else {
    console.error("Użytkownik nie jest zalogowany");
    res.status(403).json({ error: "Użytkownik nie jest zalogowany" });
  }
});
/////////////////////
app.post("/deleteSavingsGoal", (req, res) => {
  const expenseId = req.body.Id;
  const ownerName = req.session.user ? req.session.user.userImie : '';

  const query = "DELETE FROM savings WHERE Id = ?";
  connection.query(query, [expenseId], (err, result) => {
    if (err) {
      console.error("Błąd podczas usuwania wydatku:", err);
      res
        .status(500)
        .json({ success: false, error: "Błąd podczas usuwania wydatku" });
      return;
    }

    console.log("Wydatek usunięty z bazy danych");
    res.json({ success: true });
  });
});


/////////////////////
app.post("/decreaseSavingsAmount", (req, res) => {
  const savingsAmount = req.body.savingsAmount;
  const ownerName = req.session.user ? req.session.user.userImie : '';
  
  const query = "UPDATE savingsdeposits SET Kwota = Kwota - ? WHERE Wlasciciel = ?";
  connection.query(query, [savingsAmount, ownerName], (err, result) => {
      if (err) {
          console.error("Błąd podczas zmniejszania wartości Kwota:", err);
          res.status(500).json({ success: false, error: "Błąd podczas zmniejszania wartości Kwota" });
          return;
      }
      console.log("Wartość Kwota została zmniejszona o " + savingsAmount + " dla właściciela " + ownerName);
      res.json({ success: true });
  });
});