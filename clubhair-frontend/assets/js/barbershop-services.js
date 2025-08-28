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
    const barbershopResponse = await fetch(`http://localhost:3000/barbershops`);
    const barbershops = await barbershopResponse.json();

    const match = barbershops.find(shop => shop.userId === user.id);
    if (!match) {
      alert('Barbearia não encontrada no banco. Cadastre primeiro!');
      return;
    }

    barbershopId = match.id;
  } catch (error) {
    console.error(error);
    alert('Erro ao buscar barbearia no servidor.');
    return;
  }

  const list = document.querySelector('.service-list');

  async function loadServices() {
    try {
      const response = await fetch(`http://localhost:3000/services?barbershopId=${barbershopId}`);
      const services = await response.json();
      list.innerHTML = '';

      if (services.length === 0) {
        list.innerHTML = '<li>Nenhum serviço cadastrado.</li>';
      } else {
        services.forEach(service => {
          const li = document.createElement('li');
          li.innerHTML = `${service.name} - R$ ${service.price} | ${service.duration} min 
          <button onclick="deleteService(${service.id})">Excluir</button>`;
          list.appendChild(li);
        });
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao buscar serviços.');
    }
  }

  loadServices();

  document.getElementById('addServiceBtn').addEventListener('click', async () => {
    const name = document.getElementById('serviceName').value.trim();
    const price = parseFloat(document.getElementById('servicePrice').value);
    const duration = parseInt(document.getElementById('serviceDuration').value);

    if (!name || !price || !duration) {
      alert('Preencha todos os campos corretamente.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          price,
          duration,
          barbershopId: barbershopId
        })
      });

      if (response.ok) {
        alert('Serviço adicionado com sucesso!');
        loadServices();
      } else {
        alert('Erro ao adicionar serviço.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro de conexão.');
    }
  });

  window.deleteService = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;

    try {
      const response = await fetch(`http://localhost:3000/services/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Serviço removido!');
        loadServices();
      } else {
        alert('Erro ao excluir serviço.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro de conexão.');
    }
  }

  document.querySelector('.back-button').addEventListener('click', () => {
    window.location.href = '../../pages/barbershop/barbershop-dashboard.html';
  });
});