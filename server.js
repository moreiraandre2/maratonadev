//configurando o servidor
const express = require("express") //adicionando o modulo do express
const server = express() //server recebe a funcionalidade de express;


//configurar o servidor para apresentar aquivos estaticos
server.use(express.static('public'))

//habilitar body do formulario
server.use(express.urlencoded({ extended: true }))

//configurar a conexão com o banco de dados postgre
const Poll = require('pg').Pool
const db = new Poll({
    user: 'postgres',
    password: '123456',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})


//configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./" , {
    express: server,
    noCache: true, //boolean ou booleano aceita 2 valores, verdadeiro ou false
})

//lista de doadores, vetor ou array 
//coleção de dados


//configurar a apresentação da página
server.get("/", function(req, res){
    db.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send("erro no banco de dados.") 
        const donors = result.rows
        return res.render("index.html", { donors})
    })
    
})

server.post("/", function(req, res){
    //pegar dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if(name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatorios.")
    }

    //inserindo valor dentro do banco de dados
    const query =`INSERT INTO donors ("name", "email", "blood") 
    VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, function(err){
        //fluxo de erro
        if (err) return res.send("erro no banco de dados.")

        //redireciona para a pagina inicial
        return res.redirect("/")
    })
     
})

//ligar o servidor
server.listen(3000, function(){
    console.log("Iniciei o servidor")
}) //criar/ iniciar o servidor passando a porta

