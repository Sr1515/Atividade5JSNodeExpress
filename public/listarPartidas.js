/* Ao carregar a página recebe um json e 
passa ele como paramêtro na função render*/
window.addEventListener("load", () => {
    fetch("http://localhost:3000/listaObjeto")
      .then((resposta) => resposta.json())
      .then((arquivoJson) => {
        render(arquivoJson);
      });
  });
  
  /* Essa função é responsável por renderizar os elementos da página junto
  com suas informações e recebe um arquivo JSON*/
  function render(arquivoJson) {

    /* cria o elemento tabela e tr e define algumas configurações*/
    const tabela = document.getElementById("tabela");
    const topo = document.createElement("tr");
    tabela.innerHTML = null;
    tabela.style.border = "black";

    /* cria e adiciona estilização e nome nas colunas da tabela */
    const tituloPartida = document.createElement("td");
    tituloPartida.textContent = "Titulo";
    tituloPartida.style.width = "300px";
    tituloPartida.style.height = "40px";
    tituloPartida.style.fontSize = "20px";
    tituloPartida.style.textAlign = "center";
    tituloPartida.style.backgroundColor = "#ee964b";

    const localPartida = document.createElement("td");
    localPartida.textContent = "Local";
    localPartida.style.width = "300px";
    localPartida.style.height = "40px";
    localPartida.style.fontSize = "20px";
    localPartida.style.textAlign = "center";
    localPartida.style.backgroundColor = "#ee964b";

    const datahoraPartida = document.createElement("td");
    datahoraPartida.textContent = "Data e Hora";
    datahoraPartida.style.width = "300px";
    datahoraPartida.style.height = "40px";
    datahoraPartida.style.fontSize = "20px";
    datahoraPartida.style.textAlign = "center";
    datahoraPartida.style.backgroundColor = "#ee964b";

    const acoes = document.createElement("td");
    acoes.textContent = "Ações";
    acoes.style.width = "300px";
    acoes.style.height = "40px";
    acoes.style.fontSize = "20px";
    acoes.style.textAlign = "center";
    acoes.style.backgroundColor = "#ee964b";

    // adiciona as colunas na tabela
    topo.append(tituloPartida);
    topo.append(localPartida);
    topo.append(datahoraPartida);
    topo.append(acoes);
    tabela.appendChild(topo);

    /*percorre a constante jogadores com os dados de cada 
    jogador*/ 
    arquivoJson.forEach(element => {

        console.log(arquivoJson);
      /* cria uma linha da tabela e e adiciona estilização para
      o conteúdo de cada td*/
      const elemento = document.createElement("tr");

      const titulo = document.createElement("td");
      titulo.style.height = "30px";
      titulo.style.textAlign = "center";
      titulo.style.fontSize = "20px";

      const local = document.createElement("td");
      local.style.height = "30px";
      local.style.textAlign = "center";
      local.style.fontSize = "20px";

      const datahora = document.createElement("td");
      datahora.style.textAlign = "center"
      datahora.style.height = "30px";
      datahora.style.fontSize = "20px";

      const acoes = document.createElement("td");
      acoes.style.textAlign = "center"

      /* cria um botão que será adicionado em ações com a função
      de remoção, além disso define algumas propriedades de estilização*/
      const botaoDeletar = document.createElement("button");
      botaoDeletar.textContent = "Remover";
      botaoDeletar.style.backgroundColor = "#ff4d6d";
      botaoDeletar.style.borderRadius = "25px"
      botaoDeletar.style.fontSize = "19px"

      const botaoEntrar = document.createElement("button");
      botaoEntrar.textContent = "Acessar";
      botaoEntrar.style.backgroundColor = "green";
      botaoEntrar.style.borderRadius = "25px"
      botaoEntrar.style.fontSize = "19px"

      /* adiciona o valor de element para nome telefone do jogador
      para a respectiva td*/
      titulo.textContent = `${element.titulo}`;
      local.textContent = `${element.local}`;
      datahora.textContent = `${element.dataHora}`;

      /* Adiciona o botaoAcoes na coluna acoes e adiciona dos os tds
      na tr(elemento) e adiciona esse tr na tabela*/
      acoes.append(botaoDeletar);
      acoes.append(botaoEntrar);
      elemento.append(titulo);
      elemento.append(local);
      elemento.append(datahora);
      elemento.append(acoes);
      tabela.appendChild(elemento);

      /* Função resposável por deletar uma partida atráves do paramêtro titulo
      onde passa um fetch com o titulo para /lista, com method DELETE e se der tudo certo
      no then faz uma recarregamento da página para a página de criação de partida*/ 
      botaoDeletar.addEventListener("click", function () {
        fetch(`/lista/${element.titulo}`, {method: "DELETE"})
        .then(() => {
          window.location.replace("http://localhost:3000/");
        });
      });

      botaoEntrar.addEventListener("click", function () {
        fetch(`/pegarElemento/${element.titulo}`, {method: "GET"})
        .then(() =>{
            window.location.replace("http://localhost:3000/lista");
        })
      });
    });      
  }       
