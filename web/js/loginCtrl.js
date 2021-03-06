angular.module('login.controllers', [])

.controller('loginCtrl', function($scope, $auth, $location, $http, $state, usuario){
	
	$scope.estado = "login";
	$scope.bienvenido = "";
	$scope.usuario = {};
	$scope.usuario.email = "";
	$scope.usuario.password = "";
	$scope.nuevo = {};
	$scope.nuevo.perfil = "Cliente";

	//Valores para test:
	$scope.nuevo.nombre = "Prueba";
	$scope.nuevo.apellido = "Test";
	$scope.nuevo.email = "@prueba.com";
	$scope.nuevo.sexo = "Masculino";
	$scope.nuevo.password = "1234";
	$scope.nuevo.confirmarClave = "1234";

	/* ¿Qué hago en Loguear()?
     * Llamo por POST (http) al authProvider, que configuré en app.config.
     * Le paso como parámetro un objeto JSON que contiene las credenciales del login.
     * Si la conexión fue exitosa (no importa si el log existe), se ejecuta la función success del then(), donde recién ahí evalúo si existe o no el usuario y la clave.
     * Si hubo algún error en la conexión, se ejecuta la función de error del then(), donde muestro por consola el error.
    */
	$scope.Loguear = function(){
		if ($scope.usuario.email == "" || $scope.usuario.password == "") {
			alert("Completar los campos!");
			return;
		}
		usuario.Loguear($scope.usuario);
	};

	$scope.SignUp = function(){
        $auth.signup($scope.nuevo)
        .then(function(response) {
            console.info("response", response);
			for (var campo in $scope.nuevo) {
			    $scope.nuevo[campo] = "";
			}
			$scope.nuevo.perfil = "Cliente";
			$scope.estado = "login";
			$scope.bienvenido = response.data.datosDB.nombre;
			$('#alertaError').hide();
			$('#alertaBienvenida').fadeIn(1000);
        })
        .catch(function(error) {
			//Error durante registración
			console.info("Error de conexión", error);
        });

	}

	$scope.Registrarse = function(){
		$scope.estado = "signup";
		//console.info("getPayload: ", $auth.getPayload());
	}

	$scope.Volver = function(){
		for (var campo in $scope.nuevo) delete $scope.nuevo[campo];
		$scope.nuevo.perfil = "Cliente";
		$scope.estado = "login";
	}

	$scope.CargarDatos = function(tipo){
		switch(tipo){
			case 'CLIENTE':
				$scope.usuario.email = "cliente@cliente.com";
				$scope.usuario.password = "1234";
				break;
			case 'ENCARGADO':
				$scope.usuario.email = "encargado@encargado.com";
				$scope.usuario.password = "1234";
				break;
			case 'EMPLEADO':
				$scope.usuario.email = "empleado@empleado.com";
				$scope.usuario.password = "1234";
				break;
			case 'ADMINISTRADOR':
				$scope.usuario.email = "admin@admin.com";
				$scope.usuario.password = "1234";
				break;
			default:
				$scope.usuario.email = "";
				$scope.usuario.password = "";
				break;
		}
	}	
})