/**
 * http://usejsdoc.org/
 */
//llamamos al paquete mysql que hemos instalado
var db=require('../dbconnection'); //reference of dbconnection.js

//creamos un objeto para ir almacenando todo lo que necesitemos
var resultModel = {};

resultModel.getResults = function(callback)
{
	if (db) 
	{
		db.query('SELECT * FROM resultados ', function(error, rows) {
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
resultModel.saveResult = function(resultData,callback)
{
	if (db) 
	{
		db.query('INSERT INTO resultados SET ?', resultData, function(error, result) 
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
module.exports = resultModel;