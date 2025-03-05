document.getElementById('registerForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const phoneNumber = document.getElementById('phoneNumber').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const userData = {
    Imie: firstName,
    Nazwisko: lastName,
    Haslo: password,
    Telefon: phoneNumber,
    Email: email,
  };

  fetch('http://localhost:3000/addUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  })
  .then(response => {
    if (response.ok) {
      console.log('Użytkownik został dodany do bazy danych!');
      document.getElementById('firstName').value = '';
      document.getElementById('lastName').value = '';
      document.getElementById('phoneNumber').value = '';
      document.getElementById('email').value = '';
      document.getElementById('password').value = '';

      alert('Użytkownik został dodany do bazy danych!');
    } else {
      console.error('Dodawanie użytkownika nie powiodło się.');
    }
  })
  .catch(error => {
    console.error('Wystąpił błąd podczas wysyłania żądania:', error);
  });
  AbortController();
});
