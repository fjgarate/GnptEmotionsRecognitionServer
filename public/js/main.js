// Creación del módulo
var angularRoutingApp = angular.module('angularRoutingApp', [ 'ngRoute',
		'ui.bootstrap', 'ngResource' ]);
var plunker = angular.module('plunker', [ 'nvd3' ]);
console.log('pasa');
//Configuración de las rutas
angularRoutingApp.config(function($routeProvider) {

	$routeProvider
	.
    when('/prueba', {
        templateUrl : 'pages/prueba.html',
        controller  : 'pruebaController'
    })
    .

    when('/', {
        templateUrl : 'pages/listado.html',
        controller  : 'listadoController'
    })
    .otherwise({
        redirectTo: '/'
    });
});
angularRoutingApp.controller('listadoController', function($scope, $http) {

	console.log('listado controller');
	 $('#example').DataTable( {
	        "ajax": "http://138.4.10.142:8443/results",
	        "columns": [
	            { "data": "idUser" },
	            { "data": "tarea" }
	 
	        ]
	    } );
});
angularRoutingApp.controller('pruebaController', function($scope, $http) {

	console.log('pruebaController');

});
var app = angular.module("app", [ 'angularRoutingApp', 'plunker' ]);