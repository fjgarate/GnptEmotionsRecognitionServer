
/*
 * GET home page.
 */

var ResultModel = require('../models/results');
console.log('llega...');
module.exports = function(app)
{
//mostramos todos los usuarios 
app.get("/results", function(req,res){
	ResultModel.getResults(function(error, data)
	{
		res.json(200,data);
	});
});

//obtiene un usuario por su id
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
app.get("/", function(req,res){
	res.render('index', {title:"hola"});
});
};

