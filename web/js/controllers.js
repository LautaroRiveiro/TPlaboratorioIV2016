angular.module('starter.controllers', [])

.controller('menuCtrl', function($scope, $auth, $location, usuario){
	usuario.VerificarLogueado();

	$scope.usuario = usuario.Datos();

	$scope.Logout = function(){
    	usuario.Salir();
    };
})

.controller('mainCtrl', function($scope, $auth, $location, usuario){
	usuario.VerificarLogueado();

	$scope.usuario = usuario.Datos();

	$scope.Logout = function(){
		usuario.Salir();
    };
})

.controller('denegadoCtrl', function($scope, $auth, $location, usuario, $state){
	usuario.VerificarLogueado();

	$scope.usuario = usuario.Datos();

	$scope.Volver = function(){
		if($scope.usuario.perfil == "Cliente"){
			$state.go("main.cliente");
		}
		else{
			$location.path("/main/menu");
		}
    };
});