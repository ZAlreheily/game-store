async function addUser() {
    const email = document.getElementById("email-78b8").value;
    const password = document.getElementById("password-708d").value;

    const response = await fetch(`/signup`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "email": email, "password": password }),
    })
    window.location.href = "/login"
  }

  async function login() {
    const email = document.getElementById("email-708d").value;
    const password = document.getElementById("password-708d").value;

    const response = await fetch(`/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "email": email, "password": password }),
    })
    window.location.href = "/"
  }