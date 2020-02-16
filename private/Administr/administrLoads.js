require('../DataBase/MySQL')

cargaDatosAdministr = function(req){
    if(queryMailResult("SELECT ID_Rol FROM Users WHERE Email='"+req.session.datosView.mailUser+"'")[0].ID_Rol==2){
        cargaProfesor(req)
    }
    else{
        cargaAdmin(req)
    }
}

cargaProfesor = function(req){
    req.session.datosView.idForMe = queryMailResult("SELECT ID FROM Users WHERE Email='"+req.session.datosView.mailUser+"'")[0].ID
    req.session.datosView.idChats = queryMailResult("SELECT ChatID FROM Users_Chat WHERE UserID='"+req.session.datosView.idForMe+"'")
    req.session.datosView.users=[]

    for(i=0;i<req.session.datosView.idChats.length;i++){
        req.session.datosView.users.push(queryMailResult("SELECT u.Nombre, u.Email, c.NombreC FROM Users u, Chats c, Users_Chat uc WHERE uc.UserID=u.ID AND uc.ChatID=c.ID AND u.ID_Rol=1 AND c.ID='"+req.session.datosView.idChats[i].ChatID+"'"))
    }
}

cargaAdmin = function(req){
    req.session.datosView.org=queryMailResult("SELECT * FROM Organizaciones WHERE Email='"+req.session.datosView.mailUser.substring(req.session.datosView.mailUser.indexOf('@'),req.session.datosView.mailUser.length)+"'")[0]
    req.session.datosView.idOrg = queryMailResult("SELECT ID_Centro FROM Users WHERE Email='"+req.session.datosView.mailUser+"'")[0].ID_Centro
    req.session.datosView.salas = queryMailResult("SELECT NombreC, Carrera FROM Chats WHERE ID_Centro='"+req.session.datosView.idOrg+"'")
    req.session.datosView.users= queryMailResult("SELECT Nombre, Email, ID_Rol FROM Users WHERE ID_Centro='"+req.session.datosView.idOrg+"'")
}