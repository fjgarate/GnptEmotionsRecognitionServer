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
		db.query('SELECT * FROM results ', function(error, rows) {
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
		db.query('INSERT INTO results SET ?', resultData, function(error, result) 
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
};
resultModel.getResultById = function(id,callback)
{
	if (db) 
	{
		var sql = 'SELECT * FROM results WHERE result_id = ' + db.escape(id);
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
resultModel.getEmotionResultById = function(id,callback)
{
	var emotion_attention = [];
	var emotion_anger = [];
	var emotion_disgust = [];
	var emotion_engagement = [];
	var emotion_joy = [];
	var emotion_sadness = [];
	var emotion_surprise = [];
	var emotion_valence = [];
	if (db) 
	{
		var sql = 'SELECT attention,anger,disgust,engagement,joy,sadness,surprise,valence FROM emotion_result WHERE result_id = ' + db.escape(id);
		db.query(sql, function(error, rows) 
		{
			if(error)
			{
				throw error;
			}
			else
			{
		
			
			for (var i = 0; i < rows.length; i++) {

				emotion_attention.push({x: i, y:rows[i].attention});
				emotion_anger.push({x: i, y:rows[i].anger});
				emotion_disgust.push({x: i, y:rows[i].disgust});
				emotion_engagement.push({x: i, y:rows[i].engagement});
				emotion_joy.push({x: i, y:rows[i].joy});
				emotion_sadness.push({x: i, y:rows[i].sadness});
				emotion_surprise.push({x: i, y:rows[i].surprise});
				emotion_valence.push({x: i, y:rows[i].valence});
               
            }
			final = [
						{
							values : emotion_attention, //values - represents the array of {x,y} data points
							key : 'Attention', //key  - the name of the series.
							//     color: '#ff7f0e',  //color - optional: choose your own line color.
							strokeWidth : 4,
							  disabled: false,
							classed : 'dashed'
						},
						{
							values : emotion_anger, //values - represents the array of {x,y} data points
							key : 'Anger', //key  - the name of the series.
							//     color: '#ff7f0e',  //color - optional: choose your own line color.
							strokeWidth : 4,
							  disabled: true,
							classed : 'dashed'
						},
						{
							values : emotion_disgust, //values - represents the array of {x,y} data points
							key : 'Disgust', //key  - the name of the series.
							//     color: '#ff7f0e',  //color - optional: choose your own line color.
							strokeWidth : 4,
							  disabled: true,
							classed : 'dashed'
						},
						{
							values : emotion_engagement, //values - represents the array of {x,y} data points
							key : 'Engagement', //key  - the name of the series.
							//     color: '#ff7f0e',  //color - optional: choose your own line color.
							strokeWidth : 4,
							  disabled: true,
							classed : 'dashed'
						},
						{
							values : emotion_joy, //values - represents the array of {x,y} data points
							key : 'Joy', //key  - the name of the series.
							//      color: '#ff7f0e',  //color - optional: choose your own line color.
							strokeWidth : 4,
							  disabled: true,
							classed : 'dashed'
						},
						{
							values : emotion_sadness, //values - represents the array of {x,y} data points
							key : 'Sadness', //key  - the name of the series.
							//      color: '#ff7f0e',  //color - optional: choose your own line color.
							strokeWidth : 4,
							  disabled: true,
							classed : 'dashed'
						},
						{
							values : emotion_surprise, //values - represents the array of {x,y} data points
							key : 'Surprise', //key  - the name of the series.
							//      color: '#ff7f0e',  //color - optional: choose your own line color.
							strokeWidth : 4,
							  disabled: true,
							classed : 'dashed'
						},
						{
							values : emotion_valence, //values - represents the array of {x,y} data points
							key : 'Valence', //key  - the name of the series.
							//      color: '#ff7f0e',  //color - optional: choose your own line color.
							strokeWidth : 4,
							  disabled: true,
							classed : 'dashed'
						}
						];
				//	console.log(final)	
				callback(null, final);
			}
		});
	}
}
module.exports = resultModel;