const Cliente = require("../database/cliente");
const Endereco = require("../database/endereco");

const { Router } = require("express");

//cria o grupo de rotas(/clientes)
const router = Router();

//Definir as rotas Clientes
router.get('/clientes', async (req, res) => {
    //select * form clientes
    const listaClientes = await Cliente.findAll();
    res.status(200).json(listaClientes);
});

router.get('/clientes/:id', async (req, res) => {
    //select * from clientes where id = 5;
    const cliente = await Cliente.findOne({ where: { id: req.params.id }, include: [Endereco] });
    if (cliente) {
        res.json(cliente);
    } else {
        res.status(404).json({ message: "Usuario não encontrado" })
    }
});

router.post('/clientes', async (req, res) => {
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
router.put("/clientes/:id", async (req, res) => {
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
router.delete("/clientes/:id", async (req, res) => {
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




module.exports = router;