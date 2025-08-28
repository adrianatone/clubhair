document.addEventListener('DOMContentLoaded', async () => {
  const userData = localStorage.getItem('user');
  const grid = document.querySelector('.schedule-grid');
  const backButton = document.getElementById('backBtn');

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

  try {
    const barbershops = await fetch('http://localhost:3000/barbershops').then(res => res.json());
    const myShop = barbershops.find(shop => shop.userId === user.id);
    if (!myShop) {
      grid.innerHTML = "<p class='empty'>Nenhuma barbearia vinculada ao seu usuário.</p>";
      return;
    }

    const response = await fetch(`http://localhost:3000/schedules/filter?barbershopId=${myShop.id}`);
    const schedules = await response.json();

    if (schedules.length === 0) {
      grid.innerHTML = "<p class='empty'>Nenhum agendamento recebido ainda.</p>";
    } else {
      for (const schedule of schedules) {
        const clientRes = await fetch(`http://localhost:3000/users/${schedule.clientId}`);
        const client = await clientRes.json();

        const serviceRes = await fetch(`http://localhost:3000/services/${schedule.serviceId}`);
        const service = await serviceRes.json();

        const date = new Date(schedule.date).toLocaleDateString('pt-BR');

        const div = document.createElement('div');
        div.className = 'schedule-card';
        div.innerHTML = `
          <strong>Cliente:</strong> ${client.name}<br>
          <strong>Serviço:</strong> ${service.name}<br>
          <strong>Data:</strong> ${date}<br>
          <strong>Horário:</strong> ${schedule.time}<br>
          <strong>Status:</strong> ${schedule.status}
        `;

        // Confirmar Agendamento
        if (schedule.status === 'pending') {
          const confirmBtn = document.createElement('button');
          confirmBtn.textContent = 'Confirmar';
          confirmBtn.className = 'confirm-button';
          confirmBtn.onclick = async () => {
            const res = await fetch(`http://localhost:3000/schedules/${schedule.id}/status`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'confirmed' })
            });

            if (res.ok) {
              alert('Agendamento confirmado!');
              location.reload();
            } else {
              alert('Erro ao confirmar. Tente novamente.');
            }
          };
          div.appendChild(confirmBtn);
        }

        // Concluir Agendamento
        if (schedule.status === 'confirmed') {
          const completeBtn = document.createElement('button');
          completeBtn.textContent = 'Concluir';
          completeBtn.className = 'complete-button';
          completeBtn.onclick = async () => {
            const res = await fetch(`http://localhost:3000/schedules/${schedule.id}/status`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'completed' })
            });

            if (res.ok) {
              alert('Agendamento concluído!');
              location.reload();
            } else {
              alert('Erro ao concluir. Tente novamente.');
            }
          };
          div.appendChild(completeBtn);
        }

        // Cancelar Agendamento (disponível somente se não for finalizado ou cancelado)
        if (schedule.status !== 'canceled' && schedule.status !== 'completed') {
          const cancelBtn = document.createElement('button');
          cancelBtn.textContent = 'Cancelar';
          cancelBtn.className = 'cancel-button';
          cancelBtn.onclick = async () => {
            if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
              const res = await fetch(`http://localhost:3000/schedules/${schedule.id}/cancel`, { method: 'PUT' });
              if (res.ok) {
                alert('Agendamento cancelado!');
                location.reload();
              } else {
                alert('Erro ao cancelar. Tente novamente.');
              }
            }
          };
          div.appendChild(cancelBtn);
        }

        grid.appendChild(div);
      }
    }
  } catch (error) {
    console.error(error);
    grid.innerHTML = "<p class='empty'>Erro ao buscar agendamentos.</p>";
  }

  backButton.addEventListener('click', () => {
    window.location.href = '../../pages/barbershop/barbershop-dashboard.html';
  });
});
