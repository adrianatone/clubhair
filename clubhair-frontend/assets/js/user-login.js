document.querySelector('.login-button').addEventListener('click', async () => {
  const email = document.querySelectorAll('input')[0].value.trim();
  const password = document.querySelectorAll('input')[1].value;

  if (!email || !password) {
    alert('Preencha todos os campos!');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      alert(`Bem-vindo, ${data.user.name}!`);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = "../../pages/user/user-dashboard.html";
    } else {
      alert(data.message || 'Erro ao fazer login.');
    }

  } catch (error) {
    console.error(error);
    alert('Erro de conexão com o servidor.');
  }
});