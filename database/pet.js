const { DataTypes } = require("sequelize")
const { connection } = require("./database");
const Cliente = require("./cliente");

const Pet = connection.define("pet", {
    nome: {
        type: DataTypes.STRING(130),
        allowNull: false
    },
    tipo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    porte: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    dataNasc: {
        type: DataTypes.DATEONLY
    }
});
//Relacionamento 1:N - um cliente pode ter N pets
Cliente.hasMany(Pet, {onDelete: "CASCADE"});
Pet.belongsTo(Cliente); //um pet pertence a um cliente

module.exports = Pet;