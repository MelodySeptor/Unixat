require('./MySQLData')
var MySql = require('sync-mysql');

var connection
//Conexion
startConnection = function(){
    connection = new MySql({
    host: MySQLData.host,
    user: MySQLData.user,
    password: MySQLData.password,
    database: MySQLData.database
  });
}

queryResult = function(sql){
    var result = connection.query(sql)
    return result;
}

queryMailResult = function(sql){
    var result = connection.query(sql)
    return result;
}