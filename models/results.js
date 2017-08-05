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
		db.query('SELECT * FROM results  order by date desc', function(error, rows) {
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
resultModel.getResultsOverview = function(callback)
{
	if (db) 
	{
		var sql = 'select ('+
		'SELECT count(*) FROM gnpt_results.results'+
		')  as num_results,'+
		'('+
		'SELECT count(distinct(user_name)) FROM gnpt_results.results'+
		')  as num_users,'+
		'('+
		'SELECT count(distinct(session_id)) FROM gnpt_results.results'+
		')  as num_sessions,'+
		'('+
		'SELECT sum(frames_detected) FROM gnpt_results.results'+
		')  as frames_detected,'+
		'('+
		'SELECT sum(frames_noface) FROM gnpt_results.results'+
		')  as frames_noface;';
		
		
		db.query(sql, function(error, rows) {
			if(error)
			{
				throw error;
			}
			else
			{
				callback(null, rows[0]);
			}
		});
	}
};
resultModel.getGeneralResults = function(id,callback)
{
	
	if (db) 
	{
		var sql = 'select ('+
			'SELECT percentage FROM gnpt_results.results where  result_id= ' + db.escape(id) 
			+')  as percentage ,'+ 
			'('+ 
			'SELECT correct FROM gnpt_results.results where  result_id= ' + db.escape(id)
			+')  as correct ,'+ 
			'('+ 
			'SELECT mistaken FROM gnpt_results.results where  result_id= ' + db.escape(id)
			+')  as mistaken ,'+ 
			'('+ 
			'SELECT omitted FROM gnpt_results.results where  result_id= ' + db.escape(id)
			+')  as omitted ,'+ 
			'('+ 
			'SELECT Round(AVG(attention),2) FROM gnpt_results.emotion_result where  result_id= ' + db.escape(id)
			+')  as attention';
		
			
		db.query(sql, function(error, rows) {
			if(error)
			{
				throw error;
			}
			else
			{
				callback(null,rows[0]);
			};
		});
	}
};

// ad a result emotion
resultModel.saveEmotion = function(emotions, insertId, callback){
	if(db){
		for (var i = 0; i < emotions.length; i++){
			if(typeof emotions[i] !== 'undefined' && emotions[i] !== null){
				emotions[i].result_id = insertId;
				//console.log(emotions[i]);
				db.query('INSERT INTO emotion_result SET ?',emotions[i], function(error, result){
					if(error){
						console.log('error saving emotion result: '+error);
						throw error;
					}else{
						console.log("emotions result inserted correctly for result " +insertId);
						callback(null,{"insertId" : result.insertId});
					}});
			}
		}
	}
};

// add emotion from result array
resultModel.saveEmotionArray = function(emotions, ids, callback){
	if(db){
		for (var i = 0; i < emotions.length; i++){
			for (var j = 0; j <emotions[i].length; j++){
			if(typeof emotions[i][j] !== 'undefined' && emotions[i][j] !== null){
				emotions[i][j].result_id = ids[i];
				//console.log(emotions[i]);
				db.query('INSERT INTO emotion_result SET ?',emotions[i][j], function(error, result){
					if(error){
						console.log('error saving emotion result: '+error);
						throw error;
					}else{
						console.log("emotions result inserted correctly for result " +ids[i]);
						callback(null,{"insertId" : result.insertId});
					}});
			}
			}
		}
	}
};

//add a new result
resultModel.saveResult = function(resultData,callback)
{	
	if (db) 
	{
		db.query('INSERT INTO results SET ?', resultData, function(error, result){
			if(error){
				console.log('error saveResult result: '+error);
				throw error;
			}else{
				//console.log(result);
				callback(null,{"insertId" : result.insertId});
			}});
	}
};

//add a new result from array
resultModel.saveResultArray = function(resultData,callback){
	var emotions = [];
	var ids = [];
	if (db){
		for (var i = 0; i < resultData.length; i++){
			emotions.push(resultData[i].result_id);
			resultData[i].result_id = '';
			db.query('INSERT INTO results SET ?', resultData[i], function(error, result){
			if(error){
				console.log('error saveResult from array: '+error);
				throw error;
			}else{
				ids.push(result.insertId);
				callback(null,{"insertId" : ids, "emotions":emotions});
			}});
	}
}};

resultModel.getEmotionsTable = function(callback){
	if (db){
		db.query('SELECT * FROM emotion_result', function(error, result){
		if(error){
			console.log('error saveResult from array: '+error);
			throw error;
		}else{
			callback(null,result);
		}});
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
	//var emotion_fear = [];
	//var emotion_contempt = [];
	var view_change = [];
	var view = 0;
	
	if (db) 
	{
		var sql = 'SELECT attention,anger,contempt,disgust,engagement,fear,joy,sadness,surprise,valence FROM emotion_result WHERE result_id = ' + db.escape(id) ;
		db.query(sql, function(error, rows) 
		{
			if(error)
			{
				throw error;
			}else{
		
			
			for (var i = 0; i < rows.length; i++) {
				emotion_attention.push({x: i, y:rows[i].attention});
				emotion_anger.push({x: i, y:rows[i].anger});
				emotion_disgust.push({x: i, y:rows[i].disgust});
				emotion_engagement.push({x: i, y:rows[i].engagement});
				emotion_joy.push({x: i, y:rows[i].joy});
				emotion_sadness.push({x: i, y:rows[i].sadness});
				emotion_surprise.push({x: i, y:rows[i].surprise});
				emotion_valence.push({x: i, y:rows[i].valence});
				//emotion_fear.push({x: i, y:rows[i].fear});
				//emotion_contempt.push({x: i, y:rows[i].contempt});
				if (view!==rows[i].view){
					view = rows[i].view;
					view_change.push(i);
				} 
            }
			console.log(view_change);
			var final = [
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
						}/*,
						{
							values : emotion_fear, //values - represents the array of {x,y} data points
							key : 'Fear', //key  - the name of the series.
							//     color: '#ff7f0e',  //color - optional: choose your own line color.
							strokeWidth : 4,
							  disabled: true,
							classed : 'dashed'
						},
						{
							values : emotion_contempt, //values - represents the array of {x,y} data points
							key : 'Contempt', //key  - the name of the series.
							//     color: '#ff7f0e',  //color - optional: choose your own line color.
							strokeWidth : 4,
							  disabled: true,
							classed : 'dashed'
						}*/
						];
			
				//	console.log(final)	
				callback(null, final);
			}
		});
	}
}
resultModel.getEmotionMeanResultById = function(id,callback)
{
	var values = [];
	if (db) 
	{
		var sql = 'SELECT Round(AVG(attention),2) as attention,Round(AVG(anger),2) as anger ,Round(AVG(disgust),2) as disgust ,Round(AVG(engagement),2) as engagement,Round(AVG(joy),2) as joy ,Round(AVG(sadness),2) as sadness ,Round(AVG(surprise),2) as surprise ,Round(AVG(valence),2) as valence FROM emotion_result WHERE result_id = ' + db.escape(id);
		db.query(sql, function(error, rows) 
		{
			if(error)
			{
				throw error;
			}
			else
			{
		
			
			if (rows.length>0) {

				/*values.push({
			         label: 'Atenttion',
			         value:Number(rows[0].attention)
			        });*/
				
				values.push({
			         label: 'Anger',
			         value:Number(rows[0].anger)
			        });
				
				values.push({
			         label: 'Disgust',
			         value:Number(rows[0].disgust)
			        });
				
				values.push({
			         label: 'Engagement',
			         value:Number(rows[0].engagement)
			        });
				
				values.push({
			         label: 'Joy',
			         value:Number(rows[0].joy)
			        });
				
				values.push({
			         label: 'Sadness',
			         value:Number(rows[0].sadness)
			        });
				
				values.push({
			         label: 'Surprise',
			         value:Number(rows[0].surprise)
			        });
				
				values.push({
			         label: 'Valence',
			         value:Number(rows[0].valence)
			        });
            }
			
			final = [
						{
							key :"valoress medios", //values - represents the array of {x,y} data points
							values : values
							
						}
						];
				//	console.log(final)	
				callback(null, final);
			}
		});
	}
}
module.exports = resultModel;