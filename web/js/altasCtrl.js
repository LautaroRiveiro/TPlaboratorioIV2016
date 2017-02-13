angular.module('altas.controllers', [])

.controller('altaUsuarioCtrl', function($scope, $auth, $http, $stateParams, $state, usuario, ws){
	usuario.VerificarLogueado();
	usuario.VerificarPerfil('Empleado');

	$scope.nuevo = {}
	
	//Recupero datos de la sesión
	$scope.usuario = usuario.Datos();
	console.info("$scope.usuario",$scope.usuario);
	if ($scope.usuario.perfil == "Empleado"){
		$scope.nuevo.perfil = "Cliente";
		$("#perfilazo").prop('disabled', 'disabled');
	}
	else if($scope.usuario.perfil == "Encargado"){
		$("#perfilazo option[value='Encargado']").remove();
	}

	//$scope.usuario = JSON.parse(JSON.stringify($auth.getPayload()));
	//console.info("usuario", $scope.usuario);
	console.info("$stateParams",$stateParams);
	$scope.encargado = {};
	$scope.encargado.encargado = $stateParams.encargado;

	//Objeto para el nuevo usuario
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

		if($scope.usuario.perfil == "Encargado"){
			$("#perfilazo").prop('disabled', 'disabled');
		}
	}

	//Guardar el usuario en la base de datos
	$scope.Guardar = function(){
		ws.post('usuarios',JSON.stringify($scope.nuevo))
		//$http.post("http://localhost/TPlaboratorioIV2016/ws/usuarios/"+JSON.stringify($scope.nuevo))
		.then(function(data){
			console.info("Datos: ", data);
			alert("Alta realizada con éxito");
			for (var campo in $scope.nuevo) {
			    $scope.nuevo[campo] = "";
			}
			$scope.formAlta.$pristine = true;
		}, function(error){
			console.info("Error: ", error);
		});
	}

	//Modificar el usuario en la base de datos
	$scope.Modificar = function(){
		ws.put('usuarios',JSON.stringify($scope.nuevo))
		//$http.put("http://localhost/TPlaboratorioIV2016/ws/usuarios/"+JSON.stringify($scope.nuevo))
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

.controller('altaLocalCtrl', function($scope, $auth, $http, FileUploader, usuario, ws, $state){
	usuario.VerificarLogueado();
	usuario.VerificarPerfil('Administrador');
	
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
	$scope.gMap = {};
	$scope.coordenadas = {};

	//gLatLon = ACA VA LA DECODIFICACION DEL LUGAR
	$scope.VerLugar = function(){

		var divMapa = document.getElementById('map');
		var coordenadas = {};

		var gCoder = new google.maps.Geocoder();
		var objInfo = {
			address: $scope.nuevo.direccion
		};
		gCoder.geocode(objInfo, fn_coder);

		function fn_coder(datos){
			console.info("DATOS", datos);
			if (datos.length == 0) {
				divMapa.innerHTML = "NO SE ENCONTRÓ LA DIRECCIÓN INDICADA";
				$scope.nuevo.direccion = "";
				return;
			}
			$scope.coordenadas = datos[0].geometry.location;

			$scope.nuevo.direccion = datos[0].address_components[1].short_name + " " + datos[0].address_components[0].long_name;
			$scope.nuevo.cp = datos[0].address_components[2].short_name;

			var objConf = {
					zoom: 15,
					center: $scope.coordenadas
				};
			$scope.gMap = new google.maps.Map(divMapa, objConf);

			var objConfMarker = {
				position: $scope.coordenadas,
				map: $scope.gMap,
				title: "Ubicación de la nueva sucursal"
			}

			var gMarker = new google.maps.Marker(objConfMarker);
		}
	}


	//Configuración del FileUploader
	//$scope.uploader = new FileUploader({url: '../ws/clases/upload.php'});
	//$scope.uploader = new FileUploader({url: 'http://localhost/TPlaboratorioIV2016/ws/files'});
	$scope.uploader = new FileUploader({url: ws.url+'files'});
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

	$scope.uploader.onCompleteAll = function() {
	    console.info('Se cargó con éxito');
    };
    $scope.uploader.onAfterAddingFile = function(item) {
	    console.info('Cambio',$scope.uploader);
	    console.info('Cambio item',item);
    };


    //Guardar el local en la base de datos
	$scope.Guardar = function(){
		if($scope.nuevo.direccion == ""){
			alert("Debe indicar una dirección");
			return;
		}
		if($scope.nuevo.cp == "" || $scope.nuevo.cp == undefined){
			alert("Presionar botón para verificar domicilio");
			return;
		}

		//Guardo las fotos en el servidor
    	/** llamo a la funcion uploadAll para cargar toda la cola de archivos **/
		ws.getAll('localID').then(function(data){
			console.info("Próximo ID a insertar:", data.data.proximoID[0]);
			var proximoID = data.data.proximoID[0];
			for (var i = $scope.uploader.queue.length - 1; i >= 0; i--) {
				$scope.uploader.queue[i].file.name = "local" + proximoID + "f" + (parseInt(i)+1) + ".jpg";
			}
			console.info("$scope.uploader.queue", $scope.uploader);
			$scope.uploader.uploadAll();
			$scope.cargar();
		})
	};
    $scope.cargar = function(){

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

		ws.post('locales', JSON.stringify($scope.nuevo))
		//$http.post("http://localhost/TPlaboratorioIV2016/ws/locales/"+JSON.stringify($scope.nuevo))
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
			$scope.formAlta.$pristine = true;
			$state.reload();
		}, function(error){
			console.info("Error: ", error);
		});
	};
})

.controller('altaProductoCtrl', function($scope, $auth, $http, $state, FileUploader, usuario, ws){
	usuario.VerificarLogueado();
	usuario.VerificarPerfil('Empleado');

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
	//$scope.uploader = new FileUploader({url: 'http://localhost/TPlaboratorioIV2016/ws/files'});
	$scope.uploader = new FileUploader({url: ws.url + 'files'});
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
    	/** llamo a la funcion uploadAll para cargar toda la cola de archivos **/
		ws.getAll('productoID').then(function(data){
			console.info("Próximo ID a insertar:", data.data.proximoID[0]);
			var proximoID = data.data.proximoID[0];
			for (var i = $scope.uploader.queue.length - 1; i >= 0; i--) {
				$scope.uploader.queue[i].file.name = "producto" + proximoID + "f" + (parseInt(i)+1) + ".jpg";
			}
			console.info("$scope.uploader.queue", $scope.uploader);
			$scope.uploader.uploadAll();
			$scope.cargar();
		})
	};

	$scope.cargar = function(){

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

		ws.post('productos',JSON.stringify($scope.nuevo))
		//$http.post("http://localhost/TPlaboratorioIV2016/ws/productos/"+JSON.stringify($scope.nuevo))
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
			$scope.formAlta.$pristine = true;
			$state.reload();
		}, function(error){
			console.info("Error: ", error);
		});
	}
})

.controller('altaOfertaCtrl', function($scope, $auth, $http, FileUploader, uiGridConstants, i18nService, usuario, ws){
	usuario.VerificarLogueado();
	usuario.VerificarPerfil('Empleado');

	$scope.gridOptions = {
		enableRowSelection: true,
    	//enableFullRowSelection: true,
    	multiSelect: true,
    	//Configuracion de Paginación
		paginationPageSizes: [10, 20, 30],
		paginationPageSize: 10,
		minRowsToShow: 10
	};

	//Idioma de la grilla en Español
	i18nService.setCurrentLang('es');

	$scope.gridOptions.onRegisterApi = function(gridApi) {
	    $scope.myGridApi = gridApi;
		$scope.myGridApi.selection.on.rowSelectionChanged($scope, function (row) {
		    if (row.isSelected){
		    	if (row.entity.cantidad == undefined || row.entity.cantidad == null){
		    		row.entity.cantidad = 1;
		    	}
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

	ws.getAll('productos')
	//$http.get("http://localhost/TPlaboratorioIV2016/ws/productos")
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
            { field: 'precio', name: 'precio',  width: '90', cellFilter: 'currency'},
            { field: 'cantidad', name: 'cantidad', width: '90', displayName: 'Cantidad', cellTemplate:"<input type='number' max=99 style='height:100%;' ng-model='row.entity.cantidad' ng-click='grid.appScope.Modificar(row.entity)'></input>"}
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

		ws.post('ofertas', JSON.stringify($scope.nuevo))
        //$http.post("http://localhost/TPlaboratorioIV2016/ws/ofertas/"+JSON.stringify($scope.nuevo))
		.then(function(data){
			console.info("Datos: ", data);
			alert("Alta realizada con éxito");
			for (var campo in $scope.nuevo) {
			    $scope.nuevo[campo] = "";
			}
			$scope.formAlta.$pristine = true;
		}, function(error){
			console.info("Error: ", error);
		});
    }
})

.controller('altaPedidoCtrl', function($scope, $auth, $http, FileUploader, uiGridConstants, i18nService, $stateParams, usuario, ws){
	usuario.VerificarLogueado();

	$scope.perfil = $stateParams.perfil;
	//console.info("$scope.perfil",$scope.perfil);

	$scope.nuevo = {};
	$scope.nuevo.id_usuario = $auth.getPayload().id;
	$scope.nuevo.importe = 0;

 //----------------------------- GRILLA PRODUCTOS ------------------------------------------//

 	ws.getAll('productos')
	//$http.get("http://localhost/TPlaboratorioIV2016/ws/productos")
	.then(function(data){
		console.info(data.data);
		$scope.gridOptions.data = data.data.productos
		console.info("$scope.gridOptions.data",$scope.gridOptions.data);
		console.info("$scope.gridOptions",$scope.gridOptions);
	}, function(error){
		console.info("Error: ", error);
	});

	$scope.gridOptions = {
		enableRowSelection: true,
    	//enableFullRowSelection: true,
    	//multiSelect: true
    	//rowHeight: 50
    	enableHorizontalScrollbar: 0,
    	enableVerticalScrollbar: 0,

    	//Configuracion de Paginación
		paginationPageSizes: [10, 20, 30],
		paginationPageSize: 10,
		minRowsToShow: 10
	};

	//Idioma de la grilla en Español
	i18nService.setCurrentLang('es');

	$scope.gridOptions.onRegisterApi = function(gridApi) {
	    $scope.myGridApi = gridApi;
		$scope.myGridApi.selection.on.rowSelectionChanged($scope, function (row) {
		    if (row.isSelected){
		    	if (row.entity.cantidad == undefined || row.entity.cantidad == null){
		    		row.entity.cantidad = 1;
		    	}
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

	$scope.gridOptions.columnDefs = columProductos();
	function columProductos () {
        return [
            { field: 'descripcion', name: 'descripcion'},
            { field: 'precio', width: '80', name: 'precio', cellFilter: 'currency'},
            { field: 'cantidad', name: 'cantidad', width: '80', displayName: 'Cantidad', cellTemplate:"<input type='number' style='height:100%;' min=1 ng-model='row.entity.cantidad' ng-click='grid.appScope.Modificar(row.entity)'></input>"},
            //{ field: 'imagen', name: 'imagen', displayName: 'Imagen', cellTemplate:'<img width="50px" ng-src="../ws/img/{{row.entity.foto1}}" lazy-src>' },
            //{ field: 'foto1', name: 'avatar', cellTemplate:"<img width=\"30px\" ng-src=\"../ws/img/{{grid.getCellValue(row, col)}}\" lazy-src>"},
        	//{ field: 'foto1', name: 'Foto', cellTemplate:"<img height='100%' width='100%' ng-src=\"../ws/img/{{grid.getCellValue(row, col)}}\" lazy-src>"},
            { field: 'Boton', width: '90', displayName: 'Detalle', cellTemplate:"<button href='#detalle' data-toggle='modal' class='btn btn-info btn-block btn-sm' ng-click='grid.appScope.Detalle(row.entity)'>VER</button>"}
        ];
    }

 //----------------------------- GRILLA OFERTAS ------------------------------------------//

 	ws.getAll('ofertas')
	//$http.get("http://localhost/TPlaboratorioIV2016/ws/ofertas")
	.then(function(data){
		$scope.gridOptionsOfertas.data = data.data.ofertas
		
		var precioFinalBruto = 0;
		var precioFinal = 0;

		for (var i in $scope.gridOptionsOfertas.data) {
			precioFinalBruto = 0;
			for(var j in $scope.gridOptionsOfertas.data[i].productos) {
				precioFinalBruto += parseInt($scope.gridOptionsOfertas.data[i].productos[j].cantidad) * parseInt($scope.gridOptionsOfertas.data[i].productos[j].productoDetalle.precio);
			}
			precioFinal = parseInt(precioFinalBruto) - (parseInt(data.data.ofertas[i].descuento) * parseInt(precioFinalBruto) / 100);
			$scope.gridOptionsOfertas.data[i].importe = Math.floor(precioFinal);
		}

		console.info("$scope.gridOptionsOfertas.data",$scope.gridOptionsOfertas.data);

	}, function(error){
		console.info("Error: ", error);
	});

	$scope.gridOptionsOfertas = {
		enableRowSelection: true,
    	//enableFullRowSelection: true,
    	//multiSelect: true
    	//rowHeight: 50
    	enableHorizontalScrollbar: 0,
    	enableVerticalScrollbar: 0,

    	//Configuracion de Paginación
		paginationPageSizes: [5, 10, 15],
		paginationPageSize: 5,
		minRowsToShow: 5
	};

	$scope.gridOptionsOfertas.onRegisterApi = function(gridApi) {
	    $scope.myGridApiOfertas = gridApi;
		$scope.myGridApiOfertas.selection.on.rowSelectionChanged($scope, function (row) {
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


	$scope.gridOptionsOfertas.columnDefs = columProductosOfertas();
	function columProductosOfertas () {
        return [
            { field: 'descripcion', name: 'descripcion'},
            { field: 'descuento', width: '100', name: 'desc (%)'},
            { field: 'importe', width: '80', name: 'importe', cellFilter: 'currency'},
            { field: 'cantidad', name: 'cantidad', width: '80', displayName: 'Cantidad', cellTemplate:"<input type='number' style='height:100%;' min=1 ng-model='row.entity.cantidad' ng-click='grid.appScope.Modificar(row.entity)'></input>"},
            //{ field: 'imagen', name: 'imagen', displayName: 'Imagen', cellTemplate:'<img width="50px" ng-src="../ws/img/{{row.entity.foto1}}" lazy-src>' },
            //{ field: 'foto1', name: 'avatar', cellTemplate:"<img width=\"30px\" ng-src=\"../ws/img/{{grid.getCellValue(row, col)}}\" lazy-src>"},
        	//{ field: 'foto1', name: 'Foto', cellTemplate:"<img height='100%' width='100%' ng-src=\"../ws/img/{{grid.getCellValue(row, col)}}\" lazy-src>"},
            { field: 'Boton', width: '90', displayName: 'Detalle', cellTemplate:"<button href='#detalleOferta' data-toggle='modal' class='btn btn-info btn-block btn-sm' ng-click='grid.appScope.DetalleOferta(row.entity)'>VER</button>"}
        ];
    }

 //----------------------------- LOCALES RADIO ------------------------------------------//

	$scope.locales = {};
	ws.getAll('locales')
	.then(
		function(data){
			console.info("data.data", data.data);
			$scope.locales.locales = data.data.locales;
		}
		,function(error){
			console.info("Error: ", error);
	});

 //-------------------------------- FUNCIONES -------------------------------------------//

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

    $scope.Detalle = function(row){
		$scope.detalle = row;
		console.info("$scope.detalle",$scope.detalle);
		//$('.carousel').carousel('stop');
		$('.carousel').carousel({
			interval: 2000
		});
    }

    $scope.DetalleOferta = function(row){
		$scope.detalleOferta = row;
		console.info("$scope.detalleOferta",$scope.detalleOferta);
    }

    //Evento para que al cerrar la ventana modal de la encuesta, aparezca un botón para continuarla
	$('#encuesta').on('hidden.bs.modal', function (e) {
	  $("#continuar").show();
	})


    $scope.Guardar = function(){
        $scope.nuevo.fecha =  new Date();
        $scope.nuevo.estado =  "Pedido";
        
        if ($scope.nuevo.id_local == undefined) {
			alert("Por favor, selecciona un local");
			return;
        }

        console.info("Id usuario: ",$scope.nuevo.id_usuario);
        console.info("Fecha: ",$scope.nuevo.fecha);
        console.info("Productos: ",$scope.myGridApi.selection.getSelectedRows());

        $scope.nuevo.productos = [];
        $scope.nuevo.ofertas = [];
        var arrayAux = $scope.myGridApi.selection.getSelectedRows();
        for (var producto in arrayAux) {
			//$scope.nuevo.productos.push(arrayAux[producto]);
			$scope.nuevo.productos[producto] = {};
			$scope.nuevo.productos[producto].id = arrayAux[producto].id;
			$scope.nuevo.productos[producto].cantidad = arrayAux[producto].cantidad;
			$scope.nuevo.productos[producto].id_oferta = 0;
			$scope.nuevo.productos[producto].precio = arrayAux[producto].precio;
			
			console.info("prod: ",$scope.nuevo.productos);
			$scope.nuevo.importe += parseInt(arrayAux[producto].precio)*parseInt(arrayAux[producto].cantidad);
		}

        var arrayAuxOferta = $scope.myGridApiOfertas.selection.getSelectedRows();
        var indice = $scope.nuevo.productos.length;
        for (var oferta in arrayAuxOferta) {
			

        	$scope.nuevo.ofertas[oferta] = {};
			$scope.nuevo.ofertas[oferta].id = arrayAuxOferta[oferta].id;	//Id de la oferta
			$scope.nuevo.ofertas[oferta].cantidad = arrayAuxOferta[oferta].cantidad;	//Cantidad

			// for (var i = Things.length - 1; i >= 0; i--) {
			// 	Things[i]
			// }

			// $scope.nuevo.productos[indice] = {};
			// $scope.nuevo.productos[indice].id = arrayAuxOferta[oferta].id;
			// $scope.nuevo.productos[indice].cantidad = arrayAuxOferta[oferta].cantidad;
			// $scope.nuevo.productos[indice].item = "oferta";
			$scope.nuevo.importe = parseInt($scope.nuevo.importe) + (parseInt(arrayAuxOferta[oferta].importe) * parseInt(arrayAuxOferta[oferta].cantidad));
			indice ++;
		}

		if($scope.nuevo.productos.length == 0 && $scope.nuevo.ofertas.length == 0){
			alert("Por favor, selecciona al menos un producto");
			return;
		}

		console.info("LO QUE SE VA A MANDAR POR POST:",$scope.nuevo);

		ws.post('pedidos',JSON.stringify($scope.nuevo))
        //$http.post("http://localhost/TPlaboratorioIV2016/ws/pedidos/"+JSON.stringify($scope.nuevo))
		.then(function(data){
			console.info("Datos: ", data);
			if(confirm("Su pedido ha sido realizado con éxito. Por favor, le pedimos completar la siguiente encuesta, haciendo click en Aceptar.")){
				$("#encuesta").modal();
			}
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
});