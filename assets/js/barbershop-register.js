document.querySelector(".login-button")
  .addEventListener("click", async () => {
    const name = document.querySelectorAll("input")[0].value.trim();
    const email = document.querySelectorAll("input")[1].value.trim();
    const password = document.querySelectorAll("input")[2].value;

    if (!name || !email || !password) {
      alert("Preencha todos os campos!");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      alert("Digite um e-mail válido!");
      return;
    }

    if (password.length < 6) {
      alert("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          type: "barbershop",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(
          "Dono da barbearia cadastrado! Agora cadastre os dados da barbearia."
        );
        localStorage.setItem("barbershopUserId", data.id);
        window.location.href = "../../pages/barbershop/barbershop-register2.html";
      } else {
        alert(data.message || "Erro ao cadastrar barbershop.");
        return;
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão com o servidor.");
    }
  });