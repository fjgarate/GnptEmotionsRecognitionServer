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

//add a new result
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
			{
				callback(null,{"insertId" : result.insertId});
			}
		});
	}
};


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
userModel.getUserByName = function(name,callback)
{
	if (db) 
	{
		var sql = 'SELECT * FROM user WHERE user_name = ' + db.escape(name);
		db.query(sql, function(error, row) 
		{
			if(error)
			{
				console.log("After query FAIL: "+error);
				throw error;
			}
			else
			{
				console.log("After query OK: "+row);
				callback(null, row);
			}
		});
	}
};

module.exports = userModel;