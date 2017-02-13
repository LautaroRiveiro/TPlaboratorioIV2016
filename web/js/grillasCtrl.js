angular.module('grillas.controllers', [])

.controller('grillaUsuariosCtrl', function($scope, $auth, $http, uiGridConstants, i18nService, $state, $stateParams, usuario, ws){
	usuario.VerificarLogueado();

	console.info("$stateParams",$stateParams);
	if ($stateParams.encargado) {
		$scope.titulo = "Empleados";
	}
	else{
		$scope.titulo = "Usuarios";
	}

	$scope.gridOptions = {
		// Configuracion para exportar datos a Excel
		exporterCsvFilename: 'misdatos.csv',
		exporterCsvColumnSeparator: ';',
		exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),

		// Configuracion para exportar datos a PDF
		exporterPdfDefaultStyle: {fontSize: 9},
		exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
		exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red', alignment: 'center'},
		exporterPdfHeader: { text: $scope.titulo, style: 'headerStyle', alignment: 'center', color: 'darkblue'},
		exporterPdfFooter: function ( currentPage, pageCount ) {
			return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' , alignment: 'right'};
		},
		exporterPdfCustomFormatter: function ( docDefinition ) {
			docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
			docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
			return docDefinition;
		},
		exporterPdfOrientation: 'portrait',
		exporterPdfPageSize: 'A4',
		exporterPdfMaxGridWidth: 450,
		exporterSuppressColumns: [ 'Boton' ],

		//Configuracion de Paginación
		paginationPageSizes: [10, 25, 50],
		paginationPageSize: 25,
		enableGridMenu: true,

		//Configuración gridApi
		onRegisterApi: function(gridApi){
			$scope.gridApi = gridApi;
		}
	};

	//Configuración de las columnas de la tabla
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

	//$http.get("http://localhost/TPlaboratorioIV2016/ws/usuarios")
	ws.getAll('usuarios')
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

.controller('grillaPedidosCtrl', function($scope, $auth, $http, uiGridConstants, i18nService, $state, $stateParams, usuario, ws){
	usuario.VerificarLogueado();

	$scope.gridOptions = {
		// Configuracion para exportar datos a Excel
		exporterCsvFilename: 'misdatos.csv',
		exporterCsvColumnSeparator: ';',
		exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),

		// Configuracion para exportar datos a PDF
		exporterPdfDefaultStyle: {fontSize: 9},
		exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
		exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red', alignment: 'center'},
		exporterPdfHeader: { text: 'Pedidos', style: 'headerStyle', alignment: 'center', color: 'darkblue'},
		exporterPdfFooter: function ( currentPage, pageCount ) {
			return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' , alignment: 'right'};
		},
		exporterPdfCustomFormatter: function ( docDefinition ) {
			docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
			docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
			return docDefinition;
		},
		exporterPdfOrientation: 'portrait',
		exporterPdfPageSize: 'A4',
		exporterPdfMaxGridWidth: 450,
		exporterSuppressColumns: [ 'Cliente', 'boton', 'Nuevo Estado' ],

		//Configuracion de Paginación
		paginationPageSizes: [10, 25, 50],
		paginationPageSize: 25,
		enableGridMenu: true,

		//Configuración gridApi
		onRegisterApi: function(gridApi){
			$scope.gridApi = gridApi;
		}
	};

	//Idioma de la grilla en Español
	i18nService.setCurrentLang('es');

	$( "#estadoPedido" ).on( "change", function() {
	  console.log( $( this ).text() );
	});

	ws.getAll('pedidos')
	//$http.get("http://localhost/TPlaboratorioIV2016/ws/pedidos")
	.then(function(data){
		console.info("data.data", data.data);
		$scope.gridOptions.data = data.data.pedidos
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
            { field: 'boton', width: '90', displayName: 'Boton', cellTemplate:"<button class='btn btn-info btn-block btn-sm' ng-click='grid.appScope.Modificar(row.entity)'>MODIFICAR</button>"}
        ];
    }
    $scope.Modificar = function(row){
      console.info("row",row);

      if (row.nuevoEstado == undefined){
      		alert("Indicar un estado");
      		return;
      }

      ws.put('pedidos', JSON.stringify(row))
      //$http.put("http://localhost/TPlaboratorioIV2016/ws/pedidos/"+JSON.stringify(row))
      .then(function(data){
		console.info("data.data", data.data);
		$state.reload();
		console.info("$scope.gridOptions.data",$scope.gridOptions.data);
	}, function(error){
		console.info("Error: ", error);
	});
    }
})

.controller('grillaLocalesCtrl',function($scope, $http, usuario, ws){
	usuario.VerificarLogueado();

	$scope.locales = {};

	ws.getAll('locales')
	.then(function(data){
		console.info(data.data);
		$scope.locales = data.data.locales;
		console.info($scope.locales);

		for (var local in $scope.locales) {
			    //$scope.locales[local].foto1 = "http://localhost/TPlaboratorioIV2016/ws/img/"+$scope.locales[local].foto1;
			    //$scope.locales[local].foto2 = "http://localhost/TPlaboratorioIV2016/ws/img/"+$scope.locales[local].foto2;
			    //$scope.locales[local].foto3 = "http://localhost/TPlaboratorioIV2016/ws/img/"+$scope.locales[local].foto3;
			    $scope.locales[local].foto1 = ws.url+"img/"+$scope.locales[local].foto1;
			    $scope.locales[local].foto2 = ws.url+"img/"+$scope.locales[local].foto2;
			    $scope.locales[local].foto3 = ws.url+"img/"+$scope.locales[local].foto3;
			    $scope.locales[local].arrayImg = [$scope.locales[local].foto1, $scope.locales[local].foto2, $scope.locales[local].foto3];
		}
		console.info($scope.locales);

	}, function(error){
		console.info("Error: ", error);
	});

	$('.carousel').carousel({
		interval: false
	});
});