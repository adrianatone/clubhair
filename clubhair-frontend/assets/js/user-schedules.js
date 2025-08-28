document.addEventListener('DOMContentLoaded', async () => {
  const userData = localStorage.getItem('user');
  const grid = document.querySelector('.schedule-grid');
  const backButton = document.getElementById('backBtn');

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

  try {
    const barbershops = await fetch('http://localhost:3000/barbershops').then(res => res.json());
    const response = await fetch(`http://localhost:3000/schedules/filter?clientId=${user.id}`);
    const schedules = await response.json();

    if (schedules.length === 0) {
      grid.innerHTML = "<p class='empty'>Você não possui agendamentos.</p>";
    } else {
      schedules.forEach(schedule => {
        const barbershop = barbershops.find(b => b.id === schedule.barbershopId);
        const date = new Date(schedule.date).toLocaleDateString('pt-BR');

        const div = document.createElement('div');
        div.className = 'schedule-card';
        div.innerHTML = `
          <strong>Barbearia:</strong> ${barbershop ? barbershop.name : 'Desconhecida'}<br>
          <strong>Endereço:</strong> ${barbershop ? barbershop.address : 'Não informado'}<br>
          <strong>Data:</strong> ${date}<br>
          <strong>Horário:</strong> ${schedule.time}<br>
          <strong>Status:</strong> ${schedule.status}
        `;

        if (schedule.status === 'pending') {
          const cancelBtn = document.createElement('button');
          cancelBtn.textContent = 'Cancelar';
          cancelBtn.className = 'cancel-button';
          cancelBtn.onclick = async () => {
            if (confirm('Deseja cancelar este agendamento?')) {
              const cancelResponse = await fetch(`http://localhost:3000/schedules/${schedule.id}/cancel`, { method: 'PUT' });
              const result = await cancelResponse.json();
              if (cancelResponse.ok) {
                alert('Agendamento cancelado com sucesso!');
                location.reload();
              } else {
                alert(result.message || 'Erro ao cancelar agendamento.');
              }
            }
          };
          div.appendChild(cancelBtn);
        }

        grid.appendChild(div);
      });
    }
  } catch (error) {
    console.error(error);
    grid.innerHTML = "<p class='empty'>Erro ao buscar agendamentos.</p>";
  }

  backButton.addEventListener('click', () => {
    window.location.href = '../../pages/user/user-dashboard.html';
  });
});