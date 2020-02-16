require('../DataBase/MySQL')
require('../Register_Login/GestorEmail')

const deleteUserTotally= "delUser"
const deleteAsignUser = "delUserAsign"
const addUserAsign = "addUser"
const rolUser = "rolUser"
const deleteAsignFinal = "delF"
const addAsignFinal="addF"
const addSala="addSala"
const delSala="delSala"

eliminarUsuarioAsignatura = function(req){
    req.session.datosView.temp = queryMailResult("SELECT ID FROM Users WHERE Email='"+req.body.group1.substring(0,req.body.group1.indexOf("?"))+"'")[0].ID
    req.session.datosView.temp2 = queryMailResult("SELECT ID FROM Chats WHERE NombreC='"+req.body.group1.substring(req.body.group1.indexOf("?")+1)+"'")[0].ID
    queryMailResult("DELETE FROM Users_Chat WHERE UserID='"+req.session.datosView.temp+"' AND ChatID='"+req.session.datosView.temp2+"'")
}

gestionaUsuarioAdmin = function(req, res){
    if(req.body.group1.substring(req.body.group1.indexOf("?")+1,req.body.group1.length) == deleteUserTotally){
        queryMailResult("DELETE FROM Users WHERE Email ='" +req.body.group1.substring(0,req.body.group1.indexOf("?")) + "'")
        res.redirect('/administr')
    }

    if(req.body.group1.substring(req.body.group1.indexOf("?")+1,req.body.group1.length) == deleteAsignUser){
        //Prearar asgnaturas usuario en sesion
        req.session.datosView.emailUserAdmin = req.body.group1.substring(0,req.body.group1.indexOf("?"))
        req.session.datosView.asignUser = queryMailResult("SELECT c.NombreC FROM Chats c, Users_Chat uc, Users u WHERE uc.UserID=u.ID AND uc.ChatID = c.ID AND u.Email='"+req.session.datosView.emailUserAdmin+"'")
        req.session.datosView.userMod=1
        //Ir a web para mostrar cuales Quitar
        res.render('adminOperaciones', req.session.datosView)
    }

    if(req.body.group1.substring(req.body.group1.indexOf("?")+1,req.body.group1.length) == addUserAsign){
        //Prearar asgnaturas usuario en sesion
        req.session.datosView.emailUserAdmin = req.body.group1.substring(0,req.body.group1.indexOf("?"))
        req.session.datosView.asignUserAdmin = queryMailResult("SELECT c.NombreC FROM Chats c, Users u, Users_Chat uc WHERE u.ID=uc.UserID AND c.ID=uc.ChatID AND u.Email='"+req.session.datosView.emailUserAdmin+"'")

        var temp = queryMailResult("SELECT NombreC FROM Chats WHERE ID_Centro='"+req.session.datosView.org.ID+"'")
        var temp2 = []

        for(i=0;i<temp.length;i++){
            temp2.push(temp[i].NombreC)
        }

        temp=[]

        for(j=0;j<req.session.datosView.asignUserAdmin.length;j++){
            if(temp2.lastIndexOf(req.session.datosView.asignUserAdmin[j].NombreC)!=-1){
                temp = temp2.splice(temp2.lastIndexOf(req.session.datosView.asignUserAdmin[j].NombreC),1)
            }
        }
        req.session.datosView.asignUserAdmin = temp2

        if(req.session.datosView.asignUserAdmin.length<=0){
            req.session.datosView.asignUserAdminControl=false
        }
        req.session.datosView.userMod=2
        res.render('adminOperaciones', req.session.datosView)
    }

    if(req.body.group1.substring(req.body.group1.indexOf("?")+1,req.body.group1.length) == rolUser){
        req.session.datosView.emailUserAdmin = req.body.group1.substring(0,req.body.group1.indexOf("?"))
        queryMailResult("UPDATE Users SET ID_Rol=2 WHERE Email = '"+req.session.datosView.emailUserAdmin+"'")
        res.redirect('/administr')
    }

    if(req.body.group1.substring(req.body.group1.indexOf("?")+1,req.body.group1.length) == deleteAsignFinal){
        req.session.datosView.idUserAdmin = queryMailResult("SELECT ID FROM Users WHERE Email='"+ req.session.datosView.emailUserAdmin+"'")
        req.session.datosView.asignIdAdmin = queryMailResult("SELECT ID FROM Chats WHERE NombreC='"+req.body.group1.substring(0,req.body.group1.indexOf("?"))+"'")
        queryMailResult("DELETE FROM Users_Chat WHERE UserID = '"+req.session.datosView.idUserAdmin[0].ID+"' AND ChatID='"+req.session.datosView.asignIdAdmin[0].ID+"'")
        res.redirect('/administr')
    }

    if(req.body.group1.substring(req.body.group1.indexOf("?")+1,req.body.group1.length) == addAsignFinal){
        req.session.datosView.idUserAdmin = queryMailResult("SELECT ID FROM Users WHERE Email='"+ req.session.datosView.emailUserAdmin+"'")
        req.session.datosView.asignIdAdmin = queryMailResult("SELECT ID FROM Chats WHERE NombreC='"+req.body.group1.substring(0,req.body.group1.indexOf("?"))+"'")
        queryMailResult("INSERT INTO Users_Chat (UserID, ChatID) VALUES ('"+req.session.datosView.idUserAdmin[0].ID+"','"+req.session.datosView.asignIdAdmin[0].ID+"')")
        res.redirect('/administr')
    }
}

gestionaAsignAdmin = function(req, res){
    if(req.body.group1.substring(req.body.group1.indexOf("?")+1,req.body.group1.length) == delSala){
        console.log("delete")
        req.session.datosView.asignIdAdmin = queryMailResult("SELECT ID FROM Chats WHERE NombreC='"+req.body.group1.substring(0,req.body.group1.indexOf("?"))+"'")
        console.log(req.session.datosView.asignIdAdmin)
        queryMailResult("DELETE FROM Chats WHERE ID='"+req.session.datosView.asignIdAdmin[0].ID+"'")
        res.redirect('/administr')
    }

    if(req.body.group1.substring(req.body.group1.indexOf("?")+1,req.body.group1.length) == addSala){
        req.session.datosView.userMod=3
        res.render('adminOperaciones', req.session.datosView)
    }
}

gestionaNuevaSala = function(req, res, client){
    queryMailResult("INSERT INTO Chats (NombreC, Carrera, ID_Centro) VALUES ('"+req.body.nameAsign+"','"+req.body.gradeAsign+"','"+req.session.datosView.org.ID+"')")
    queryMailResult("INSERT INTO Chats (NombreC, Carrera, ID_Centro) VALUES ('"+req.body.nameAsign+" - Profesores','"+req.body.gradeAsign+"','"+req.session.datosView.org.ID+"')")
    client.rpush([req.body.nameAsign])
    client.set(req.body.nameAsign + "Cont", 0)
    res.redirect('/administr')
}

peticionSoporte = function(req, res){
    sendMailSoporte(req.body.emailContacto, req.body.problemaSoporte)
}