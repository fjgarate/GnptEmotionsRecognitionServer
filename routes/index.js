
/*
 * GET home page.
 */

var ResultModel = require('../models/results');
var UserModel = require('../models/user');
var crypto = require('crypto');
var mysqlDump = require('mysqldump');
module.exports = function(app)
{
//mostramos todos los usuarios 
app.get("/results", function(req,res){
	ResultModel.getResults(function(error, data)
	{
		res.json(200,{data:data});
	});
});

app.get("/results/:id", function(req,res)
{
	//id del usuario
	var id = req.params.id;
	//de momento solo redireccionamos
	ResultModel.getResultById(id, function(error, data) {
		console.log('id-->: '+data[0].result_id)
		var final=data[0];
		if (typeof data !== 'undefined' && data.length > 0)
			{
			
			ResultModel.getGeneralResults(id, function(error, data2) {
				console.log(data2)
				if (typeof data !== 'undefined')
					{
			
					//res.json(data);
					console.log('ss')
					res.render('result', {title:'GNPT EMOTION',data:data[0],
						                  percentage:data2.percentage,
						                  correct:data2.correct,
						                  mistaken:data2.mistaken,
						                  omitted:data2.omitted,
						                  attention:data2.attention
											});
					}
					//en otro caso mostramos una respuesta conforme no existe
					else
					{
						console.log('pasa error')
						res.json(404,{"msg":"notExist"});
					}
			})
			
			
			
			
			}
			//en otro caso mostramos una respuesta conforme no existe
			else
			{
				res.json(404,{"msg":"notExist"});
			}
	})
	
	
});
//obtiene un usuario por su id
app.get("/emotionresults/:id", function(req,res)
{
	//id del resultado
	var id = req.params.id;
	console.log('id2:'+id)
	//de momento solo redireccionamos
	ResultModel.getEmotionResultById(id, function(error, data) {
	
		if (typeof data !== 'undefined' && data.length > 0)
			{
			res.json(data);
			
			}
			//en otro caso mostramos una respuesta conforme no existe
			else
			{
				res.json(404,{"msg":"notExist"});
			}
	})
});

app.get("/emotionmeanresults/:id", function(req,res)
{
	//id del resultado
	var id = req.params.id;
	console.log('id2:'+id)
	//de momento solo redireccionamos
	ResultModel.getEmotionMeanResultById(id, function(error, data) {
	
		if (typeof data !== 'undefined' && data.length > 0)
			{
			res.json(data);
			
			}
			//en otro caso mostramos una respuesta conforme no existe
			else
			{
				res.json(404,{"msg":"notExist"});
			}
	})
});
app.get("/generalresults/:id", function(req,res)
		{
			//id del resultado
			var id = req.params.id;
			//de momento solo redireccionamos
			ResultModel.getGeneralResults(id, function(error, data) {
				console.log(data)
				if (typeof data !== 'undefined')
					{

					res.json(data);
					
					}
					//en otro caso mostramos una respuesta conforme no existe
					else
					{
						console.log('pasa error')
						res.json(404,{"msg":"notExist"});
					}
			})
		});

app.post("/saveresults", function(req,res)
		{	
			console.log("Llega..." + req.body.resultados);

			var decipher = crypto.createDecipher('aes-128-ecb', 'Prueba');
			chunks = [];
			chunks.push( decipher.update( new Buffer(req.body.resultados, "base64").toString("binary")) );
			chunks.push( decipher.final('binary') );
			var txt = chunks.join("");
			txt = new Buffer(txt, "binary").toString("utf-8");
			console.log("Tras descifrar:" + txt);
			
			var resultData=JSON.parse(txt);
			console.log("JSON resultante:" + resultData);
			
			var emotions = resultData.result_id;
			resultData.result_id = '';
			console.log(resultData);
			
			//creamos un objeto con los datos a insertar del usuario
			ResultModel.saveResult(resultData,function(error, data)
			{
				//si el usuario se ha insertado correctamente mostramos su info
				if(error===null)//(data && data.insertId)
				{
					console.log('result inserted correctly with id: '+data.insertId);
					ResultModel.saveEmotion(emotions, data.insertId, function(error, data){
						if(error===null){
							console.log('emotions result inserted correctly');
							res.json({"msg":"OK"});
						}else{
							console.log('error index saveEmotion: '+error);
						}
					});
				}
				else
				{
					console.log('error index saveResult: '+error);
				}
			});
		});

app.post("/enviofromlocal", function(req,res){	
			console.log("Llega2..." + req.body.resultados);
			var string = req.body.resultados;
			var arraycoded = string.split(",");
			
			var arraydecoded = [];
			
			for (var i = 0; i < arraycoded.length; i++){
				var decipher = crypto.createDecipher('aes-128-ecb', 'Prueba');
				var chunks = [];
				chunks.push(decipher.update(new Buffer(arraycoded[i], "base64").toString("binary")) );
				chunks.push(decipher.final('binary'));
				var txt = chunks.join("");
				txt = new Buffer(txt, "binary").toString("utf-8");
				arraydecoded.push(JSON.parse(txt));
			}
			console.log(arraydecoded);
			/*for (var j=0; j < arraydecoded.length; j++){
				
				var emotions = arraydecoded[j].result_id;
				arraydecoded[j].result_id='';
				console.log(arraydecoded[j]);
				//creamos un objeto con los datos a insertar del usuario
				ResultModel.saveResult(arraydecoded[j],function(error, data){
					//si el usuario se ha insertado correctamente mostramos su info
					if(error===null){
						console.log('result inserted correctly with id: '+data.insertId);
						ResultModel.saveEmotion(emotions, data.insertId, function(error, data){
							if(error===null){
								console.log('emotions result inserted correctly');
								res.json({"msg":"OK2"});
							}else{
								console.log('error index saveEmotion: '+error);
							}});
					}else{
						console.log('error index saveResult: '+error);
					}
				});
			}*/
			ResultModel.saveResultArray(arraydecoded,function(error, data){
				//si el usuario se ha insertado correctamente mostramos su info
				if(error===null){
					console.log('result inserted correctly with id: '+data.insertId);
					ResultModel.saveEmotionArray(data.emotions, data.insertId, function(error, data){
						if(error===null){
							console.log('emotions result inserted correctly');
							res.json({"msg":"OK2"});
						}else{
							console.log('error index saveEmotion: '+error);
						}});
				}else{
					console.log('error index saveResult: '+error);
				}
			});
			
});

//mostramos todos los usuarios 
app.get("/user", function(req,res){
	UserModel.getUsers(function(error, data)
	{
		res.json(200,data);
	});
});
//obtiene un usuario por su id
app.get("/user/:id", function(req,res)
{
	//id del usuario
	var id = req.params.id;
	//solo actualizamos si la id es un n�mero
	if(!isNaN(id))
	{
		UserModel.getUser(id,function(error, data)
		{
			//si el usuario existe lo mostramos en formato json
			if (typeof data !== 'undefined' && data.length > 0)
			{
				res.json(200,data);
			}
			//en otro caso mostramos una respuesta conforme no existe
			else
			{
				res.json(404,{"msg":"notExist"});
			}
		});
	}
	//si hay alg�n error
	else
	{
		res.json(500,{"msg":"Error"});
	}
});

//obtiene un usuario por su id
app.post("/userlogin", function(req,res){
	console.log("Llega..." + req.body.user);

	var decipher = crypto.createDecipher('aes-128-ecb', 'Prueba');
	var chunks = [];
	chunks.push( decipher.update( new Buffer(req.body.user, "base64").toString("binary")) );
	chunks.push( decipher.final('binary') );
	var txt = chunks.join("");
	txt = new Buffer(txt, "binary").toString("utf-8");
	console.log("Tras descifrar:" + txt);
	
	var userData=JSON.parse(txt);
	var login=userData.user_name;
	console.log(userData);
	console.log(login);

	//creamos un objeto con los datos a insertar del usuario
	UserModel.getUserByName(login,function(error, data){
				//si el usuario existe lo mostramos en formato json
				if (typeof data !== 'undefined' && data.length > 0){
					//res.write({"msg":"existe"})
					res.json({"msg":"exist"});
				}
				//en otro caso mostramos una respuesta conforme no existe
				else{
					res.json({"msg":"notExist"});
				}
			});
});


//obtiene un usuario por su login
app.get("/userLogin/:login", function(req,res)
{
	//id del usuario
	var login = req.params.login;

		UserModel.getUserByName(login,function(error, data)
		{
			//si el usuario existe lo mostramos en formato json
			if (typeof data !== 'undefined' && data.length > 0)
			{
				res.json(200,data);
			}
			//en otro caso mostramos una respuesta conforme no existe
			else
			{
				res.json(404,{"msg":"notExist"});
			}
		});
	
});
//obtiene un usuario por su id
app.post("/userLogin", function(req,res)
{	
	var userData=JSON.parse(req.body.user);
    var login=userData.user_name;
	console.log(userData );
	//creamos un objeto con los datos a insertar del usuario

	UserModel.getUserByName(login,function(error, data)
			{
				//si el usuario existe lo mostramos en formato json
				if (typeof data !== 'undefined' && data.length > 0)
				{
					res.json(200,data);
				}
				//en otro caso mostramos una respuesta conforme no existe
				else
				{
					res.json(404,{"msg":"notExist"});
				}
			});
});


app.post("/saveuser", function(req,res)
		{	
			console.log("Llega..." + req.body.user);

			var decipher = crypto.createDecipher('aes-128-ecb', 'Prueba');
			var chunks = [];
			chunks.push( decipher.update( new Buffer(req.body.user, "base64").toString("binary")) );
			chunks.push( decipher.final('binary') );
			var txt = chunks.join("");
			txt = new Buffer(txt, "binary").toString("utf-8");
			console.log("Tras descifrar:" + txt);
	
			var userData=JSON.parse(txt);
			var user_name=userData.user_name;
			console.log(userData);
			console.log(user_name);
			
			//creamos un objeto con los datos a insertar del usuario
			UserModel.getUserByName(user_name,function(error, data){
				if (typeof data !== 'undefined' && data.length > 0){
					res.json({"msg":"existe"});
				}
				else{
					UserModel.saveUser(userData,function(error, data){
							//si el usuario se ha insertado correctamente mostramos su info
							if(error===null){
								console.log('user inserted correctly with id: '+data.insertId);
								res.json({"msg":"correcto","id":data.insetId});
							}else{
								console.log('ERROR '+error);
							}
					});
				}
			});

		});

app.get("/", function(req,res){
	var listResults;
	ResultModel.getResults(function(error, data)
			{
				//res.json(200,data);
		console.log('data: '+data);
		listResults=data;
		res.render('index', {title:"hola",data:listResults});
			});
});
app.get("/overview", function(req,res){
	var listResults;
	ResultModel.getResultsOverview(function(error, data)
			{
		res.render('overview', {title:"Gnpt Emotions results",data:data});
			});
});

app.get('/exportEmotions', function(req,res){
	var mysqlDump = require('mysqldump');
	mysqlDump({
	    host: 'localhost',
	    user: 'gnpt',
	    password: 'gnpt',
	    database: 'gnpt_results',
	    table: ['emotion_result'],
	    dest:'./dataEmotions.sql' // destination file 
	},function(err){
	    console.log("Error al volcar la tabla emotion_result de la base de datos: " + err);
	});
	var json2xls = require('json2xls');
	var fs = require("fs");
	ResultModel.getEmotionsTable(function(error, data)
		{
			var xls = json2xls(data);
			fs.writeFileSync('dataEmotions.xlsx', xls, 'binary');
			res.download('dataEmotions.xlsx');
		});
});

app.get('/exportResults',function(req, res) {
	var mysqlDump = require('mysqldump');
	mysqlDump({
	    host: 'localhost',
	    user: 'gnpt',
	    password: 'gnpt',
	    database: 'gnpt_results',
	    table: ['results'],
	    dest:'./dataResults.sql' // destination file 
	},function(err){
	    console.log("Error al volcar la tabla results base de datos: " + err);
	});
	var json2xls = require('json2xls');
	var fs = require("fs");
	ResultModel.getResults(function(error, data)
		{
			var xls = json2xls(data);
			fs.writeFileSync('dataResults.xlsx', xls, 'binary');
			res.download('dataResults.xlsx');
		});
});

app.get("/exportOverview", function(req,res){
	var json2xls = require('json2xls');
	var fs = require("fs");
	ResultModel.getResultsOverview(function(error, data)
		{
			var xls = json2xls(data);
			fs.writeFileSync('dataOverview.xlsx', xls, 'binary');
			res.download('dataOverview.xlsx');
		});
});
app.get("/export", function(req,res){
	var mysqlDump = require('mysqldump');
	mysqlDump({
	    host: 'localhost',
	    user: 'gnpt',
	    password: 'gnpt',
	    database: 'gnpt_results',
	    table: ['results'],
	    dest:'./dataEmotions.sql' // destination file 
	},function(err){
	    console.log("Error al volcar la base de datos: " + err);
	});
});
};
