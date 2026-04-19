document.querySelector('.login-button').addEventListener('click', async () => {
  const email = document.querySelectorAll('input')[0].value;
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

    if (response.ok && data.user.type === 'barbershop') {
      localStorage.setItem('user', JSON.stringify(data.user));
      alert('Login de barbearia realizado com sucesso!');
      console.log(data);
      window.location.href = '../../pages/barbershop/barbershop-dashboard.html';
    } else {
      alert('Usuário não é dono de barbearia ou dados inválidos.');
    }

  } catch (error) {
    console.error('Erro:', error);
    alert('Falha na conexão com o servidor.');
  }
});