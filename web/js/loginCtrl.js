angular.module('login.controllers', [])

.controller('loginCtrl', function($scope, $auth, $location, $http, $state){
	
	$scope.estado = "login";
	$scope.usuario = {};
	$scope.nuevo = {};
	$scope.nuevo.perfil = "Cliente";

	//Valores para test:
	$scope.usuario.email = "admin@admin.com";
	$scope.usuario.password = "1234";
	$scope.nuevo.nombre = "Prueba";
	$scope.nuevo.apellido = "Test";
	$scope.nuevo.email = "@prueba.com";
	$scope.nuevo.sexo = "M";
	$scope.nuevo.password = "1234";
	$scope.nuevo.confirmarClave = "1234";

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
			if($auth.isAuthenticated()){
				console.info("response: ", resp);
				console.info("getPayload: ", $auth.getPayload());
				$state.go("main.menu");
			}
			else{
				console.log("Usuario o contraseña incorrecta");
				console.log(resp);
				$scope.usuario.password = "";
			}
		})
		.catch(function(error){
			//Error durante logueo
			console.info("Error de conexión", error);
		});
	};

	$scope.SignUp = function(){
		console.log("FF");
		//$auth.removeToken();
		//console.info("isAuthenticated: ", $auth.isAuthenticated());



      $auth.signup($scope.nuevo)
        .then(function(response) {
          console.info("Ok", response);
          console.info("Nuevo usuario: ", $auth.getPayload());
          $state.go("inicio");
        })
        .catch(function(error) {
			//Error durante registración
			console.info("Error de conexión", error);
        });



	}

	$scope.Registrarse = function(){
		$scope.estado = "signup";
		console.info("getPayload: ", $auth.getPayload());
	}

	$scope.Volver = function(){
		for (var campo in $scope.nuevo) delete $scope.nuevo[campo];
		$scope.nuevo.perfil = "Cliente";
		$scope.estado = "login";
	}
})