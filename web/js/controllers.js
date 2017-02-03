angular.module('starter.controllers', [])

.controller('menuCtrl', function($scope, $auth){
	$scope.usuario = {};
	$scope.usuario = JSON.parse(JSON.stringify($auth.getPayload()));
	console.info("usuario", $scope.usuario)
})

.controller('altaUsuarioCtrl', function($scope, $auth, $http, $stateParams, $state){
	//Recupero datos de la sesión
	$scope.usuario = {};
	$scope.usuario = JSON.parse(JSON.stringify($auth.getPayload()));
	console.info("usuario", $scope.usuario);
	console.info("$stateParams",$stateParams);
	
	//Objeto para el nuevo usuario
	$scope.nuevo = {}
	if($stateParams.obj == null){
		$scope.estado = "alta";
		$scope.nuevo.nombre = "Prueba";
		$scope.nuevo.apellido = "Test";
		$scope.nuevo.email = "@prueba.com";
		$scope.nuevo.sexo = "Masculino";
		$scope.nuevo.password = "1234";
		$scope.nuevo.confirmarClave = "1234";	
	}
	else
	{
		$scope.estado = "modificacion";
		$scope.nuevo = $stateParams;
		console.info("$stateParams",$stateParams.obj);
		$scope.nuevo.id = $stateParams.obj.id;
		$scope.nuevo.nombre = $stateParams.obj.nombre;
		$scope.nuevo.apellido = $stateParams.obj.apellido;
		$scope.nuevo.email = $stateParams.obj.email;
		/*if ($stateParams.obj.sexo == "Masculino"){
			$scope.nuevo.sexo = "M";
		}
		else{
			$scope.nuevo.sexo = "F";
		}*/
		$scope.nuevo.sexo = $stateParams.obj.sexo;
		$scope.nuevo.perfil = $stateParams.obj.perfil;
	}


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

	//Modificar el usuario en la base de datos
	$scope.Modificar = function(){
		$http.put("http://localhost/TPlaboratorioIV2016/ws/usuarios/"+JSON.stringify($scope.nuevo))
		.then(function(data){
			console.info("Datos: ", data);
			alert("Modificación realizada con éxito");
			for (var campo in $scope.nuevo) {
			    $scope.nuevo[campo] = "";
			}
			$state.go("main.grillaUsuarios");
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
})

.controller('altaProductoCtrl', function($scope, $auth, $http, FileUploader){
	//Recupero datos de la sesión
	$scope.usuario = {};
	$scope.usuario = JSON.parse(JSON.stringify($auth.getPayload()));
	console.info("usuario", $scope.usuario);

	//Objeto para el nuevo producto
	$scope.nuevo = {}
	$scope.nuevo.precio = 60;
	$scope.nuevo.descripcion = "Pizza grande de muzzarella";
	$scope.nuevo.categoria = "Comida";
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

    //Guardar el producto en la base de datos
	$scope.Guardar = function(){
		//Guardo las fotos en el servidor
		$scope.cargar();
		
		//Le paso el nombre de las fotos a los campos del producto
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
		console.info("Producto",$scope.nuevo);

		$http.post("http://localhost/TPlaboratorioIV2016/ws/productos/"+JSON.stringify($scope.nuevo))
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
})

.controller('altaOfertaCtrl', function($scope, $auth, $http, FileUploader, uiGridConstants){
	$scope.gridOptions = {
		enableRowSelection: true,
    	//enableFullRowSelection: true,
    	multiSelect: true
	};

	$scope.gridOptions.onRegisterApi = function(gridApi) {
	   $scope.myGridApi = gridApi;
	};

	$http.get("http://localhost/TPlaboratorioIV2016/ws/productos")
	.then(function(data){
		console.info(data.data);
		$scope.gridOptions.data = data.data.productos
		console.info("$scope.gridOptions.data",$scope.gridOptions.data);
		console.info("$scope.gridOptions",$scope.gridOptions);
	}, function(error){
		console.info("Error: ", error);
	});


	$scope.gridOptions.columnDefs = columProductos();
	function columProductos () {
        return [
            { field: 'descripcion', name: 'descripcion'},
            { field: 'precio', name: 'precio'},
            { field: 'cantidad', name: 'cantidad', width: '90', displayName: 'Cantidad', cellTemplate:"<input type='text' ng-model='row.entity.cantidad' ng-click='grid.appScope.Modificar(row.entity)'></input>"}
        ];
    }

    $scope.Modificar = function(row){
      console.info(row);
      $scope.myGridApi.selection.getSelectedRows();
      console.info("$scope.myGridApi.selection.getSelectedRows()",$scope.myGridApi.selection.getSelectedRows());
      //var dato=JSON.stringify(row);
      //$state.go('main.altaUsuario', {obj:row});
    }

    $scope.Guardar = function(){
        console.info("Descripción: ",$scope.nuevo.descripcion);
        console.info("Porcentaje: ",$scope.nuevo.descuento);
        console.info("Productos: ",$scope.myGridApi.selection.getSelectedRows());

        $scope.nuevo.productos = [];
        var arrayAux = $scope.myGridApi.selection.getSelectedRows();
        for (var producto in arrayAux) {
			//$scope.nuevo.productos.push(arrayAux[producto]);
			$scope.nuevo.productos[producto] = {};
			$scope.nuevo.productos[producto].id = arrayAux[producto].id;
			$scope.nuevo.productos[producto].cantidad = arrayAux[producto].cantidad;
			console.info("prod: ",$scope.nuevo.productos);
		}

		console.info("LO QUE SE VA A MANDAR POR POST:",$scope.nuevo);

        $http.post("http://localhost/TPlaboratorioIV2016/ws/ofertas/"+JSON.stringify($scope.nuevo))
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

.controller('grillaUsuariosCtrl', function($scope, $auth, $http, uiGridConstants, i18nService, $state){

	$scope.gridOptions = {};

	$http.get("http://localhost/TPlaboratorioIV2016/ws/usuarios")
	.then(function(data){
		console.info(data.data);
		$scope.gridOptions.data = data.data.usuarios
		console.info("$scope.gridOptions.data",$scope.gridOptions.data);
	}, function(error){
		console.info("Error: ", error);
	});

	$scope.gridOptions.columnDefs = columUsuarios();
	function columUsuarios () {
        return [
            { field: 'nombre', name: 'nombre'},
            { field: 'apellido', name: 'apellido'},
            { field: 'email', name: 'email'},
            { field: 'perfil', name: 'perfil'},
            { field: 'Boton', width: '90', displayName: 'Boton', cellTemplate:"<button class='btn btn-info btn-block btn-sm' ng-click='grid.appScope.Modificar(row.entity)'>MODIFICAR</button>"}
        ];
    }
    $scope.Modificar = function(row){
      console.info(row);
      //var dato=JSON.stringify(row);
      $state.go('main.altaUsuario', {obj:row});
    }
})

.controller('grillaLocalesCtrl',function($scope, $http){

	$scope.locales = {};

	$http.get("http://localhost/TPlaboratorioIV2016/ws/locales")
	.then(function(data){
		console.info(data.data);
		$scope.locales = data.data.locales;
		console.info($scope.locales);

		for (var local in $scope.locales) {
			    $scope.locales[local].foto1 = "http://localhost/TPlaboratorioIV2016/ws/img/"+$scope.locales[local].foto1;
			    $scope.locales[local].foto2 = "http://localhost/TPlaboratorioIV2016/ws/img/"+$scope.locales[local].foto2;
			    $scope.locales[local].foto3 = "http://localhost/TPlaboratorioIV2016/ws/img/"+$scope.locales[local].foto3;
			    $scope.locales[local].arrayImg = [$scope.locales[local].foto1, $scope.locales[local].foto2, $scope.locales[local].foto3];
		}

		console.info($scope.locales);

	}, function(error){
		console.info("Error: ", error);
	});

    
});