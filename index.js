const express = require('express')
const app = express()
var session = require('express-session')
var helmet = require('helmet')
const bodyParser = require("body-parser");
const port = 8080
var redis = require("redis"),
    client = redis.createClient();
require('./private/Register_Login/Register')
require('./private/Register_Login/Login')
require('./private/datosVariables')
require('./private/Chat/preChat')
require('./private/Administr/administrLoads')
require('./private/Administr/adminTools')
require('./private/Register_Login/GestorPassUser')
require('./private/DataBase/Redis')
startConnection()
cargaAsignaturasRedis(client)
cargarDeBaseDeDatos(client)

//Renderizar PUG.
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
var sessionMiddleware = session({secret:'Unix4t', resave:false, saveUninitialized:false})
app.use(sessionMiddleware)
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(helmet())
app.set('views', __dirname + '/public/views')

app.get('/', function(req, res){
   if(req.session.datosView==undefined){
		req.session.datosView = JSON.parse(JSON.stringify(datosSesion))
   }
   req.session.datosView.tituloPagina='Unichat'
   if(req.session.datosView.logged && !req.session.datosView.primerInicio){
      res.redirect('/chat')
   }
   else{
      if(req.session.datosView.logged && req.session.datosView.primerInicio){
         res.redirect('/seleccionAsignatura')
      }
      else{
         req.session.datosView.tituloPagina = "Unichat - Inicio"
         res.render('index', req.session.datosView)
      }
   }
 })

 app.get('/identificarse', function(req, res){
   if(req.session.datosView==undefined){
		req.session.datosView = JSON.parse(JSON.stringify(datosSesion))
   }
   if(req.session.datosView.logged && !req.session.datosView.primerInicio){
      res.redirect('/chat')
   }
   else{
      if(req.session.datosView.logged && req.session.datosView.primerInicio){
         res.redirect('/seleccionAsignatura')
      }
      else{
         req.session.datosView.tituloPagina='Unichat - Indentificarse'
         res.render('identificarse', req.session.datosView)
      }
   }
 })

 app.get('/registro', function(req, res){
   if(req.session.datosView==undefined){
		req.session.datosView = JSON.parse(JSON.stringify(datosSesion))
   }
   if(req.session.datosView.logged && !req.session.datosView.primerInicio){
      res.redirect('/chat')
   }
   else{
      if(req.session.datosView.logged && req.session.datosView.primerInicio){
         res.redirect('/seleccionAsignatura')
      }
      else{
         req.session.datosView.tituloPagina='Unichat - Registro'
         res.render('registro', req.session.datosView)
      }
   }
 })

 app.post('/peticionRegistro', function(req, res){
    gestorRegistro(req,res)
 })

 app.get('/confirmacion', function (req, res){
   res.render('confirmacion')
})

 app.post('/peticionLogin', function(req, res){
    gestorLogin(req,res)
 })

 app.get('/recuperarPass', function(req, res){
   if(req.session.datosView==undefined){
		req.session.datosView = JSON.parse(JSON.stringify(datosSesion))
   }
   if(!req.session.datosView.logged){
      req.session.datosView.tituloPagina = "Unichat - Recuperar Contraseña"
      res.render('recuperarPass', req.session.datosView)
   }
   else{
      res.redirect('/')
   }
 })
 app.post('/peticionRecupPass', function(req, res){
   recuperarPassword(req,res)
})
 
 app.get('/seleccionAsignatura', function(req, res){
   if(req.session.datosView==undefined){
		req.session.datosView = JSON.parse(JSON.stringify(datosSesion))
   }
   if(req.session.datosView.logged && !req.session.datosView.primerInicio){
      res.redirect('/chat')
   }
   else{
         req.session.datosView.tituloPagina='Unichat - Selección'
         res.render('SelectCourse', req.session.datosView)
      }   
}) 

app.post('/seleccionAsignaturaFinal', function(req, res){
      cargaAsignaturas(req)
      req.session.datosView.tituloPagina = "Unichat - Selección"
      res.render('SelectAsign', req.session.datosView)  
})

app.post('/procesaPrimerInicio', function(req, res){
   procesaPrimerInicio(req)
   res.redirect('/chat')  
})

app.get('/chat', function (req, res){
   if(req.session.datosView==undefined){
		req.session.datosView = JSON.parse(JSON.stringify(datosSesion))
   }
   if(req.session.datosView.logged && !req.session.datosView.primerInicio){
      cargaSalasChat(req)
      req.session.datosView.tituloPagina = "Unichat - Chat"
      res.render('chat', req.session.datosView)
   }
   else{
      if(req.session.datosView.logged && req.session.datosView.primerInicio){
         res.redirect('/seleccionAsignatura')
      }
      else{
         res.redirect('/')
      }
   }
 })

 app.get('/perfil', function(req, res){
   if(req.session.datosView==undefined){
		req.session.datosView = JSON.parse(JSON.stringify(datosSesion))
   }
   else{
      if(req.session.datosView.logged && req.session.datosView.primerInicio){
         res.redirect('/seleccionAsignatura')
      }
      else{
         if(req.session.datosView.logged){
            req.session.datosView.tituloPagina='Unichat - Perfil'
            res.render('perfil', req.session.datosView)
         }
         else{
            res.redirect('/identificarse')
         }
      }
   }
})

app.post('/peticionVariarPass', function(req, res){
   variarPassPerfil(req, res)  
})

 app.get('/acercade', function(req, res){
   req.session.datosView.tituloPagina = "Unichat - Acerca de"
     res.render('acercade', req.session.datosView)
 })
 
 app.get('/soporte', function(req, res){
   req.session.datosView.tituloPagina = "Unichat - Soporte"
   res.render('soporte', req.session.datosView)
 })

app.get('/administr', function(req, res){
   if(req.session.datosView==undefined){
		req.session.datosView = JSON.parse(JSON.stringify(datosSesion))
   }
   if(req.session.datosView.logged && !req.session.datosView.primerInicio && req.session.datosView.rol > 1){
      cargaDatosAdministr(req)
      req.session.datosView.tituloPagina = "Unichat - Administración"
      res.render('administr', req.session.datosView)
   }
   else{
      if(req.session.datosView.logged && req.session.datosView.primerInicio){
         res.redirect('/seleccionAsignatura')
      }
      else{
         res.redirect('/')
      }
   }
})

app.post('/eliminarUsuario', function(req, res){
   eliminarUsuarioAsignatura(req)
   res.redirect('/administr')  
})

app.post('/gestionaAdmin', function(req, res){
   if(req.session.datosView==undefined){
		req.session.datosView = JSON.parse(JSON.stringify(datosSesion))
   }
   req.session.datosView.estado = req.body.action
   req.session.datosView.tituloPagina = "Unichat - Administración"
   res.render('gestionadminist', req.session.datosView)  
})

app.post('/gestionaUsuarioAdmin', function(req, res){
   if(req.session.datosView==undefined){
		req.session.datosView = JSON.parse(JSON.stringify(datosSesion))
   }
   gestionaUsuarioAdmin(req,res) 
})

app.post('/gestionaAsignAdmin', function(req, res){
   if(req.session.datosView==undefined){
		req.session.datosView = JSON.parse(JSON.stringify(datosSesion))
   }
   gestionaAsignAdmin(req,res) 
})

app.post('/peticionNuevaSala', function(req, res){
   if(req.session.datosView==undefined){
		req.session.datosView = JSON.parse(JSON.stringify(datosSesion))
   }
   gestionaNuevaSala(req, res) 
})

app.post('/peticionSoporte', function(req, res){
   peticionSoporte(req, res)
   res.redirect('/')
})

app.get('/cerrar', function(req, res){
   req.session.destroy();
   res.redirect('/')
})

 app.use(function(req,res){
    if(confirmaciones.lastIndexOf(req.url)!=-1){
      confirmarUsuario(req)
      confirmaciones.pop(confirmaciones.lastIndexOf(req.session.datosView.mailForMe))
      res.redirect('/confirmacion')
      }
   res.render('error', req.session.datosView);
});

client.on("error", function (err) {
   console.log("Error " + err);
});

const server = app.listen(port, () =>{
   console.log("Unichat iniciado en: " + port)
})
const io = require('socket.io').listen(server)

io.use(function(socket, next) {
   sessionMiddleware(socket.request, socket.request.res, next);
});

io.on('connection', function(socket){
   if(socket.request.session.datosView==undefined){
		socket.request.session.datosView = JSON.parse(JSON.stringify(datosSesion))
   }

   socket.on('joinRoom', function(){
      socket.username = socket.request.session.datosView.userName
      socket.room = socket.request.session.datosView.asign[0]
      socket.roomsCounter = []
      
      socket.request.session.datosView.asign.map((val, index, arr) => {
         client.get(val+"Cont", function(err, reply){
            socket.roomsCounter[val] =  Number(reply)
         })
      })

      socket.join(socket.room)
      socket.emit('updateChat', 'SERVER', 'te has conectado en la sala ' + socket.room)
      client.lrange(socket.room, 0, -1, function(err, reply){
         for(i=0;i<reply.length;i++){
            socket.emit('updateChat', reply[i].substring(0,reply[i].lastIndexOf(":")), reply[i].substring(reply[i].lastIndexOf(":")+1, reply[i].length))
         }
      })
      socket.emit('updateRooms', socket.request.session.datosView.asign, socket.room);
   })

   socket.on('sendChat', function(data){
      var today = new Date()
      if(socket.userName != "SERVER"){
         client.rpush(socket.room, today.getHours()+":"+today.getMinutes()+" " + socket.request.session.datosView.userName + ": " + data)
         client.incr(socket.room+"Cont")
         socket.roomsCounter[socket.room] = Number(socket.roomsCounter[socket.room]) +1 
         console.log(socket.roomsCounter[socket.room])
      }
      io.sockets.in(socket.room).emit('updateChat',today.getHours()+":"+today.getMinutes()+" " +socket.username, data);
   })

   socket.on('updateRoomMessajes', function(){
      aux = []
      socket.request.session.datosView.asign.map((val, index, arr) => {
         client.get(val+"Cont", function(err, reply){
            if(socket.roomsCounter[val] != Number(reply)){
               socket.emit('newMessagesRoom', val, socket.request.session.datosView.asign, socket.room)
            }
         })
      })
   })

   socket.on('switchRoom', function(newroom){
		socket.leave(socket.room);
		socket.join(newroom);
		socket.emit('updateChat', 'SERVER', 'te has conectado en la sala '+ newroom);
      socket.room = newroom;
      client.lrange(socket.room, 0, -1, function(err, reply){
         for(i=0;i<reply.length;i++){
            socket.emit('updateChat', reply[i].substring(0, reply[i].lastIndexOf(":")), reply[i].substring(reply[i].lastIndexOf(":")+1, reply[i].length))
         }
      })
      client.get(socket.room + "Cont", function(err, reply){
         socket.roomsCounter[socket.room] = reply
      })
      socket.emit('updateRooms', socket.request.session.datosView.asign, newroom);
	});

   socket.on('disconnect', function(){
		socket.leave(socket.room);
	});
   
})

saveRedisOnDB = setInterval(function(){
   guardarABaseDeDatos(client)
}, 3600000)

/*io.on('connection', (socket) => {
   //console.log('a user connected')
   socket.on('chatter', (message) => {
     console.log('chatter : ', message)
     io.emit('chatter', message)
   })
 })*/