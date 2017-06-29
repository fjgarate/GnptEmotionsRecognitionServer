
/*
 * GET home page.
 */

var ResultModel = require('../models/results');
var UserModel = require('../models/user');
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
	var resultData=JSON.parse(req.body.resultados);

	console.log(resultData );
	//creamos un objeto con los datos a insertar del usuario

	
	ResultModel.saveResult(resultData,function(error, data)
	{
		//si el usuario se ha insertado correctamente mostramos su info
		if(data && data.insertId)
		{
			console.log('correcto');
			res.json(200,'OK');
		}
		else
		{
			console.log('ERROR');
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
	//solo actualizamos si la id es un número
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
	//si hay algún error
	else
	{
		res.json(500,{"msg":"Error"});
	}
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
	var userData=JSON.parse(req.body.user);

	console.log(userData );
	//creamos un objeto con los datos a insertar del usuario

	
	UserModel.saveUser(userData,function(error, data)
	{
		//si el usuario se ha insertado correctamente mostramos su info
		if(data && data.insertId)
		{
			res.json(200,'OK');
		}
		else
		{
			console.log('ERROR');
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
};

