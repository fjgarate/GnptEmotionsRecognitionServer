/**
 * http://usejsdoc.org/
 */
//llamamos al paquete mysql que hemos instalado
var db=require('../dbconnection'); //reference of dbconnection.js

//creamos un objeto para ir almacenando todo lo que necesitemos
var userModel = {};

userModel.getUsers = function(callback)
{
	if (db) 
	{
		db.query('SELECT * FROM user ', function(error, rows) {
			if(error)
			{
				throw error;
			}
			else
			{
				callback(null, rows);
			}
		});
	}
};

//añadir un nuevo resultado
userModel.saveUser = function(userData,callback)
{
	if (db) 
	{
		db.query('INSERT INTO user SET ?', userData, function(error, result) 
		{
			if(error)
			{
				throw error;
			}
			else
			{/*
				var resultId=result.insertId;
				
				db.query('INSERT INTO emotions_result SET ?', resultEmotionData, function(error, result){
					//devolvemos la última id insertada
					callback(null,{"insertId" : result.insertId});
				});*/
				callback(null,{"insertId" : result.insertId});
			}
		});
	}
}
//obtenemos un usuario por su id
userModel.getUser = function(id,callback)
{
	if (db) 
	{
		var sql = 'SELECT * FROM user WHERE user_id = ' + db.escape(id);
		db.query(sql, function(error, row) 
		{
			if(error)
			{
				throw error;
			}
			else
			{
				callback(null, row);
			}
		});
	}
}
userModel.getUserByName = function(login,callback)
{
	if (db) 
	{
		var sql = 'SELECT * FROM user WHERE user_name = ' + db.escape(login);
		db.query(sql, function(error, row) 
		{
			if(error)
			{
				throw error;
			}
			else
			{
				callback(null, row);
			}
		});
	}
}
module.exports = userModel;