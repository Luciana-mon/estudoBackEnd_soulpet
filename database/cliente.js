//Modelo para gerar a tabela de cliente no MySQL
//Mapeamento: cada propriedade vira uma coluna da tabela
// const cliente = {
//     nome: "Jose Almir", // tipo no banco varchar
//     email: "jose.almir@gmail.com",// tipo no banco varchar
//     telefone:"(88) 9-9999-9999" // tipo no banco varchar
// }
// esse objeto datatypes define o tipo da coluna
const { DataTypes } = require("sequelize");

const { connection } = require("./database");

const Cliente = connection.define("cliente", {
    nome: { // configura a coluna 'nome 
        type: DataTypes.STRING(130),
        allowNull: false, //não permite valor nulo 
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // não pode repetir o campo
    },
    telefone: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

//como relaciono as tabelas no sequelize
// associacao 1:1 (one-to-one)
const Endereco = require("./endereco"); // importo o arquivo endereco,js

//Cliente possui um enderço
//Endereço ganha uma chave estrangeira(nome do model + id)
// chave estrangeira =clienteId
Cliente.hasOne(Endereco);
Endereco.belongsTo(Cliente); //Endereço pertece a um cliente

module.exports = Cliente;