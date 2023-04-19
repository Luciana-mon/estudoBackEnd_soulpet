const Pet = require("../database/pet");
const Cliente = require("../database/cliente");

const { Router } = require("express");
//cria o grupo de rotas(/pets)
const router = Router();

//Definir rotas para Pets
router.get("/pets", async (req, res) => {
    const listaPets = await Pet.findAll();
    res.json(listaPets);
});

// buscar pets por id
router.get("/pets/:id", async (req, res) => {
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
router.post('/pets', async (req, res) => {
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
router.put("/pets/:id", async (req, res) => {
    const { nome, tipo, porte, dataNasc} = req.body;
    const { id } = req.params;

    try {//posso usar o findOne ou findByPk 
        //E necessario checar a exixtencia do pet SELECT * FROM PETS WHERE ID= REQ.PARAMS.ID
        const alterarPet = await Pet.findByPk(id);
        if(alterarPet){
            await alterarPet.update({nome, tipo, porte, dataNasc},{where: {id}}
        );
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

router.delete("/pets/:id", async(req, res) => {
    //const { id } = req.params;
    const deletarPet =  await Pet.findByPk(req.params.id);
    try {
        if(deletarPet){
            await Pet.destroy();
            res.json({ message: "O pet foi removido"})
        } else {
            res.status(404).json({message: "o pet não foi encontrado"})    
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Algo de errado aconteceu"})
    }   
});




module.exports = router;