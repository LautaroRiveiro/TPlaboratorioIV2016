angular.module('login.controllers', [])

.controller('loginCtrl', function($scope, $auth, $location){
	
	$scope.estado = "login";
	$scope.usuario = {};

	$scope.Login = function(){
		$auth.login($scope.usuario)
		.then(function(){
			//Logueo OK
			console.info($scope.usuario);
		})
		.catch(function(error){
			//Error de logueo
			console.info(error);	
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