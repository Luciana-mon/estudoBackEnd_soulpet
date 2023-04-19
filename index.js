//essa linha vai disponibilizar o uso de variaveis de ambiente
// aqui temos o padrao: 
//Importaçoes principal e variaveis de ambiente
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");

//Configuração do APP
const app = express();
app.use(express.json()); //Possibilita transitar dados usando JSON
app.use(morgan("dev"));

//Configuração de banco de dados
const { connection, authenticate } = require("./database/database");
authenticate(connection); //efetivar a conexao


//Definição de rotas
const rotasClientes = require("./routes/clientes");
const rotasPets = require("./routes/pets");

//junta ao app as rotas dos arquivos
app.use(rotasClientes);
app.use(rotasPets);



//Escuta de eventos(listen)
app.listen(3000, () => {
    connection.sync() // esse comando gerar as tabelas a partir do model
    //force: true dentro do sync
    // force = ele apaga tuda tabela e recria novamente
    // force é usado somente para a criar as tabelas
    console.log("Servidor rodando em http://localhost:3000");
})

