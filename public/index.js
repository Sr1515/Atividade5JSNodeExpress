/* Ao carregar a página recebe um json e 
passa ele como paramêtro na função render*/
window.addEventListener("load", () => {
    fetch("http://localhost:3000/listaObjetoId")
      .then((resposta) => resposta.json())
      .then((arquivoJson) => {
        console.log(arquivoJson);
        render(arquivoJson);
      });
  });
  
  /* Essa função é responsável por carregar as informações da partida
  na página lista de jogadores, onde recebe o arquivo JSON */
  function carregarInformacoes(PartidaJogo) {

    const menu = document.querySelector("#informacoes");

    const tituloPartida = document.querySelector("#tituloPartida");
    const localPartida = document.querySelector("#localPartida");
    const dataHoraPartida = document.querySelector("#dataHoraPartida");

    tituloPartida.textContent = `Nome da Partida: ${PartidaJogo.titulo}`;

    localPartida.textContent = `Local: ${PartidaJogo.local}`;

    dataHoraPartida.textContent = `Data e Hora: ${PartidaJogo.dataHora}`;

    menu.appendChild(tituloPartida);
    menu.appendChild(localPartida);
    menu.appendChild(dataHoraPartida);
  }

  /* Essa função é responsável por renderizar os elementos da página junto
  com suas informações e recebe um arquivo JSON*/
  function render(arquivoJson) {

    // Chama a função carregarInformações no ínicio do render
    carregarInformacoes(arquivoJson);


    const jogadores = [];
    Array.from(arquivoJson.jogadores).forEach(element => {
        jogadores.push(element);
    });
    

    /* cria o elemento tabela e tr e define algumas configurações*/
    const tabela = document.getElementById("tabela");
    const topo = document.createElement("tr");
    tabela.innerHTML = null;
    tabela.style.border = "black";

    /* cria e adiciona estilização e nome nas colunas da tabela */
    const nome = document.createElement("td");
    nome.textContent = "Nome";
    nome.style.width = "300px";
    nome.style.height = "40px";
    nome.style.fontSize = "20px";
    nome.style.textAlign = "center";
    nome.style.backgroundColor = "#ee964b";

    const telefone = document.createElement("td");
    telefone.textContent = "Telefone";
    telefone.style.width = "300px";
    telefone.style.height = "40px";
    telefone.style.fontSize = "20px";
    telefone.style.textAlign = "center";
    telefone.style.backgroundColor = "#ee964b";

    const presenca = document.createElement("td");
    presenca.textContent = "Presença";
    presenca.style.width = "300px";
    presenca.style.height = "40px";
    presenca.style.fontSize = "20px";
    presenca.style.textAlign = "center";
    presenca.style.backgroundColor = "#ee964b";

    const acoesTabela = document.createElement("td");
    acoesTabela.textContent = "Ações";
    acoesTabela.style.width = "300px";
    acoesTabela.style.height = "40px";
    acoesTabela.style.fontSize = "20px";
    acoesTabela.style.textAlign = "center";
    acoesTabela.style.backgroundColor = "#ee964b";

    // adiciona as colunas na tabela
    topo.append(nome);
    topo.append(telefone);
    topo.append(presenca);
    topo.append(acoesTabela);
    tabela.appendChild(topo);

    /*percorre a constante jogadores com os dados de cada 
    jogador*/ 
    jogadores.forEach(element => {
      
      /* cria uma linha da tabela e e adiciona estilização para
      o conteúdo de cada td*/
      const elemento = document.createElement("tr");

      const nomeJogador = document.createElement("td");
      nomeJogador.style.height = "30px";
      nomeJogador.style.textAlign = "center";
      nomeJogador.style.fontSize = "20px";

      const telefoneJogador = document.createElement("td");
      telefoneJogador.style.height = "30px";
      telefoneJogador.style.textAlign = "center";
      telefoneJogador.style.fontSize = "20px";

      const presencaJogador = document.createElement("td");
      presencaJogador.style.textAlign = "center"

      const acoes = document.createElement("td");
      acoes.style.textAlign = "center"

      /* cria um botão que será adicionado em ações com a função
      de remoção, além disso define algumas propriedades de estilização*/
      const botaoAcoes = document.createElement("button");
      botaoAcoes.textContent = "Remover";
      botaoAcoes.style.backgroundColor = "#ff4d6d";
      botaoAcoes.style.borderRadius = "25px"
      botaoAcoes.style.fontSize = "19px"

      /* cria um input do tipo checkbox definindo algumas propriedades
      e adiciona ele na coluna de presença do jogador*/ 
      const input = document.createElement('input');
      input.type = "checkbox";
      input.name = "name";
      input.checked = element.presenca;
      presencaJogador.append(input);

      /* verifica se a presença do jogador é verdadeira na
      partida e se verdadeira, muda a cor da tr(elemento) para
      verde, incando sua presença na partida*/ 
      if (element.presenca) {
        elemento.style.backgroundColor = "#90ee90";
      }
      
      /* adiciona o valor de element para nome telefone do jogador
      para a respectiva td*/
      nomeJogador.textContent = `${element.nome}`;
      telefoneJogador.textContent = `${element.telefone}`;

      /* Adiciona o botaoAcoes na coluna acoes e adiciona dos os tds
      na tr(elemento) e adiciona esse tr na tabela*/
      acoes.append(botaoAcoes);
      elemento.append(nomeJogador);
      elemento.append(telefoneJogador);
      elemento.append(presencaJogador);
      elemento.append(acoes);
      tabela.appendChild(elemento);

      // cria uma constante que pega um botão delete no html
      const buttonDeletePartida = document.querySelector("#button-delete");


      /* Função resposável por deletar uma partida atráves do paramêtro titulo
      onde passa um fetch com o titulo para /lista, com method DELETE e se der tudo certo
      no then faz uma recarregamento da página para a página de criação de partida*/ 
      buttonDeletePartida.addEventListener("click", function () {
        fetch(`/lista/${arquivoJson.titulo}`, {method: "DELETE"})
        .then(() => {
          window.location.replace("http://localhost:3000/listarPartidas");
        });
      });

      /* Função resposável por alterar o status de presença de um jogador, onde
      é passado o número de telefone com um id dele, já que o número de telefone não
      se repete, onde passa um fetch com o telefone para /jogador, com method PATCH e 
      se der tudo certo no then faz uma recarregamento da página para a página com a lista de jogadores */ 
      input.addEventListener("click",  function() {
        fetch(`/jogador/${element.telefone}`, {method: "PATCH"})
        .then(() => {
          window.location.replace("http://localhost:3000/lista.html");
        })
      })

      /* Função resposável por deletar o um jogador, onde
      é passado o número de telefone com um id dele, já que o número de telefone não
      se repete, onde passa um fetch com o telefone para /jogador, com method DELETE e 
      se der tudo certo no then faz uma recarregamento da página para a página com a lista de jogadores*/
      botaoAcoes.addEventListener("click", function () {
        fetch(`/jogador/${element.telefone}`, {method: "DELETE"})
        .then( () => {
          window.location.replace("http://localhost:3000/lista.html");
        })
      });    
    });   
  }       
