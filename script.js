document.addEventListener("DOMContentLoaded", function () {
  //Criei as vars para ter controle do ID de cada página
  const form = document.getElementById("criarEventoForm");
  const listaEventos = document.getElementById("listaEventos");
  const destaques = document.getElementById("destaques");
  const detalhesEvento = document.getElementById("detalhesEvento");

  //Se a FORM for carregada, dentro dela vou verificar o botão de submit, no qual vai criar um nov
  //objeto de evento e irá pegar os valores atribuídos em cada input
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const novoEvento = {
        titulo: form.titulo.value,
        tipo: form.tipo.value,
        data: form.data.value,
        descricao: form.descricao.value,
        imagem: form.imagem.value,
        local: form.local.value,
      };
      salvarEvento(novoEvento);
      form.reset(); //Ao chamar o método salvarEvento() o formulário reinciará

      alert("Evento criado com sucesso!✅");
    });
  }

  function salvarEvento(evento) {
    //Criei uma var de eventos e guardo ela dentro do localStorage (Utilizo setItem para salvar e getItem para chamar)
    //Local storage é usado para manter dados entre sessões do navegador
    const eventos = JSON.parse(localStorage.getItem("eventos")) || [];
    eventos.push(evento);
    localStorage.setItem("eventos", JSON.stringify(eventos));
    carregarEventos();
  }

  function carregarEventos() {
    //Chamo o que salvei no localStorage
    const eventos = JSON.parse(localStorage.getItem("eventos")) || [];
    if (listaEventos) {
      //Se a lista de eventos for chamada, ela carregará a lista de eventos através do FOREACH
      listaEventos.innerHTML = "";
      eventos.forEach((evento, index) => {
        const eventoDiv = document.createElement("div");
        eventoDiv.className = "evento";
        eventoDiv.innerHTML = `
                    <h3 class="titulo">${evento.titulo}</h3>
                    <p>Evento ${evento.tipo}</p>
                    <p>${inverterData(evento.data)}</p>
                    <p>${evento.local}</p>
                    <button class="ver_detalhes" onclick="verDetalhes(${index})">Ver Detalhes</button> 
                    <button class="excluir" onclick="excluirEvento(${index})">Excluir</button>
                `;
        listaEventos.appendChild(eventoDiv);
      });
    }
    if (destaques) {
      //O mesmo com os eventos em detaque
      destaques.innerHTML = "";
      eventos.slice(0, 4).forEach((evento) => {
        const eventoDiv = document.createElement("div");
        eventoDiv.className = "evento";
        eventoDiv.innerHTML = `
                    <h3 class="titulo">${evento.titulo}</h3>
                    <p>Evento ${evento.tipo}</p>
                    <p>${inverterData(evento.data)}</p>
                    <p>${evento.local}</p>
                `;
        destaques.appendChild(eventoDiv); //Cola a div em destaques
      });
    }
  }

  window.verDetalhes = function (index) {
    localStorage.setItem("eventoIndex", index);
    window.location.href = "detalhes_eventos.html";
  };

  window.excluirEvento = function (index) {
    const eventos = JSON.parse(localStorage.getItem("eventos")) || [];
    eventos.splice(index, 1); // Remove evento específico da lista
    localStorage.setItem("eventos", JSON.stringify(eventos)); // Atualiza lista de eventos
    carregarEventos();
    alert("Evento excluído com sucesso!❌");
  };

  function inverterData(data) {
    return data.split("-").reverse().join("/"); //Funcção aplicada no (evento.data) inverte a data para o padrão que conhecemos
  }

  if (detalhesEvento) {
    //Se for a página detalhesEvento e ele for diferente de null, eu crio um const EVENTOS que recebe os itens de Eventos
    //guardados no localStorage
    const eventoIndex = localStorage.getItem("eventoIndex");
    if (eventoIndex !== null) {
      //Verifica se estamos na página detalhes_eventos.html e se há um índice de evento armazenado no localStorage.
      //Se essas condições forem atendidas, ele carrega os eventos armazenados no localStorage e exibe os detalhes do evento correspondente na página.
      const eventos = JSON.parse(localStorage.getItem("eventos")) || [];
      const evento = eventos[eventoIndex];
      const detalhesEvento = document.getElementById('detalhesEvento');
      detalhesEvento.innerHTML = `
          <div class="evento-detalhes">
              <div class="evento-textos">
                  <h2 class="titulo">${evento.titulo}</h2>
                  <p>Evento ${evento.tipo}</p>
                  <p>${inverterData(evento.data)}</p>
                  <p>${evento.local}</p>
                  <p>${evento.descricao}</p>
              </div>
              <div class="evento-imagem">
                  <img src="${evento.imagem}" alt="${evento.titulo}">
              </div>
          </div>
      `;
    }
  }

  carregarEventos(); //Garante que a lista seja atualizada sempre que necessário
});
