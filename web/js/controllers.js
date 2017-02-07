angular.module('starter.controllers', [])

.controller('menuCtrl', function($scope, $auth){
	$scope.usuario = {};
	$scope.usuario = JSON.parse(JSON.stringify($auth.getPayload()));
	console.info("usuario", $scope.usuario)
})

.controller('mainCtrl', function($scope, $auth){
	$scope.usuario = {};
	$scope.usuario = JSON.parse(JSON.stringify($auth.getPayload()));
	console.info("usuario main", $scope.usuario);
})

.controller('altaUsuarioCtrl', function($scope, $auth, $http, $stateParams, $state){
	//Recupero datos de la sesión
	$scope.usuario = {};
	$scope.usuario = JSON.parse(JSON.stringify($auth.getPayload()));
	console.info("usuario", $scope.usuario);
	console.info("$stateParams",$stateParams);
	$scope.encargado = {};
	$scope.encargado.encargado = $stateParams.encargado;
	
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
			};
			
			if ($scope.encargado.encargado){
				$state.go("main.grillaUsuarios", {encargado: true});
			}
			else{
				$state.go("main.grillaUsuarios");
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

.controller('altaPedidoCtrl', function($scope, $auth, $http, FileUploader, uiGridConstants){
	$scope.nuevo = {};
	$scope.nuevo.id_usuario = $auth.getPayload().id;
	$scope.nuevo.importe = 0;

	$scope.gridOptions = {
		enableRowSelection: true,
    	//enableFullRowSelection: true,
    	//multiSelect: true
	};

	$scope.gridOptions.onRegisterApi = function(gridApi) {
	    $scope.myGridApi = gridApi;
		$scope.myGridApi.selection.on.rowSelectionChanged($scope, function (row) {
		    if (row.isSelected){
		    	row.entity.cantidad = 1;
		    }
		    else{
		    	row.entity.cantidad = null;
		    }
		    if (!this.grid.appScope.buttonClicked) {
		        //alert(row.isSelected);
		    }
		    this.grid.appScope.buttonClicked = false;
		});
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
            { field: 'precio', width: '80', name: 'precio', cellFilter: 'currency'},
            { field: 'cantidad', name: 'cantidad', width: '80', displayName: 'Cantidad', cellTemplate:"<input type='number' min=1 ng-model='row.entity.cantidad' ng-click='grid.appScope.Modificar(row.entity)'></input>"},
            { field: 'imagen', name: 'imagen', displayName: 'Imagen', cellTemplate:'<img width="50px" ng-src="../ws/img/{{row.entity.foto1}}" lazy-src>' }
        ];
    }

    $scope.Modificar = function(row){
      console.info(row);
      $scope.myGridApi.selection.getSelectedRows();
      console.info("$scope.myGridApi.selection.getSelectedRows()",$scope.myGridApi.selection.getSelectedRows());
      //var dato=JSON.stringify(row);
      //$state.go('main.altaUsuario', {obj:row});
      var f = new Date();
	  console.info(f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear());
	  console.info(f);
    }

    $scope.Guardar = function(){
        $scope.nuevo.fecha =  new Date();
        $scope.nuevo.id_local =  1;
        console.info("Id usuario: ",$scope.nuevo.id_usuario);
        console.info("Fecha: ",$scope.nuevo.fecha);
        console.info("Productos: ",$scope.myGridApi.selection.getSelectedRows());

        $scope.nuevo.productos = [];
        var arrayAux = $scope.myGridApi.selection.getSelectedRows();
        for (var producto in arrayAux) {
			//$scope.nuevo.productos.push(arrayAux[producto]);
			$scope.nuevo.productos[producto] = {};
			$scope.nuevo.productos[producto].id = arrayAux[producto].id;
			$scope.nuevo.productos[producto].cantidad = arrayAux[producto].cantidad;
			console.info("prod: ",$scope.nuevo.productos);
			$scope.nuevo.importe += parseInt(arrayAux[producto].precio)*parseInt(arrayAux[producto].cantidad);
		}

		if($scope.nuevo.productos.length == 0){
			alert("Por favor, selecciona al menos un producto");
			return;
		}

		console.info("LO QUE SE VA A MANDAR POR POST:",$scope.nuevo);

        $http.post("http://localhost/TPlaboratorioIV2016/ws/pedidos/"+JSON.stringify($scope.nuevo))
		.then(function(data){
			console.info("Datos: ", data);
			alert("Alta realizada con éxito");
			for (var campo in $scope.nuevo.productos) {
			    $scope.nuevo.productos[campo] = null;
			}
			$scope.nuevo.importe = 0;
			console.info("Datos borrados: ", $scope.nuevo);
			//$scope.myGridApi.selection.clearSelectedRows();
		}, function(error){
			console.info("Error: ", error);
		});
    }
})

.controller('grillaUsuariosCtrl', function($scope, $auth, $http, uiGridConstants, i18nService, $state, $stateParams){

	console.info("$stateParams",$stateParams);
	if ($stateParams.encargado) {
		$scope.titulo = "Empleados";
	}
	else{
		$scope.titulo = "Usuarios";
	}

	$scope.gridOptions = {};

	$http.get("http://localhost/TPlaboratorioIV2016/ws/usuarios")
	.then(function(data){
		console.info("data.data", data.data);

		if ($stateParams.encargado) {
			for(var usuario in data.data.usuarios){
				if (data.data.usuarios[usuario].perfil = "Empleado") {
					$scope.gridOptions.data.push(data.data.usuarios[usuario]);
				}
			}
		}
		else{
			$scope.gridOptions.data = data.data.usuarios
		}
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
      if ($stateParams.encargado) {
      	  $state.go('main.altaUsuario', {obj:row, encargado: true});
      }
      else{
      	  $state.go('main.altaUsuario', {obj:row});
      }
      
    }
})

.controller('grillaPedidosCtrl', function($scope, $auth, $http, uiGridConstants, i18nService, $state, $stateParams){

	$scope.gridOptions = {};

	$( "#estadoPedido" ).on( "change", function() {
	  console.log( $( this ).text() );
	});

	$http.get("http://localhost/TPlaboratorioIV2016/ws/pedidos")
	.then(function(data){
		console.info("data.data", data.data);

		if ($stateParams.encargado) {
			for(var pedido in data.data.pedidos){
				if (data.data.pedidos[pedido].perfil = "Empleado") {
					$scope.gridOptions.data.push(data.data.pedidos[pedido]);
				}
			}
		}
		else{
			$scope.gridOptions.data = data.data.pedidos
		}
		console.info("$scope.gridOptions.data",$scope.gridOptions.data);
	}, function(error){
		console.info("Error: ", error);
	});

	$scope.gridOptions.columnDefs = columUsuarios();
	function columUsuarios () {
        return [
            { field: 'id', name: 'Nº Pedido', width: '90'},
            { field: 'usuario', name: 'Cliente', cellTemplate:"<span>&nbsp;{{row.entity.usuario.apellido}}, {{row.entity.usuario.nombre}}</span>"},
            { field: 'fecha', name: 'fecha', width: '150', cellFilter:'date:\'dd/MM/yyyy - HH:mm\''},
            { field: 'importe', name: 'importe', width: '90', cellFilter:'currency'},
            { field: 'estado', name: 'estado', width: '90'},
            { field: 'nuevoEstado', width: '140', name: 'Nuevo Estado', cellTemplate:"<select ng-model='row.entity.nuevoEstado'><option disabled selected value> -- nuevo estado -- </option><option value='Pedido'>Pedido</option><option value='Entregado'>Entregado</option><option value='Cancelado'>Cancelado</option></select>"},
            { field: 'Boton', width: '90', displayName: 'Boton', cellTemplate:"<button class='btn btn-info btn-block btn-sm' ng-click='grid.appScope.Modificar(row.entity)'>MODIFICAR</button>"}
        ];
    }
    $scope.Modificar = function(row){
      console.info("row",row);
      $http.put("http://localhost/TPlaboratorioIV2016/ws/pedidos/"+JSON.stringify(row))
      .then(function(data){
		console.info("data.data", data.data);
		$state.reload();
		console.info("$scope.gridOptions.data",$scope.gridOptions.data);
	}, function(error){
		console.info("Error: ", error);
	});
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