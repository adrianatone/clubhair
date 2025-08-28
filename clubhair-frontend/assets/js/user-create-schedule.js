document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const barbershopId = urlParams.get('barbershopId');
  const serviceId = urlParams.get('serviceId');
  const userData = JSON.parse(localStorage.getItem('user'));

  if (!userData || userData.type !== 'client') {
    alert('Você precisa estar logado como cliente para agendar!');
    window.location.href = '../../pages/user/user-login.html';
    return;
  }

  document.querySelector('.confirm-button').addEventListener('click', async () => {
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    if (!date || !time) {
      alert('Por favor, preencha a data e o horário.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          time,
          clientId: userData.id,
          barbershopId: parseInt(barbershopId),
          serviceId: parseInt(serviceId)
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert('Agendamento realizado com sucesso!');
        window.location.href = '../../pages/user/user-dashboard.html';
      } else {
        alert(result.message || 'Erro ao realizar agendamento.');
      }

    } catch (error) {
      console.error(error);
      alert('Erro de conexão com o servidor.');
    }
  });

  document.querySelector('.back-button').addEventListener('click', () => {
    window.history.back();
  });
});