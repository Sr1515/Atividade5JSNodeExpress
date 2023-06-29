const content = "database.json";
import fs from "fs/promises";

/* Classe responsável por criar um objeto do tipo partida
com parametros de titulo, local e dataHora. Além disso dentro dela
tem um array onde será guardado objetos do tipo jogador */
class Partida {
    constructor(titulo, local, dataHora){
        this.titulo = titulo;
        this.local = local;
        this.dataHora = dataHora;
        this.jogadores = [];
    }
}

/* Função responsável por criar um objeto JSON com os parametros
nome, telefone e a presenca com um valor padrão de true. Ao final ela 
retorna esse objeto*/ 
const jogador = (nome, telefone, presenca = true) => {
    const obj = {
        "nome": nome,
        "telefone": telefone,
        "presenca": presenca
    }
    return obj;
}


/* Função responsável por ler as informações de um arquivo JSON e retornar
seus valores para serem iterados*/ 
async function lerArquivos() {
    try{
        const arquivo = await fs.readFile(content, 'utf-8');
        const arquivoJson = JSON.parse(arquivo);
        return arquivoJson;
    } catch (erro) {
        console.log(erro);
    }
}

/* Função responsável por receber um arquivo(file) e
 escrever suas informações dentro de um arquivo JSON */
async function escreverArquivos(req, res, file){
    try{
        const arquivo = JSON.stringify(file);
        await fs.writeFile(content, arquivo);
    } catch (erro) {
        console.log(erro);
    }
}

export {Partida, jogador, lerArquivos, escreverArquivos};