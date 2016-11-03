angular.module("login.controllers")

.controller('loginCtrl', function($scope, $auth, $location){
	
	$scope.usuario = {};

	$scope.Login = function(){
		$auth.login($scope.usuario)
		.then(function(){
			//Logueo OK
		})
		.catch(function(error){
			//Error de logueo
		});
	}

	$scope.SignUp = function(){
		
	}

})