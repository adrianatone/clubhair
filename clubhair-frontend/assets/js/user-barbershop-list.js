document.addEventListener("DOMContentLoaded", async () => {
  const list = document.querySelector(".barbershop-list");

  try {
    const response = await fetch("http://localhost:3000/barbershops");
    const barbershops = await response.json();

    if (barbershops.length === 0) {
      list.innerHTML =
        "<li>Nenhuma barbearia cadastrada no momento.</li>";
    }

    barbershops.forEach((shop) => {
      const li = document.createElement("li");
      li.innerHTML = `
      <strong>${shop.name}</strong><br>
      📞 ${shop.phone}<br>📍 ${shop.address}<br>
      <button onclick="window.location.href='../../pages/user/user-services.html?barbershopId=${shop.id}'">Ver Serviços</button>
      `;
      list.appendChild(li);
    });
  } catch (error) {
    console.error(error);
    list.innerHTML = "<li>Erro ao carregar barbearias.</li>";
  }

  document.querySelector(".back-button").addEventListener("click", () => {
    window.location.href = "../../pages/user/user-dashboard.html";
  });
});