angular.module('encuesta.controller',[])

.controller('encuestaCtrl', function($scope, usuario){
	//usuario.VerificarLogueado();
	
	$scope.encuesta = {};
	$scope.encuesta.prueba = "Prueba";

	//Datos para test rápido
	$scope.encuesta.pregunta1 = 4;
	$scope.encuesta.pregunta2 = 3;
	$scope.encuesta.pregunta3 = 2;
	$scope.encuesta.pregunta4 = 5;
	$scope.encuesta.pregunta5 = 4;
	$scope.encuesta.pregunta6 = 1;
	//$scope.encuesta.pregunta7 = {};

	$scope.Guardar = function(){
		if ($scope.encuesta.pregunta7 == undefined) {$scope.encuesta.pregunta7 = {};};
		if ($scope.encuesta.pregunta7.uno == undefined) {$scope.encuesta.pregunta7.uno = false;};
		if ($scope.encuesta.pregunta7.dos == undefined) {$scope.encuesta.pregunta7.dos = false;};
		if ($scope.encuesta.pregunta7.tres == undefined) {$scope.encuesta.pregunta7.tres = false;};
		if ($scope.encuesta.pregunta7.cuatro == undefined) {$scope.encuesta.pregunta7.cuatro = false;};
		if ($scope.encuesta.pregunta7.cinco == undefined) {$scope.encuesta.pregunta7.cinco = false;};

		console.info("Lo que se va a enviar", $scope.encuesta);
		return;
	}
});