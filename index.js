import express from "express";
import { Partida, jogador, lerArquivos, escreverArquivos} from "./utils/functions.js";
import moment from "moment";
moment.locale("pt-br");
const port = 3000; 
const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Rotas da aplicação 

let cache = {};

// Home page router
app.get("/", (req, res) => {
    res.redirect("index.html");
});

app.get("/listarPartidas", (req, res) => {
    res.redirect("listarPartidas.html");
});

// criar um partida e salvar no JSON
app.post("/", (req, res) => {
    let {titulo, local, dataHora} = req.body;
    dataHora = moment(dataHora).format("LLL");
    const partidaCriar = new Partida(titulo, local, dataHora);
    lerArquivos()
    .then((arquivo) => {
        const novoArquivo = arquivo;
        novoArquivo.push(partidaCriar);
        escreverArquivos(req, res, novoArquivo);
        res.redirect("/listarPartidas");
    })
    .catch((err) =>{
        res.json({
            err
        });
    });
});

// Rota para a lista de jogadores da partida
app.get("/pegarElemento/:titulo", (req, res) => {
    const {titulo} = req.params;
    cache = {
        "titulo": titulo
    };
    res.redirect("/lista")
});

app.get("/lista", (req, res) => {
    res.redirect("lista.html");
});

// adicionar um jogador na partida
app.post("/lista", (req, res) => {
    lerArquivos()
    .then((arquivo) => {
        const {nomeJogador, telefoneJogador} = req.body;
        arquivo.forEach(element => {
            if (element.titulo == cache.titulo){
                element.jogadores.push(jogador(nomeJogador, telefoneJogador));
                escreverArquivos(req, res, arquivo);
                res.redirect('/lista');
            }
        });
    });
});


// Rota que envia um json com todos os dados para ser utilizado na pagina /lista
app.get("/listaObjeto", (req, res) => {
    lerArquivos()
    .then((data) => {
        res.json(data);
    });
});

app.get("/listaObjetoId", (req, res) => {
    lerArquivos()
    .then((arquivo) => {
        console.log(cache)
        arquivo.forEach(element => {
            if (element.titulo == cache.titulo){
                res.json(element);
            }
        });
    });
});

// Rota para deletar partida do JSON
app.delete("/lista/:titulo", (req, res) => {
    const novoArquivo = [];
    const {titulo} = req.params;
    lerArquivos()
    .then((arquivo) => {
       arquivo.forEach(element => {
            if (element.titulo != titulo){
                novoArquivo.push(element);
            }
       });
       escreverArquivos(req, res, novoArquivo);
       res.json({
        "status": "ok"
       });
    });
});



// Rota para alterar o status de presença de um jogador pra true ou false
app.patch("/jogador/:telefone", (req, res) => {
    const novoArray = [];
    const {telefone} = req.params;
    lerArquivos()
    .then((arquivo) => {
        const copy = arquivo;
        arquivo.forEach(element => {
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
    });
});


// Rota para deletar um jogador da lista pelo o numero de telefone
app.delete("/jogador/:telefone", (req, res) => {
    let novoArray = [];
    const {telefone} = req.params;
    lerArquivos()
    .then((arquivo) => {
        let novoArquivo = arquivo;

        arquivo.forEach(element => {
            if(element.titulo == cache.titulo){
                element.jogadores.forEach(players => {
                    if (players.telefone != telefone){
                        novoArray.push(players);
                    }
                }) 
            }
        });

        console.log(novoArray);

        novoArquivo.forEach(items => {
            console.log(items)
            if(items.titulo == cache.titulo){
                items.jogadores = novoArray;
            }
        });
        escreverArquivos(req, res, novoArquivo);
        res.json({
            "status": "ok"
        });
    })
});


app.listen(port, () => {
    console.log(`Executando em http://localhost: ${port}`);
});

