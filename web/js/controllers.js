angular.module('starter.controllers', [])

.controller('menuCtrl', function($scope, $auth){
	$scope.usuario = {};
	$scope.usuario = JSON.parse(JSON.stringify($auth.getPayload()));
	console.info("usuario", $scope.usuario)
})

.controller('altaUsuarioCtrl', function($scope, $auth, $http){
	//Recupero datos de la sesión
	$scope.usuario = {};
	$scope.usuario = JSON.parse(JSON.stringify($auth.getPayload()));
	console.info("usuario", $scope.usuario);

	//Objeto para el nuevo usuario
	$scope.nuevo = {}
	$scope.nuevo.nombre = "Prueba";
	$scope.nuevo.apellido = "Test";
	$scope.nuevo.email = "@prueba.com";
	$scope.nuevo.sexo = "M";
	$scope.nuevo.password = "1234";
	$scope.nuevo.confirmarClave = "1234";

	//Guardar el usuario en la base de datos
	$scope.Guardar = function(){
		$http.post("http://localhost/TPlaboratorioIV2016/ws/usuarios/"+JSON.stringify($scope.nuevo))
		.then(function(data){
			console.info("Datos: ", data);
			alert("Alta realizada con éxito");
			for (var campo in $scope.nuevo) {
			    $scope.nuevo[campo] = "";
			}
		}, function(error){
			console.info("Error: ", error);
		});
	}
})

.controller('altaLocalCtrl', function($scope, $auth, $http, FileUploader){
	//Recupero datos de la sesión
	$scope.usuario = {};
	$scope.usuario = JSON.parse(JSON.stringify($auth.getPayload()));
	console.info("usuario", $scope.usuario);

	//Objeto para el nuevo local
	$scope.nuevo = {}
	$scope.nuevo.direccion = "Prueba 123";
	$scope.nuevo.foto1 = "sinfoto.jpg";
	$scope.nuevo.foto2 = "sinfoto.jpg";
	$scope.nuevo.foto3 = "sinfoto.jpg";

	//Configuración del FileUploader
	//$scope.uploader = new FileUploader({url: '../ws/clases/upload.php'});
	$scope.uploader = new FileUploader({url: 'http://localhost/TPlaboratorioIV2016/ws/files'});
	console.info("Uploader", $scope.uploader);
	$scope.uploader.queueLimit = 3; // indico cuantos archivos permito cargar
	/* Si quiero restringir los archivos a imagenes añado este filtro */
	$scope.uploader.filters.push({
        name: 'imageFilter',
        fn: function(item, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });
    $scope.cargar = function(){
    	/** llamo a la funcion uploadAll para cargar toda la cola de archivos **/
    	$scope.uploader.uploadAll();
    	/** agrego mi funcionalidad **/
	}
	$scope.uploader.onCompleteAll = function() {
	    console.info('Se cargó con éxito');
    };
    $scope.uploader.onAfterAddingFile = function(item) {
	    console.info('Cambio',$scope.uploader);
	    console.info('Cambio item',item);
    };

    //Guardar el local en la base de datos
	$scope.Guardar = function(){
		//Guardo las fotos en el servidor
		$scope.cargar();
		
		//Le paso el nombre de las fotos a los campos del local
		if($scope.uploader.queue.length == 1){
			$scope.nuevo.foto1 = $scope.uploader.queue[0].file.name;
		}
		else if($scope.uploader.queue.length == 2){
			$scope.nuevo.foto1 = $scope.uploader.queue[0].file.name;
			$scope.nuevo.foto2 = $scope.uploader.queue[1].file.name;
		}
		else if($scope.uploader.queue.length == 3){
			$scope.nuevo.foto1 = $scope.uploader.queue[0].file.name;
			$scope.nuevo.foto2 = $scope.uploader.queue[1].file.name;
			$scope.nuevo.foto3 = $scope.uploader.queue[2].file.name;
		}		
		console.info("Local",$scope.nuevo);

		$http.post("http://localhost/TPlaboratorioIV2016/ws/locales/"+JSON.stringify($scope.nuevo))
		.then(function(data){
			console.info("Datos: ", data);
			alert("Alta realizada con éxito");
			for (var campo in $scope.nuevo) {
			    $scope.nuevo[campo] = "";
			}
			$scope.nuevo.foto1 = "sinfoto.jpg";
			$scope.nuevo.foto2 = "sinfoto.jpg";
			$scope.nuevo.foto3 = "sinfoto.jpg";
			$scope.uploader.clearQueue();
			console.info('Queue vacía',$scope.uploader.queue);
		}, function(error){
			console.info("Error: ", error);
		});
	}
});