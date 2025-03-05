document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const userData = {
    Haslo: password,
    Email: email,
  };

  fetch('http://localhost:3000/loginUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: "include",
    body: JSON.stringify(userData)
  })
  .then(response => {
    if (response.ok) {
      window.location.href = 'Index.html';

    } else {
      response.text().then((errorMessage) => {
        console.error("Błąd serwera:", errorMessage);
        alert("Błąd serwera: " + errorMessage);
      });
    }
  })
  .catch(error => {
    console.error('Wystąpił błąd podczas wysyłania żądania:', error);
  });
});
