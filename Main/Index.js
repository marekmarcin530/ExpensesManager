document.getElementById('expenseForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const Kwota = document.getElementById('expenseAmount').value;
  const Kategoria = document.getElementById('expenseCategory').value;
  const DataWydatku = document.getElementById('expenseDate').value;

  const WydatekDane = {
    Kwota: Kwota,
    Kategoria: Kategoria,
    DataWydatku: DataWydatku,
  };

  fetch('http://localhost:3000/dodajWydatek', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(WydatekDane)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Nie udało się dodać wydatku. Spróbuj ponownie później.');
      }
      return response.json();
    })
    .then(data => {
      alert('Wydatek dodany');
      location.reload();
    })
    .catch(error => {
      alert('Nie udało się dodać wydatku. Spróbuj ponownie później.');
    });
});

document.getElementById('savingsForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const Kwota = document.getElementById('savingsAmount').value;
  const Kategoria = document.getElementById('savingsCategory').value;

  const oszczecnoscDane = {
    Kwota: Kwota,
    Kategoria: Kategoria,
  };

  fetch('http://localhost:3000/dodajOszczednosc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(oszczecnoscDane)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Nie udało się dodać oszczędności. Spróbuj ponownie później.');
      }
      return response.json();
    })
    .then(data => {
      if (data && data.success === 'Dodano oszczędność') {
        alert('Oszczędność dodana');
        location.reload();
      } else {
        throw new Error('Nie udało się dodać oszczędności. Spróbuj ponownie później.');
      }
    })
    .catch(error => {
      console.error('Wystąpił błąd podczas dodawania oszczędności:', error);
    });
});




document.getElementById('savingsDepositForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const Kwota = document.getElementById('savingsDepositAmount').value;

  const WydatekDane = {
    Kwota: Kwota
  };

  fetch('http://localhost:3000/dodajWplateOszczednosc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(WydatekDane)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Nie udało się dodać wpłaty. Spróbuj ponownie później.');
      }
      return response.json();
    })
    .then(data => {
      alert('Wpłata dodana');
      location.reload();
    })
    .catch(error => {
      console.error('Wystąpił błąd podczas dodawania wpłaty:', error);
      alert('Nie udało się dodać wydatku. Spróbuj ponownie później.');
    });
});