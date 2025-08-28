document.addEventListener('DOMContentLoaded', async () => {
  const userData = localStorage.getItem('user');

  if (!userData) {
    alert('Você precisa estar logado como barbearia.');
    window.location.href = '../../pages/barbershop/barbershop-login.html';
    return;
  }

  const user = JSON.parse(userData);
  if (user.type !== 'barbershop') {
    alert('Acesso restrito! Faça login como barbearia.');
    window.location.href = '../../pages/barbershop/barbershop-login.html';
    return;
  }

  let barbershopId = null;

  try {
    const res = await fetch(`http://localhost:3000/barbershops`);
    const barbershops = await res.json();
    const match = barbershops.find(shop => shop.userId === user.id);

    if (!match) {
      alert('Barbearia não encontrada. Faça o cadastro completo primeiro!');
      return;
    }

    barbershopId = match.id;

    document.getElementById('barbershopName').value = match.name;
    document.getElementById('barbershopPhone').value = match.phone;
    document.getElementById('barbershopAddress').value = match.address;

  } catch (error) {
    console.error(error);
    alert('Erro ao carregar dados da barbearia.');
  }

  document.querySelector('.save-button').addEventListener('click', async () => {
    const name = document.getElementById('barbershopName').value.trim();
    const phone = document.getElementById('barbershopPhone').value.trim();
    const address = document.getElementById('barbershopAddress').value.trim();

    if (!name || !phone || !address) {
      alert('Preencha todos os campos!');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/barbershops/${barbershopId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, address })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Perfil atualizado com sucesso!');
      } else {
        alert(data.message || 'Erro ao atualizar perfil.');
      }

    } catch (error) {
      console.error(error);
      alert('Erro de conexão com o servidor.');
    }
  });

  document.querySelector('.back-button').addEventListener('click', () => {
    window.location.href = '../../pages/barbershop/barbershop-dashboard.html';
  });

  document.querySelector('.delete-button').addEventListener('click', async () => {
    if (!confirm('Tem certeza que deseja excluir sua barbearia? Esta ação é irreversível!')) return;

    try {
      const response = await fetch(`http://localhost:3000/barbershops/${barbershopId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Barbearia excluída com sucesso!');
        localStorage.removeItem('user');
        window.location.href = '../../shared/index.html';
      } else {
        alert('Erro ao excluir barbearia.');
      }

    } catch (error) {
      console.error(error);
      alert('Erro de conexão com o servidor.');
    }
  });
});