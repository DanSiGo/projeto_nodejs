// Instalações

const express = require('express') // chamada do pacote express
const ejs = require('ejs') // chamada do pacote ejs
const app = express() // instanciando o express para poder utilizar os metodos do pacote
const mysql = require('mysql') // chamando o modulo mysql


// Definições

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views');
app.use(express.static('public')) // a pasta public vai conter as estilizações (guarda os css)
app.use(express.urlencoded({extended: true}))

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'banco_node' // nome do schema criado no workbench
})

connection.connect(err => {
    if (err) throw err;
    console.log('conectado ao banco de dados MySQL')
})

// Componentes

// '/' -> rota inicial
// Rota: Home
app.get('/', (req, res) => {
    res.render('index') // __dirname --> faz a rota automatica até chegar na pasta do arquivo. Essa função faz parte do pacote express. Alteração: modificado .html para .ejs, necessário trocar para res.render e foi retirado o dirname
})

// Rota: Cardápio
app.get('/cardapio', (req, res) => {
    const query = 'SELECT * FROM cardapio'
    connection.query(query, (err, rows) => {
        if (err) throw err
        res.render('cardapio', {rows}) // precisa das chaves (sintaxe)
    })
})

// rota: criar
app.get('/criar', (req, res) => {
    res.render('criar')
})

// na mesma rota 'criar', incluir metodo POST
app.post('/criar', (req, res) => {
    const {Title, Des, Price, URL} = req.body
    const query = 'INSERT INTO cardapio (Title, URL, Descricao, Price) VALUES (?,?,?,?)'
    connection.query(query, [Title, URL, Des, Price], (err) => { 
        if (err) throw err  // a função callback nao é necessário, mas é bom para ver se der erro
        res.redirect('/cardapio')  // se tudo der certo, vai cadastrar e redirecionar para a pagina cardapio
    })
})

// rota para apagar
app.get('/delete/:Title', (req, res) => {
    const { Title } = req.params  // as chaves faz parte da sintaxe do express, é para reservar esse parametro
    const query = `DELETE FROM cardapio WHERE Title = '${Title}' limit 1`
    connection.query(query, (err) => {
        if (err) throw err
        res.redirect('/cardapio')
    })
})

// rota para coleta EDIT
app.get('/editar/:Title', (req, res) => {  // utiliando metodo get para ler a pagina
    const { Title } = req.params
    const query = 'SELECT * FROM cardapio WHERE Title = ? limit 1'
    connection.query(query, [Title], (err, rows) =>{
        if (err) throw err
        res.render('editar', { row: rows[0]})
    })
})

// rota para editar (update)
app.post('/editar/:Tit', (req, res) => {  // metodo post para enviar os dados alterados
    const { Tit } = req.params
    const { Title, Des, URL, Price } = req.body
    const query = 'UPDATE cardapio SET Title = ?, URL = ?, Descricao = ?, Price = ? WHERE Title = ?'
    connection.query(query, [Title, URL, Des, Price, Tit], (err, result) => {
        if (err) throw err
        res.redirect('/cardapio')
    })
})

// Inicialização

// Criando o servidor

app.listen(3000, () => {
    console.log('Server ON na porta 3000')
})