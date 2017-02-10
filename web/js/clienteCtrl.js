angular.module('cliente.controllers',[])


.controller('clienteCtrl', function($scope, $auth){
	$('.carousel').carousel();

	$scope.usuario = {};
	$scope.usuario = JSON.parse(JSON.stringify($auth.getPayload()));
	console.info("usuario main", $scope.usuario);

	$scope.saludar = function(){
		alert("HOLA");
	}
})

.controller('altaReservaCtrl', function($scope, $http, $auth, $state, ws){
	//Recupero los datos de la sesión del usuario
	$scope.usuario = {};
	$scope.usuario = JSON.parse(JSON.stringify($auth.getPayload()));

	$scope.nuevo = {};
	$scope.nuevo.id_usuario = $scope.usuario.id;

	$scope.locales = {};
	$scope.horaAux;


	//Configurar como mínima fecha al día de hoy
	function FormatoFecha(fecha){
		
		var dd = fecha.getDate();
		var mm = fecha.getMonth()+1; //January is 0!
		var yyyy = fecha.getFullYear();
		 if(dd<10){
		        dd='0'+dd
		    } 
		    if(mm<10){
		        mm='0'+mm
		    } 

		fecha = yyyy+'-'+mm+'-'+dd;
		return fecha;
	};
	document.getElementById("fecha").setAttribute("min", FormatoFecha(new Date()));

	ws.getAll('locales')
	.then(function(data){
		console.info("data.data", data.data);
		$scope.locales.locales = data.data.locales;
	}
	,function(error){
		console.info("Error: ", error);
	});

	$scope.Guardar = function(){
		//Evalúo que la fecha ingresada sea posterior al día de hoy
		if (FormatoFecha($scope.nuevo.fecha) < FormatoFecha(new Date())) {
			alert("La fecha no puede ser posterior al día de hoy");
			return;
		}

		//Paso la hora y minutos del campo horaAux al campo de la fecha
		$scope.nuevo.fecha.setHours($scope.horaAux.getHours());
		$scope.nuevo.fecha.setMinutes($scope.horaAux.getMinutes());
		console.info("$scope.nuevo: ", $scope.nuevo);

		ws.post('reservas',(JSON.stringify($scope.nuevo)))
		//$http.post("http://localhost/TPlaboratorioIV2016/ws/reservas/"+JSON.stringify($scope.nuevo))
		.then(function(data){
			console.info("Datos: ", data);
			alert("Reserva realizada con éxito");
			// for (var campo in $scope.nuevo) {
			//     $scope.nuevo[campo] = "";
			// }
			$state.go("main.cliente");
		}, function(error){
			console.info("Error: ", error);
		});
	}

})

.controller('altaEventoCtrl', function($scope, $auth, $http, FileUploader, uiGridConstants, ws){
	$scope.nuevo = {};
	$scope.nuevo.id_usuario = $auth.getPayload().id;
	$scope.nuevo.importe = 0;

	$scope.gridOptions = {
		enableRowSelection: true,
    	//enableFullRowSelection: true,
    	//multiSelect: true
    	enableHorizontalScrollbar: 0,
    	enableVerticalScrollbar: 0
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
            { field: 'precio', width: '80', name: 'precio', cellFilter: 'currency'},
            { field: 'cantidad', name: 'cantidad', width: '80', displayName: 'Cantidad', cellTemplate:"<input type='number' style='height:100%;' min=1 ng-model='row.entity.cantidad' ng-click='grid.appScope.Modificar(row.entity)'></input>"},
            //{ field: 'imagen', name: 'imagen', displayName: 'Imagen', cellTemplate:'<img width="50px" ng-src="../ws/img/{{row.entity.foto1}}" lazy-src>' }
            { field: 'Boton', width: '90', displayName: 'Boton', cellTemplate:"<button href='#detalle' data-toggle='modal' class='btn btn-info btn-block btn-sm' ng-click='grid.appScope.Detalle(row.entity)'>DETALLE</button>"}
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
    
    $scope.Detalle = function(row){
		$scope.detalle = row;
		console.info("$scope.detalle",$scope.detalle);
		//$('.carousel').carousel('stop');
		$('.carousel').carousel({
			interval: 2000
		});
    }

    $scope.Guardar = function(){
        //Evalúo que la fecha ingresada sea posterior al día de hoy
		if (FormatoFecha($scope.nuevo.fecha,0) < FormatoFecha(new Date(),2)) {
			alert("Se debe pedir con 48hs. de anticipación");
			return;
		}
		else if(FormatoFecha($scope.nuevo.fecha,0) > FormatoFecha(new Date(),5)){
			console.info("$scope.nuevo.fecha: ",$scope.nuevo.fecha);
			console.info("FormatoFecha(new Date(),5): ",FormatoFecha(new Date(),5));
			alert("Se debe pedir como máximo para dentro de 5 días");
			return;
		}

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

		ws.post('eventos',(JSON.stringify($scope.nuevo)))
        //$http.post("http://localhost/TPlaboratorioIV2016/ws/eventos/"+JSON.stringify($scope.nuevo))
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

    //Configurar como mínima fecha al día de hoy
	function FormatoFecha(fecha, rango){
		
		var dd = parseInt(fecha.getDate())+parseInt(rango);
		var mm = fecha.getMonth()+1; //January is 0!
		var yyyy = fecha.getFullYear();
		 if(dd<10){
		        dd='0'+dd
		    } 
		    if(mm<10){
		        mm='0'+mm
		    } 

		fecha = yyyy+'-'+mm+'-'+dd;
		return fecha;
	};
	document.getElementById("fecha").setAttribute("min", FormatoFecha(new Date(),2));
	//console.info("MINIMO", FormatoFecha(new Date(),2));
	document.getElementById("fecha").setAttribute("max", FormatoFecha(new Date(),5));
	//console.info("MAXIMO", FormatoFecha(new Date(),5));
});