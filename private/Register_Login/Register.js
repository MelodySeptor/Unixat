require('../DataBase/MySQL')
require('./GestorEmail')
var crypto = require('crypto');
var minValueName=4
var maxValueName=50
var hasRegisters=1
confirmaciones=[]

gestorRegistro=function(req, res){
    if(req.session.datosView==undefined){
        req.session.datosView = JSON.parse(JSON.stringify(datosSesion))
    }
    if(req.session.datosView.logged){res.redirect('/')}
    else{
        if(compruebaFormulario(req)){
            var myKey = crypto.createCipher('aes-128-cbc', 'unichat4')
            req.session.datosView.passForMe = myKey.update(req.body.passwordRegistro, 'utf8', 'hex')
            req.session.datosView.passForMe += myKey.final('hex')
            queryResult("INSERT INTO Users (Nombre, Email, Contrasena, Confirmacion, ID_Centro) VALUES ('"+req.body.nombreRegistro+"', '"+req.body.emailRegistro + "', '"+req.session.datosView.passForMe +"', '"+0+"','"+obtenUniversidadSegunCorreo(req)[0].ID+"')")
            enviarMailConfirmacion(req)
            req.session.datosView.userName = req.body.nombreRegistro
            req.session.datosView.mailUser = req.body.emailRegistro
            res.redirect('/confirmacion')
        }
        else{
            res.redirect('/registro')
        }
    }
}

compruebaFormulario=function(req){
    req.session.datosView.errorName = false
    req.session.datosView.errorEmail = false
    req.session.datosView.errorPassword= false
    var correcto = true

    if(req.body.nombreRegistro.length<minValueName || req.body.nombreRegistro.length>maxValueName){
        req.session.datosView.errorName = true
        correcto = false
    }

    if(req.body.emailRegistro.length<minValueName || req.body.emailRegistro.length>maxValueName || !req.body.emailRegistro.includes('@') || compruebaMailExiste(req.body.emailRegistro) || obtenUniversidadSegunCorreo(req).length<=0){
        req.session.datosView.errorEmail = true
        correcto = false
    }

    if(req.body.passwordRegistro.length<minValueName || req.body.passwordRegistro.length>maxValueName || req.body.passwordRegistro != req.body.passwordRepetirRegistro){
        req.session.datosView.errorPassword= true
        correcto = false
    }

    return correcto
}

compruebaMailExiste = function(mail){
    return (queryMailResult("SELECT * FROM Users WHERE Email = '"+mail+"'").length >=hasRegisters)
}

enviarMailConfirmacion = function(req){
    var myKey = crypto.createCipher('aes-128-cbc', 'unichat4')
    req.session.datosView.mailForMe = myKey.update(req.body.emailRegistro, 'utf8', 'hex')
    req.session.datosView.mailForMe += myKey.final('hex')
    sendMailConfirmacion(req.body.emailRegistro, req.session.datosView.mailForMe)
    confirmaciones.push('/'+req.session.datosView.mailForMe)
}

obtenUniversidadSegunCorreo = function(req){
    return queryMailResult("SELECT ID FROM Organizaciones WHERE Email='"+req.body.emailRegistro.substring(req.body.emailRegistro.indexOf('@'),req.body.emailRegistro.length)+"'")
}

confirmarUsuario = function(req){
    if(req.session.datosView==undefined){
        req.session.datosView = JSON.parse(JSON.stringify(datosSesion))
    }
    queryMailResult("UPDATE Users SET Confirmacion=true WHERE Email = '"+req.session.datosView.mailUser+"'")
    req.session.datosView.confirmado=true
}