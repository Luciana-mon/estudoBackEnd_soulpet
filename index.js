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
const Pet = require("./database/pet");

//Definir as rotas Clientes
app.get('/clientes', async (req, res) => {
    //select * form clientes
    const listaClientes = await Cliente.findAll();
    res.status(200).json(listaClientes);
});

app.get('/clientes/:id', async (req, res) => {
    //select * from clientes where id = 5;
    const cliente = await Cliente.findOne({ where: { id: req.params.id }, include: [Endereco] });
    if (cliente) {
        res.json(cliente);
    } else {
        res.status(404).json({ message: "Usuario não encontrado" })
    }
});

app.post('/clientes', async (req, res) => {
    //coletar informações do req.body
    const { nome, email, telefone, endereco } = req.body;

    try {
        //dentro de novo estara o objeto criado
        const novo = await Cliente.create(
            { nome, email, telefone, endereco }, {
            include: [Endereco]
        } //Permite inserir cliente e endereço num comando so
        );
        res.status(201).json(novo);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu" })
    }
});

// atualizar o cliente pelo id
app.put("/clientes/:id", async (req, res) => {
    const { nome, email, telefone, endereco } = req.body;
    const { id } = req.params;

    try {
        const cliente = await Cliente.findOne({ where: { id } });
        if (cliente) {
            if (endereco) {
                await Endereco.update(endereco, { where: { clienteId: id } });
            }
            await cliente.update({ nome, email, telefone });
            res.status(200).json({ message: "Cliente editado!" });
        }
        else {
            res.status(404).json({ message: "Cliente não encontrado" })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Um erro aconteceu!" })
    }
});

//rota de deletar um cliente
app.delete("/clientes/:id", async (req, res) => {
    const { id } = req.params;
    const cliente = await Cliente.findOne({ where: { id } });

    try {
        if (cliente) {
            await cliente.destroy();
            res.status(200).json({ message: "Cliente removido" });
        }
        else {
            res.status(404).json({ message: "Cliente não encontrado" })
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu" })
    }
});

//Definir rotas para Pets
app.get("/pets", async (req, res) => {
    const listaPets = await Pet.findAll();
    res.json(listaPets);
});

// buscar pets por id
app.get("/pets/:id", async (req, res) => {
    const {id} = req.params;

    const buscarPet = await Pet.findByPk(id);
    if(buscarPet){
        res.json(buscarPet);
    }
    else {
        res.status(404).json({message: "Pet nao encontrado"})
    }
})

//add pet
app.post('/pets', async (req, res) => {
    const { nome, tipo, porte, dataNasc, clienteId } = req.body;

    try {
        const cliente = await Cliente.findByPk(clienteId);
        if(cliente){
            const novoPet = await Pet.create(
                { nome, tipo, porte, dataNasc, clienteId }); // retorna o objeto pet
                res.status(201).json(novoPet);
        } else {
            res.status(404).json({message: "Cliente não encontrado"})
        } 
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Um erro aconteceu"})
    }
});

//alterar pet ID
app.put("/pets/:id", async (req, res) => {
    const { nome, tipo, porte, dataNasc} = req.body;
    const { id } = req.params;

    try {
        const alterarPet = await Pet.findOne({where: { id }});
        if(alterarPet){
            await alterarPet.update({where: {id}});
            res.json(alterarPet);
        }
        else {
            res.status(404).json({message: "Pet não encontrado!"})
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Algo de errado aconteceu!"})
    }
});



//Escuta de eventos(listen)
app.listen(3000, () => {
    connection.sync({ force: true }) // esse comando gerar as tabelas a partir do model
    // force = ele apaga tuda tabela e recria novamente
    // force é usado somente para a criar as tabelas
    console.log("Servidor rodando em http://localhost:3000");
})

