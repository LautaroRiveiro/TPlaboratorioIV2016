angular.module('encuesta.controller',[])

.controller('encuestaCtrl', function($scope, usuario, $state, ws){
	//usuario.VerificarLogueado();
	console.log("ESTOY ADENTRO");
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

	$scope.GuardarEncuesta = function(){
		if ($scope.encuesta.pregunta7 == undefined) {$scope.encuesta.pregunta7 = {};};
		// if ($scope.encuesta.pregunta7.uno == undefined || $scope.encuesta.pregunta7.uno == false) {$scope.encuesta.pregunta7.uno = 0;};
		// if ($scope.encuesta.pregunta7.dos == undefined || $scope.encuesta.pregunta7.uno == false) {$scope.encuesta.pregunta7.dos = 0;};
		// if ($scope.encuesta.pregunta7.tres == undefined || $scope.encuesta.pregunta7.uno == false) {$scope.encuesta.pregunta7.tres = 0;};
		// if ($scope.encuesta.pregunta7.cuatro == undefined || $scope.encuesta.pregunta7.uno == false) {$scope.encuesta.pregunta7.cuatro = 0;};
		// if ($scope.encuesta.pregunta7.cinco == undefined || $scope.encuesta.pregunta7.uno == false) {$scope.encuesta.pregunta7.cinco = 0;};

		$scope.encuesta.pregunta7.uno = ($scope.encuesta.pregunta7.uno == undefined || $scope.encuesta.pregunta7.uno == false) ? 0 : 1;
		$scope.encuesta.pregunta7.dos = ($scope.encuesta.pregunta7.dos == undefined || $scope.encuesta.pregunta7.dos == false) ? 0 : 1;
		$scope.encuesta.pregunta7.tres = ($scope.encuesta.pregunta7.tres == undefined || $scope.encuesta.pregunta7.tres == false) ? 0 : 1;
		$scope.encuesta.pregunta7.cuatro = ($scope.encuesta.pregunta7.cuatro == undefined || $scope.encuesta.pregunta7.cuatro == false) ? 0 : 1;
		$scope.encuesta.pregunta7.cinco = ($scope.encuesta.pregunta7.cinco == undefined || $scope.encuesta.pregunta7.cinco == false) ? 0 : 1;

		console.info("Lo que se va a enviar", $scope.encuesta);


		ws.post('encuestas', JSON.stringify($scope.encuesta))
        //$http.post("http://localhost/TPlaboratorioIV2016/ws/ofertas/"+JSON.stringify($scope.nuevo))
		.then(function(data){
			console.info("Datos: ", data);
			alert("Gracias por responder la encuesta");
			// for (var campo in $scope.encuesta) {
			//     $scope.encuesta[campo] = "";
			// }
		}, function(error){
			console.info("Error: ", error);
		});

		$('#encuesta').modal('hide');
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();

		$state.reload();
		return;
	}
});