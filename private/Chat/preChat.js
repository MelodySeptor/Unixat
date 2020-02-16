require('../DataBase/MySQL')

cargaSalasChat = function(req){
    if(req.session.datosView==undefined){
        req.session.datosView = JSON.parse(JSON.stringify(datosSesion))
    }
    req.session.datosView.asign=[]
    req.session.datosView.idForMe = queryMailResult("SELECT ID FROM Users WHERE Email='"+req.session.datosView.mailUser+"'")[0].ID
    req.session.datosView.idChats = queryMailResult("SELECT ChatID FROM Users_Chat WHERE UserID='"+req.session.datosView.idForMe+"'")

    req.session.datosView.asignTemp = []
    //probar asi
    for(i=0;i<req.session.datosView.idChats.length;i++){
        req.session.datosView.asignTemp.push(queryMailResult("SELECT NombreC FROM Chats WHERE ID='"+req.session.datosView.idChats[i].ChatID+"'")[0].NombreC)
    }

    if(req.session.datosView.rol==2){
        for(i=0;i<req.session.datosView.asignTemp.length;i++){
            if(req.session.datosView.asignTemp[i].lastIndexOf("Profesores")!=-1){
                req.session.datosView.asign.push(req.session.datosView.asignTemp[i])
            }
        }
    }
    else{
        req.session.datosView.asign = req.session.datosView.asignTemp
    }
}