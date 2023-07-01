import express from "express";
import { Partida, jogador, lerArquivos, escreverArquivos} from "./utils/functions.js";

import moment from "moment";
moment.locale("pt-br");

const port = 3000; 
const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


/* váriavel responsável por armazenar temporariamente uma referência 
de uma partida, pegando seu titulo*/ 
let cache = {};

// rota responsável por redirecionar para a paǵina home
app.get("/", (req, res) => {
    res.redirect("index.html");
});

// criar um partida e salvar no JSON
app.post("/", (req, res) => {
    let {titulo, local, dataHora} = req.body;
    dataHora = moment(dataHora).format("LLL");
    const novaPartida = new Partida(titulo, local, dataHora);

    lerArquivos()
    .then((data) => {
        const novoDataBase = data;
        novoDataBase.push(novaPartida);
        escreverArquivos(req, res, novoDataBase);
        res.redirect("/listarPartidas");
    })
    .catch((err) => {
        res.json({
            err
        });
    });
});

/* Responsável por pegar a referência de um partida(titulo) e salvar no cache 
para ser utilizado em outras funcionalidades, toda vez que acessar uma partida diferente
o valor do cache é alterado*/
app.get("/pegarReferencia/:titulo", (req, res) => {
    const {titulo} = req.params;
    cache = {
        "titulo": titulo
    };
    res.redirect("/detalhesPartida");
});

// adiciona um jogador em uma partida
app.post("/lista", (req, res) => {
    lerArquivos()
    .then((data) => {
        const {nomeJogador, telefoneJogador} = req.body;
        data.forEach(element => {
            if (element.titulo == cache.titulo){
                element.jogadores.push(jogador(nomeJogador, telefoneJogador));
                escreverArquivos(req, res, data);
                res.redirect('lista.html');
            }
        });
    })
    .catch((err) => {
        res.json({
            err
        });
    });
});


// Rota que envia um json com todos os dados para ser utilizado na pagina /listaPartidas
app.get("/listaObjeto", (req, res) => {
    lerArquivos()
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        res.json({
            err
        });
    });
});

// Rota que envia um json com todos os dados de uma determinada partida
app.get("/listaObjetoId", (req, res) => {
    lerArquivos()
    .then((data) => {
        data.forEach(element => {
            if (element.titulo == cache.titulo){
                res.json(element);
            }
        });
    })
    .catch((err) => {
        res.json({
            err
        });
    });
});

// Rota para deletar uma partida do JSON atráves do titulo dela
app.delete("/lista/:titulo", (req, res) => {
    const novoDataBase = [];
    const {titulo} = req.params;
    lerArquivos()
    .then((data) => {
       data.forEach(element => {
            if (element.titulo != titulo){
                novoDataBase.push(element);
            }
       });
       escreverArquivos(req, res, novoDataBase);
       res.json({
        "status": "ok"
       });
    })
    .catch((err) => {
        res.json({
            err
        });
    });
});


// rota responsável por redirecionar para a paǵina com a lista de partidas
app.get("/listarPartidas", (req, res) => {
    res.redirect("listarPartidas.html");
});

/* rota responsável por redirecionar para um página com as informações
de uma determinada partida selecionada */
app.get("/detalhesPartida", (req, res) => {
    res.redirect("lista.html");
});


// Rota para alterar o status de presença de um jogador pra true ou false
app.patch("/jogador/:telefone", (req, res) => {
    const novoArray = [];
    const {telefone} = req.params;
    lerArquivos()
    .then((data) => {
        const copy = data;
        data.forEach(element => {
            if (element.titulo == cache.titulo){

                element.jogadores.forEach(players => {
                    if(players.telefone == telefone){
                        players.presenca = !players.presenca;
                    }
                    novoArray.push(element);
                });
            }
        });
        copy.jogadores = novoArray;
        escreverArquivos(req, res, copy);
        res.json({
            "status": "ok"
        });
    })
    .catch((err) => {
        res.json({
            err
        });
    });
});


// Rota para deletar um jogador da lista pelo o numero de telefone
app.delete("/jogador/:telefone", (req, res) => {
    let novoArray = [];
    const {telefone} = req.params;
    lerArquivos()
    .then((data) => {
        let novoDataBase = data;

        data.forEach(element => {
            if(element.titulo == cache.titulo){

                element.jogadores.forEach(players => {
                    if (players.telefone != telefone){
                        novoArray.push(players);
                    }
                });
            }
        });

        novoDataBase.forEach(items => {
            if(items.titulo == cache.titulo){
                items.jogadores = novoArray;
            }
        });

        escreverArquivos(req, res, novoDataBase);
        res.json({
            "status": "ok"
        });
    })
    .catch((err) => {
        res.json({
            err
        });
    });
});


app.listen(port, () => {
    console.log(`Executando em http://localhost: ${port}`);
});

