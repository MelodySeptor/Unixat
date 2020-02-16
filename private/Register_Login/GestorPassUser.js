require('./Login')
require('./GestorEmail')
var crypto = require('crypto');
const cryptoRandomString = require('crypto-random-string');

const minValueName=4
const maxValueName=50

variarPassPerfil = function(req, res){
    if(req.session.datosView==undefined){
        req.session.datosView = JSON.parse(JSON.stringify(datosSesion))
    }
    req.session.datosView.errorP = false
    if(comprobarCamposPass(req)){
        var myKey = crypto.createCipher('aes-128-cbc', 'unichat4')
        req.session.datosView.passForMe = myKey.update(req.body.passwordPerfilN, 'utf8', 'hex')
        req.session.datosView.passForMe += myKey.final('hex')
        queryMailResult("UPDATE Users SET Contrasena='"+req.session.datosView.passForMe+"' WHERE Email = '"+req.session.datosView.mailUser+"'")
    }
    res.redirect('/perfil')
}

comprobarCamposPass = function(req){
    if(req.body.passwordPerfil.length>=minValueName && req.body.passwordPerfil.length<=maxValueName){
        return true
    }
    else{
        if(req.body.passwordPerfilN.length>=minValueName && req.body.passwordPerfilN.length<=maxValueName){
            return true
        }
        else{
            req.session.datosView.errorP = true
            return false
        }
    }
}

recuperarPassword = function(req, res){
    if(req.session.datosView==undefined){
        req.session.datosView = JSON.parse(JSON.stringify(datosSesion))
    }
    req.session.datosView.errorR = false
    if(comprobarCamposUserRec(req)){
        var myKey = crypto.createCipher('aes-128-cbc', 'unichat4')
        req.session.datosView.passNewForMe = cryptoRandomString({length: 10})
        req.session.datosView.passForMe = myKey.update(req.session.datosView.passNewForMe, 'utf8', 'hex')
        req.session.datosView.passForMe += myKey.final('hex')
        sendMailRecuperar(req.body.usernameRec, req.session.datosView.passNewForMe)
        queryMailResult("UPDATE Users SET Contrasena='"+req.session.datosView.passForMe+"' WHERE Email = '"+req.body.usernameRec+"'")
        res.redirect('/')
    }
    else{
        res.redirect('/recuperarPass')
    }
}

comprobarCamposUserRec = function(req){
    if(compruebaUsuarioExisteRec(req) && req.body.usernameRec.length>=minValueName && req.body.usernameRec.length<=maxValueName){
        return true
    }
    else{
        req.session.datosView.errorR = true
        return false
        }
}

compruebaUsuarioExisteRec = function(req){
    return (queryMailResult("SELECT * FROM Users WHERE Email='"+req.body.usernameRec+"'").length>=1)
}