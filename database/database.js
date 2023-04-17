//database.js é o arquivo de concexão com o banco de dados
//ele via ler as variaveis de ambiente e tentar conectar ao MySQL

const{ Sequelize } = require("sequelize"); //trazer o sequelize

//criamos o objeto de conexão
const connection = new Sequelize( // essa informaçoes esta vindo do arquivo .env 
    process.env.DB_NAME, // nome resevado para o database
    process.env.DB_USER, // usuario reservado para conexao
    process.env.DB_PASSWORD, //senha para acesso
    { // objeto de informações adicionais da conexão
        host: process.env.DB_HOST, // endereço(banco local)
        dialect: 'mysql', // o banco utilizado
    }
);

//Estabelecer a conexão usando o objeto
async function authenticate(connection){
   try{
    // ele tenta estabelecer a conexao com o BD (usando as informaçoes acima)
    await connection.authenticate(); 
    console.log("Conexao estabelecida com sucesso!!");
   } catch(err) {
    // err = objeto que guarda detalhes sobre o erro que aconteceu
    console.log("Um erro inesperado aconteceu", err);
   }
}

module.exports = { connection, authenticate};