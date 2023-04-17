//essa linha vai disponibilizar o uso de variaveis de ambiente
// aqui temos o padrao: 
//Importaçoes principal e variaveis de ambiente
require("dotenv").config();
const express = require("express");

//Configuração do APP
const app = express();
app.use(express.json()); //Possibilita transitar dados usando JSON

//Configuração de banco de dados
const { connection, authenticate } = require("./database/database");
authenticate(connection); //efetivar a conexao
const Cliente = require("./database/cliente"); // tenho que trazer para conf. o model da aplicação
const Endereco = require("./database/endereco");

//Definir as rotas
app.get('/clientes', async (req, res) => {
   //select * form clientes
   const listaClientes = await Cliente.findAll();
   res.status(200).json(listaClientes);
});

app.get('/clientes/:id', async (req, res) => {
    //select * from clientes where id = 5;
    const cliente = await Cliente.findOne({ where: {id: req.params.id }, include: [Endereco] } );
    if(cliente){
        res.json(cliente);
    } else {
        res.status(404).json({message:"Usuario não encontrado"})
    }
})

app.post('/clientes', async (req, res) => {
    //coletar informações do req.body
    const { nome, email, telefone, endereco } = req.body;
    
    try {
        //dentro de novo estara o objeto criado
        const novo = await Cliente.create(
           { nome, email, telefone, endereco }, {
             include: [Endereco]} //Permite inserir cliente e endereço num comando so
            );
        res.status(201).json(novo);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu" })
    }
});

//Escuta de eventos(listen)
app.listen(3000, () => {
    connection.sync({ force: true }) // esse comando gerar as tabelas a partir do model
    // force = ele apaga tuda tabela e recria novamente
    // force é usado somente para a criar as tabelas
    console.log("Servidor rodando em http://localhost:3000");
})

