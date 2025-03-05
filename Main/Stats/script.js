document.addEventListener("DOMContentLoaded", function () {
  const userImie = sessionStorage.getItem('userImie');
  const welcomeMessage = document.getElementById("welcomeMessage");

  // Czy zalogowany
  fetch("http://localhost:3000/checkLoginStatus", {
      method: "GET",
      credentials: "include",
  })
  .then((response) => response.json())
  .then((data) => {
      if (!data.loggedIn) {
          window.location.href = "/Logowanie.html";
      }
  })
  .catch((error) => {
      console.error("Błąd podczas sprawdzania statusu logowania:", error);
  });

  // Username
  fetch("http://localhost:3000/getUsername", {
      method: "GET",
      credentials: "include",
  })
  .then((response) => response.json())
  .then((userData) => {
      welcomeMessage.innerText = "Witaj, " + userData.userImie + "!";
  })
  .catch((error) => {
      console.error("Błąd podczas pobierania nazwy użytkownika:", error);
  });



  // Dane do wykresu
  fetch("http://localhost:3000/expensesChart")
  .then((response) => response.text())
  .then((html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const rows = doc.querySelectorAll('table tbody tr');
      const data = Array.from(rows).map(row => ({
          date: row.children[2].innerText,
          amount: parseFloat(row.children[0].innerText.replace(' zł', '')) 
      }));

      const dates = data.map(entry => entry.date);
      const amounts = data.map(entry => entry.amount);

      const ctx = document.getElementById('expensesChart').getContext('2d');
      new Chart(ctx, {
          type: 'line',
          data: {
              labels: dates,
              datasets: [{
                  label: 'Wydatki',
                  data: amounts,
                  borderColor: 'rgb(75, 192, 192)',
                  tension: 0.1
              }]
          },
          options: {
              scales: {
                  y: {
                      beginAtZero: true,
                      ticks: {
                          callback: function(value, index, values) {
                              return value + " zł";
                          }
                      }
                  }
              }
          }
      });
  })
  .catch((error) => {
      console.error("Błąd podczas pobierania danych:", error);
  });


    // Suma wydatków
fetch("http://localhost:3000/expensesSum", {
  method: "GET",
  credentials: "include",
})
.then((response) => response.text()) 
.then((data) => {
  const expensesSum = document.getElementById("expensesSum");
  expensesSum.innerText = data;
})
.catch((error) => {
  console.error("Błąd podczas pobierania sumy wydatków:", error);
});


fetch("http://localhost:3000/loadSavingsGoals", {
    method: "GET",
    credentials: "include",
})
.then((response) => response.json())
.then((categories) => {
    const savingsCategoryList = document.getElementById("savingsGoal");

    savingsCategoryList.innerHTML = "";

    categories.forEach((category, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<span style="margin-right: 10px;">${category.Kategoria} - ${category.Kwota}zł</span>`;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Usuń";
        deleteButton.addEventListener("click", () => {
            removeItem(listItem, category.Id, category.Kwota);
        });

        listItem.appendChild(deleteButton);
        savingsCategoryList.appendChild(listItem);
    });
})
.catch((error) => {
    console.error("Błąd podczas pobierania kategorii:", error);
});

function removeItem(listItem, savingsId, savingsAmount) {
    fetch("http://localhost:3000/loadSavingsDepositsSum", {
        method: "GET",
        credentials: "include",
    })
    .then((response) => response.json()) 
    .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
            const firstObject = data[0];
            if (firstObject.hasOwnProperty('Kwota')) {
                const savingsSum = firstObject.Kwota;
                console.log(savingsSum);
                console.log("savingsAmount: " + savingsAmount);
                if (savingsAmount <= savingsSum) {
                    if (confirm("Kwota celu oszczędnościowego jest mniejsza lub równa od sumy oszczędności. Czy na pewno chcesz usunąć?")) {
                        sendDeleteRequest(listItem, savingsId);
                        decreaseSavingsAmount(savingsAmount)
                    }
                } else {
                    alert("Kwota celu oszczędnościowego jest większa od sumy oszczędności");
                }
            } else {
                console.error("Brak właściwości 'Kwota' w otrzymanych danych");
            }
        } else {
            console.error("Brak danych lub otrzymane dane nie są tablicą");
        }
    })
    .catch((error) => {
        console.error("Błąd podczas pobierania sumy oszczędności:", error);
    });
}



function decreaseSavingsAmount(savingsAmount) {
    fetch("http://localhost:3000/decreaseSavingsAmount", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ savingsAmount: savingsAmount }),
        credentials: "include",
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.success) {
            location.reload();
        } else {
            alert("Błąd podczas zmniejszania wartości oszczędności. Spróbuj ponownie.");
        }
    })
    .catch((error) => {
        console.error("Błąd podczas wysyłania żądania:", error);
    });
}





function sendDeleteRequest(listItem, savingsId) {
    fetch("http://localhost:3000/deleteSavingsGoal", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ Id: savingsId }),
        credentials: "include",
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.success) {
            alert("Cel oszczędnościowy został pomyślnie usunięty!");
            listItem.parentNode.removeChild(listItem);
        } else {
            alert("Błąd podczas usuwania celu oszczędnościowego. Spróbuj ponownie.");
        }
    })
    .catch((error) => {
        console.error("Błąd podczas wysyłania żądania:", error);
    });
}



// fetch("http://localhost:3000/loadSavingsDeposits", {
//     method: "GET",
//     credentials: "include",
// })
// .then((response) => response.json())
// .then((categories) => {
//     const savingsCategoryList = document.getElementById("savingsDeposits");

//     // Usunięcie istniejących elementów listy
//     savingsCategoryList.innerHTML = "";

//     // Dodanie elementów listy dla każdej kategorii
//     categories.forEach((category, index) => {
//         const listItem = document.createElement("li");
//         listItem.textContent = category.Kwota + "zł";
//         savingsCategoryList.appendChild(listItem);
//     });

// })
// .catch((error) => {
//     console.error("Błąd podczas pobierania kategorii:", error);
// });
  

fetch("http://localhost:3000/loadSavingsDepositsSum", {
    method: "GET",
    credentials: "include",
})
.then((response) => response.json())
.then((data) => {
    if (Array.isArray(data) && data.length > 0) {
        const firstObject = data[0];
        if (firstObject.hasOwnProperty('Kwota')) {
            const savingsSum = firstObject.Kwota;
            const savingsCategoryList = document.getElementById("savingsDepositsSum");
            savingsCategoryList.innerHTML = "";
            const listItem = document.createElement("li");
            listItem.textContent = "Suma wpłat na cele oszczędnościowe: " + savingsSum + "zł";
            savingsCategoryList.appendChild(listItem);
        } else {
            console.error("Brak właściwości 'Kwota' w otrzymanych danych");
        }
    } else {
        console.error("Brak danych lub otrzymane dane nie są tablicą lub tablica jest pusta");
    }
})
.catch((error) => {
    console.error("Błąd podczas pobierania sumy oszczędności:", error);
});


  

});
fetch("http://localhost:3000/loadSavingsSum", {
    method: "GET",
    credentials: "include",
})
.then((response) => response.json())
.then((categories) => {
    const savingsCategoryList = document.getElementById("savingsGoalSum");

    savingsCategoryList.innerHTML = "";

    categories.forEach((category, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = "Suma oszczędności: " + category.Suma + "zł";
        savingsCategoryList.appendChild(listItem);
    });

})
.catch((error) => {
    console.error("Błąd podczas pobierania kategorii:", error);
});