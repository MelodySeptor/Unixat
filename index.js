const express = require('express')
const app = express()
const port = 8080

//Renderizar PUG.
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views')

app.get('/', function(req, res){
    res.render('index')
 })

 app.get('/identificarse', function(req, res){
     res.send("Indentificarse");
 })

 app.get('/registro', function(req, res){
     res.send('Registro');
 })

 app.get('/chat', function (req, res){
     res.send('Chat')
 })

 app.get('/faq', function(req, res){
     res.send('faq');
 })

 app.get('/acercade', function(req, res){
     res.send('acercade')
 })
 
 app.get('/soporte', function(req, res){
    res.send('soporte')
 })

app.listen(port)
console.log("Unichat iniciado en: " + port)