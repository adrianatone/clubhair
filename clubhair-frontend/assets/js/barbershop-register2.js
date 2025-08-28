document.querySelector('.login-button').addEventListener('click', async () => {
  const name = document.querySelectorAll('input')[0].value.trim();
  const phone = document.querySelectorAll('input')[1].value.trim();
  const address = document.querySelectorAll('input')[2].value.trim();
  const userId = localStorage.getItem('barbershopUserId');

  if (!name || !phone || !address) {
    alert('Preencha todos os campos!');
    return;
  }

  if (!/^\d{9,}$/.test(phone)) {
    alert('Digite um telefone válido (mínimo 9 dígitos).');
    return;
  }
  if (!userId) {
    alert('Erro: Usuário não encontrado. Refazer cadastro.');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/barbershops', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        phone,
        address,
        userId: parseInt(userId)
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert('Dados da barbearia cadastrados com sucesso!');
      localStorage.removeItem('barbershopUserId');
      window.location.href = "../../shared/index.html";
    } else {
      alert(data.message || 'Erro ao cadastrar barbearia.');
    }

  } catch (error) {
    console.error(error);
    alert('Erro de conexão com o servidor.');
  }
});