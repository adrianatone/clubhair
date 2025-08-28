document.addEventListener("DOMContentLoaded", () => {
  const userData = localStorage.getItem("user");

  if (!userData) {
    alert("Você precisa estar logado como barbearia.");
    window.location.href = "../../pages/barbershop/barbershop-login.html";
    return;
  }

  let user;
  try {
    user = JSON.parse(userData);
  } catch (e) {
    alert("Dados inválidos, refaça o login.");
    localStorage.removeItem("user");
    window.location.href = "../../pages/barbershop/barbershop-login.html";
    return;
  }

  if (user.type !== "barbershop") {
    alert("Acesso restrito! Faça login como barbearia.");
    window.location.href = "../../pages/barbershop/barbershop-login.html";
    return;
  }

  document.querySelector(".user-name").innerText = user.name;

  document.querySelector(".logout-button").addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "../../shared/index.html";
  });
});
