document.querySelector('.login-button').addEventListener('click', async () => {
  const name = document.querySelectorAll('input')[0].value.trim();
  const email = document.querySelectorAll('input')[1].value.trim();
  const password = document.querySelectorAll('input')[2].value;

  if (!name || !email || !password) {
    alert('Preencha todos os campos!');
    return;
  }

  if (!email.includes('@') || !email.includes('.')) {
    alert('Digite um e-mail válido!');
    return;
  }

  if (password.length < 6) {
    alert('A senha precisa ter pelo menos 6 caracteres.');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        password,
        type: 'client'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || 'Erro ao cadastrar usuário.');
      return;
    }

    alert('Usuário cadastrado com sucesso!');
    window.location.href = '../../shared/index.html';
  } catch (error) {
    console.error(error);
    alert('Erro de conexão com o servidor.');
  }
});