document.addEventListener('DOMContentLoaded', () => {
  const userData = localStorage.getItem('user');

  if (!userData) {
    alert('Você precisa estar logado como cliente.');
    window.location.href = '../../pages/user/user-login.html';
    return;
  }

  const user = JSON.parse(userData);

  if (user.type !== 'client') {
    alert('Acesso restrito! Faça login como cliente.');
    window.location.href = '../../pages/user/user-login.html';
    return;
  }

  document.getElementById('userName').value = user.name;
  document.getElementById('userEmail').value = user.email;

  document.querySelector('.save-button').addEventListener('click', async () => {
    const name = document.getElementById('userName').value.trim();
    const password = document.getElementById('userPassword').value;

    if (!name) {
      alert('O nome não pode estar vazio!');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password: password || user.password })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Perfil atualizado com sucesso!');
        user.name = name;
        localStorage.setItem('user', JSON.stringify(user));
        document.getElementById('userPassword').value = "";
      } else {
        alert(data.message || 'Erro ao atualizar perfil.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro de conexão com o servidor.');
    }
  });

  document.querySelector('.delete-button').addEventListener('click', async () => {
    if (!confirm('Tem certeza que deseja excluir sua conta? Essa ação é irreversível.')) return;

    try {
      const response = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Conta excluída com sucesso!');
        localStorage.removeItem('user');
        window.location.href = '../../shared/index.html';
      } else {
        const data = await response.json();
        alert(data.message || 'Erro ao excluir conta.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro de conexão com o servidor.');
    }
  });

  document.querySelector('.back-button').addEventListener('click', () => {
    window.location.href = '../../pages/user/user-dashboard.html';
  });
});