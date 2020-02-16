require('../DataBase/MySQL')
var crypto = require('crypto');

const minValueName=4
const maxValueName=50
const primerInicio=0

gestorLogin=function(req, res){
//Ver si ya esta registrado
    if(req.session.datosView==undefined){
        req.session.datosView = JSON.parse(JSON.stringify(datosSesion))
    }
    req.session.datosView.errorL=false
    if(req.session.datosView.logged){res.redirect('/')}
    else{
        if(compruebaFormularioLogin(req) && compruebaUsuario(req)){
            req.session.datosView.userName = queryMailResult("SELECT Nombre FROM Users WHERE Email='"+req.body.usernameAcceder+"'")[0].Nombre
            req.session.datosView.mailUser = req.body.usernameAcceder
            req.session.datosView.logged = true
            req.session.datosView.rol = queryMailResult("SELECT ID_Rol FROM Users WHERE Email='"+req.body.usernameAcceder+"'")[0].ID_Rol
            if(compruebaPrimerInicio(req)){
                req.session.datosView.idCentro=queryMailResult("SELECT ID_Centro FROM Users WHERE Email='"+req.body.usernameAcceder+"'")[0].ID_Centro
                cargaCursos(req)
                res.redirect('/seleccionAsignatura')
            }
            else{
                req.session.datosView.primerInicio = false
                res.redirect('/')
            }
        }
        else{
            req.session.datosView.errorL = true
            res.redirect('/identificarse')
        }
    }
}

compruebaFormularioLogin = function(req){
    var correcto = true
    if(req.body.usernameAcceder.length<minValueName || req.body.usernameAcceder.length>maxValueName){
        req.session.datosView.errorL = true
        correcto = false
    }
    if(req.body.passwordAcceder.length<minValueName || req.body.passwordAcceder.length>maxValueName){
        req.session.datosView.errorL = true
        correcto = false
    }
    if(correcto){
        var splChars = "*|,\":<>[]{}`\';()&$#%";
        for ( i = 0; i < req.body.usernameAcceder.length; i++) {
            if (splChars.indexOf(req.body.usernameAcceder.charAt(i)) != -1){
                req.session.datosView.errorL = true
                correcto = false
            }
    } 
}

    return correcto
}

compruebaUsuario = function(req){
    var myKey = crypto.createCipher('aes-128-cbc', 'unichat4')
    req.session.datosView.passForMe = myKey.update(req.body.passwordAcceder, 'utf8', 'hex')
    req.session.datosView.passForMe += myKey.final('hex')
    console.log(queryMailResult("SELECT * FROM Users WHERE Email='"+req.body.usernameAcceder+"' AND Contrasena='"+req.session.datosView.passForMe+"'"))
    return (queryMailResult("SELECT * FROM Users WHERE Email='"+req.body.usernameAcceder+"' AND Contrasena='"+req.session.datosView.passForMe+"'").length>=1)
}

compruebaPrimerInicio = function(req){
    req.session.datosView.idForMe = queryMailResult("SELECT ID FROM Users WHERE Email='" + req.body.usernameAcceder+"'")[0].ID
    return (queryMailResult("SELECT ID FROM Users_Chat WHERE UserID='"+req.session.datosView.idForMe+"'").length<=primerInicio)
}

cargaCursos = function(req){
    var temp = queryMailResult("SELECT Carrera FROM Chats WHERE ID_Centro='"+req.session.datosView.idCentro+"'")
    req.session.datosView.cursos=[]
    for(i=0;i<temp.length;i++){
        if(req.session.datosView.cursos.lastIndexOf(temp[i].Carrera)==-1){
            req.session.datosView.cursos.push(temp[i].Carrera)
        }
    }
}

cargaAsignaturas = function(req){
    if(req.session.datosView==undefined){
        req.session.datosView = JSON.parse(JSON.stringify(datosSesion))
    }
    var temp = queryMailResult("SELECT NombreC FROM Chats WHERE Carrera='"+ req.body.group1+"' AND ID_Centro='"+req.session.datosView.idCentro+"'")
    req.session.datosView.curso=req.body.group1
    req.session.datosView.asign=[]
    for(i=0;i<temp.length;i++){
        req.session.datosView.asign.push(temp[i].NombreC)
    }
}

procesaPrimerInicio = function(req, res){
    if(req.session.datosView==undefined){
        req.session.datosView = JSON.parse(JSON.stringify(datosSesion))
    }
    req.session.datosView.asign=[]
    Object.keys(req.body).forEach(function(key){
        if(key!=undefined && key!='action'){
            req.session.datosView.idAsign = queryMailResult("SELECT ID FROM Chats WHERE NombreC='"+key+"' AND ID_Centro='"+req.session.datosView.idCentro+"'")[0].ID
            req.session.datosView.idForMe = queryMailResult("SELECT ID FROM Users WHERE Email='" + req.session.datosView.mailUser+"'")[0].ID
            queryMailResult("INSERT INTO Users_Chat (UserID, ChatID) VALUES ('"+req.session.datosView.idForMe+"','"+req.session.datosView.idAsign+"')")
        }
    })
    req.session.datosView.primerInicio = false
}