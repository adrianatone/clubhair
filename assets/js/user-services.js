document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const barbershopId = params.get('barbershopId');
  const list = document.querySelector('.service-list');

  if (!barbershopId) {
    alert('Barbearia não encontrada.');
    window.location.href = '../../pages/user/user-barbershop-list.html';
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/services');
    const services = await response.json();

    const filteredServices = services.filter(service => service.barbershopId == barbershopId);

    if (filteredServices.length === 0) {
      list.innerHTML = "<li>Nenhum serviço encontrado para esta barbearia.</li>";
    } else {
      filteredServices.forEach(service => {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${service.name}</strong><br>
          💸 R$ ${parseFloat(service.price).toFixed(2)}<br>
          ⏳ Duração: ${service.duration} min<br>
          <button onclick="window.location.href='../../pages/user/user-create-schedule.html?barbershopId=${barbershopId}&serviceId=${service.id}'">Agendar</button>
        `;
        list.appendChild(li);
      });
    }

  } catch (error) {
    console.error(error);
    list.innerHTML = "<li>Erro ao carregar serviços.</li>";
  }

  document.querySelector('.back-button').addEventListener('click', () => {
    window.location.href = '../../pages/user/user-barbershop-list.html';
  });
});