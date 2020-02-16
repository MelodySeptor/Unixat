require('./MySQL')
var crypto = require('crypto');

cargaAsignaturasRedis = function(client){
    var temp = []
    temp = queryResult("SELECT NombreC FROM Chats")

    for(i=0;i<temp.length;i++){
        client.rpush([temp[i].NombreC], function(err,reply){
            console.log(reply)
        })
        client.set(temp[i].NombreC + "Cont", 0, function(err,reply){
            console.log(reply)
        })
    }
}

cargarDeBaseDeDatos = function(client){
    var asign = []
    var myKey
    asignName = queryResult("SELECT c.NombreC, m.Texto FROM Chats c, Mensajes m WHERE c.ID=m.ID_Chat")

    for(i=0;i<asignName.length;i++){
        myKey = crypto.createDecipher('aes-128-cbc', 'unichat4')
        data = myKey.update(asignName[i].Texto, 'hex', 'utf8')
        data += myKey.final('utf8')
        client.rpush(asignName[i].NombreC, data)
    }
    
}

guardarABaseDeDatos = function(client){
    queryResult("DELETE FROM Mensajes")

    var temp = []
    temp = queryResult("SELECT NombreC, ID FROM Chats")
    var temp2=[]

    for(i = 0; i<temp.length;i++){
        temp2.push(temp[i].NombreC + ":" + temp[i].ID)
    }
    temp2.map(function(val, index, err){
        name = val.substring(0,val.lastIndexOf(":"))

        client.lrange(name ,0,-1, function(err, reply){
            id = val.substring(val.lastIndexOf(":")+1, val.length)
            for(j=0;j<reply.length;j++){
                var myKey = crypto.createCipher('aes-128-cbc', 'unichat4')
                data = myKey.update(reply[j], 'utf8', 'hex')
                data += myKey.final('hex')
                console.log(data.length)
                queryResult("INSERT INTO Mensajes (Texto, ID_Chat) VALUES ('"+data+"','"+id+"')")
            }
        })
    })
}