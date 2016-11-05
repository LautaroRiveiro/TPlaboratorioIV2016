angular.module('login.controllers', [])

.controller('loginCtrl', function($scope, $auth, $location, $http){
	
	$scope.estado = "login";
	$scope.usuario = {};
	$scope.nuevo = {};

	//Valores para test:
	$scope.usuario.email = "admin@admin.com";
	$scope.usuario.password = "1234";


	/* ¿Qué hago en Loguear()?
     * Llamo por POST (http) al authProvider, que configuré en app.config.
     * Le paso como parámetro un objeto JSON que contiene las credenciales del login.
     * Si la conexión fue exitosa (no importa si el log existe), se ejecuta la función success del then(), donde recién ahí evalúo si existe o no el usuario y la clave.
     * Si hubo algún error en la conexión, se ejecuta la función de error del then(), donde muestro por consola el error.
    */
	$scope.Loguear = function(){
		//$auth.login() hace una llamada de tipo POST al $authProvider.loginUrl establecido en app.js
		//Al combinarlo con Slim Framework es necesario configurar $app->post() y no otro.
		$auth.login($scope.usuario)
		.then(function(resp){
			//Logueo OK
			console.info("Respuesta: ", resp.data);
		})
		.catch(function(error){
			//Error de logueo
			console.info("Error de conexión", error);	
		});
	}

	$scope.SignUp = function(){
		
	}

	$scope.Registrarse = function(){
		$scope.estado = "signup";
	}

	$scope.Volver = function(){
		$scope.estado = "login";
	}
})