angular.module('miApp')

.controller('menuCtrl', function($scope, $auth){
	$scope.perfil = "";
	var perfil = $auth.getPayload();
	$scope.perfil = perfil.perfil;
	console.info(perfil);
	console.info($scope.perfil);
});