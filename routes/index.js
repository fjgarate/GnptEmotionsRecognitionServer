
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
		res.json(200,data);
	});
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
			console.log('correcto');
			res.json(200,'OK');
		}
		else
		{
			console.log('ERROR');
		}
	});
});
app.get("/", function(req,res){
	res.render('index', {title:"hola"});
});
};

