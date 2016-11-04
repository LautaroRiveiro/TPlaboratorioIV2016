angular.module('login.controllers', [])

.controller('loginCtrl', function($scope, $auth, $location, $http){
	
	$scope.estado = "login";
	$scope.usuario = {};

	$scope.Login = function(){
		/*$auth.login($scope.usuario)
		.then(function(){
			//Logueo OK
			console.info($scope.usuario);
		})
		.catch(function(error){
			//Error de logueo
			console.info(error);	
		});*/
		$http.get("http://localhost/TPlaboratorioIV2016/ws/user/lautaro").then(function(resp){
			console.info(resp);
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