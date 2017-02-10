 angular.module('estadisticas.controller',[])

 .controller('estadisticasCtrl', function($scope, $http){


    //------------------------------ CHART PEDIDOS ----------------------------------------//
    $scope.producto = {};
    var categorias = [];
    var datos = [];
    var serie = [];

    //Traigo el detalle de los productos pedidos
    $http.get("http://localhost/TPlaboratorioIV2016/ws/pedidos_detalle").then(
        function(data){
            console.info("Pedidos_detalle",data.data);
            $scope.pedidos_detalle = data.data.pedidos_detalle;
            TraerProductos();
        },function(error){
            console.info("Error",error);
    });


    function TraerProductos(){
        //Traigo los productos
        $http.get("http://localhost/TPlaboratorioIV2016/ws/productos").then(
            function(data){
                
                console.info("Productos",data.data);

                for (var i in data.data.productos) {
                    $scope.producto[data.data.productos[i].id] = {};
                    $scope.producto[data.data.productos[i].id].id = data.data.productos[i].id;
                    $scope.producto[data.data.productos[i].id].descripcion = data.data.productos[i].descripcion;
                    $scope.producto[data.data.productos[i].id].cantidad = parseInt(0);
                }

                for (var i in $scope.pedidos_detalle) {
                    $scope.producto[$scope.pedidos_detalle[i].id_item].cantidad += parseInt($scope.pedidos_detalle[i].cantidad);
                }

                console.info("$scope.producto",$scope.producto);

                for (var i in $scope.producto) {
                    categorias.push($scope.producto[i].descripcion);
                    datos.push($scope.producto[i].cantidad);
                }

                serie = [{name: 'Unidades', data: datos}];

                CrearChart();

            },function(error){
                console.info("Error",error);
        });
    }


    //Función que crea al Chart
    function CrearChart(){
        
        //Defino los datos
        var data = [     { name: 'Jane', data: [1, 0, 4, 6, 4, 8] }   ];

        //Defino la configuración
        var configuracion = {
            chart: {
                renderTo: 'container',
                type: 'column'
            },
            title: {
                text: 'Productos pedidos (por Cantidad)'
            },
            xAxis: {
                categories: categorias
            },
            yAxis: {
                title: {
                    text: 'Cantidad (un.)'
                }
            },
            series: serie
        }

        //Creo el chart
        var myChart = Highcharts.chart(configuracion);
    }



    //------------------------------ CHART LOCALES ----------------------------------------//
    
    $scope.local = {};
    var categoriasLocales = [];
    var datosLocales = [];
    var serieLocales = [];

    //Traigo los locales
    $http.get("http://localhost/TPlaboratorioIV2016/ws/locales").then(
        function(data){
            console.info("Locales",data.data);
            $scope.locales = data.data.locales;

            for (var i in data.data.locales) {
                $scope.local[data.data.locales[i].id] = {};
                $scope.local[data.data.locales[i].id].id = data.data.locales[i].id;
                $scope.local[data.data.locales[i].id].direccion = data.data.locales[i].direccion;
                $scope.local[data.data.locales[i].id].importe = parseInt(0);
            };

            TraerPedidos();
        },function(error){
            console.info("Error",error);
    });

    function TraerPedidos(){
        //Traigo los pedidos
        $http.get("http://localhost/TPlaboratorioIV2016/ws/pedidos").then(
            function(data){
                console.info("Pedidos",data.data);
                $scope.pedidos = data.data.pedidos;

                for (var i in data.data.pedidos) {
                    $scope.local[data.data.pedidos[i].id_local].importe += parseInt(data.data.pedidos[i].importe);
                }

                console.info("$scope.local",$scope.local);

                for (var i in $scope.local) {
                    categoriasLocales.push($scope.local[i].direccion);
                    var aux = {};
                    aux.y = $scope.local[i].importe;
                    aux.name = $scope.local[i].direccion;
                    datosLocales.push(aux);
                }

                serieLocales = [{name: 'Ventas ($)', data: datosLocales}];

                CrearChartLocales();

            },function(error){
                console.info("Error",error);
        });
    };

    //Función que crea al Chart
    function CrearChartLocales(){
        
        //Defino la configuración
        var configuracion = {
            chart: {
                renderTo: 'locales',
                type: 'pie'
            },
            title: {
                text: 'Ventas por Local ($)'
            },
            xAxis: {
                categories: categoriasLocales
            },
            yAxis: {
                title: {
                    text: 'Ventas ($)'
                }
            },
            series: serieLocales
        }

        //Creo el chart
        var myChart = Highcharts.chart(configuracion);
    }












































/*
    $scope.data = [];

 	//Recupero los productos
 	$http.get("http://localhost/TPlaboratorioIV2016/ws/productos").then(
 		function(data){
 			console.info("data",data.data);
            $scope.productos = data.data.productos;
 			for (var item in data.data.productos) {
 				//$scope.datos.push(data.data.productos[item].descripcion);
 			}

 			console.info("categorias",categorias);
            CrearChart();
 		},
 		function(error){
 			console.info("error",error)
 	});

 	//Recupero los pedidos
 	$http.get("http://localhost/TPlaboratorioIV2016/ws/pedidos").then(
 		function(data){
            $scope.pedidos = data.data.pedidos
            console.info("data PEDIDOS!!",$scope.pedidos);
            Bla();
 		},
 		function(error){
 			console.info("error",error)
 	});

    //Recupero los pedidos_detalle
    $http.get("http://localhost/TPlaboratorioIV2016/ws/pedidos_detalle").then(
        function(data){
            $scope.pedidos_detalle = data.data.pedidos_detalle
            console.info("data PEDIDOS_DETALLE!!",$scope.pedidos_detalle);
            Bla();
        },
        function(error){
            console.info("error",error)
    });

    //Recupero las ofertas_prod
    $http.get("http://localhost/TPlaboratorioIV2016/ws/ofertas_prod").then(
        function(data){
            $scope.ofertas_prod = data.data.ofertas_prod
            console.info("data ofertas_prod!!",$scope.ofertas_prod);

        },
        function(error){
            console.info("error",error)
    });


function Bla(){


    for(var i in $scope.productos){

        //$scope.data[i].name = $scope.productos[i].descripcion;
        //$scope.data[i].y = 0;

        $scope.data.push({
            name: $scope.productos[i].descripcion,
            y: 0
        })

        for (var j in $scope.pedidos_detalle) {
            if ($scope.pedidos_detalle[j].item == "producto" && ($scope.pedidos_detalle[j].id_item == $scope.productos[i].id)) {
                $scope.data[i].y = $scope.data[i].y + parseInt($scope.pedidos_detalle[j].cantidad);
            }

        };

    };
    console.info("DATOOOSO!!!!!", $scope.data);
    console.info("DATOOOSO!!!!!", $scope.productos);
    console.info("DATOOOSO!!!!!", $scope.pedidos_detalle);
    console.info("DATOOOSO!!!!!", $scope.data);
}
        // for (var i in $scope.pedidos_detalle) {
        //     if ($scope.pedidos_detalle[i].item == "producto"){
        //         //TRATAMIENTO PRODUCTO
        //         $scope.producto[] = $scope.producto[] + $scope.pedidos_detalle[i].cantidad;
        //     }
        //     else{ //Es oferta
        //         //TRATAMIENTO OFERTA

        //     }
        // }


    //Configuración del chart
    var categorias = [];
    var datos = [];

    function CrearChart(){
        
        //Defino los datos
        var data = [{
            name: 'Jane',
            data: [{name: 'Bananas', y:1}, 0, 4, 6, 4, 8]
        }];

        //Defino la configuración
        var configuracion = {
            chart: {
                renderTo: 'container',
                type: 'column'
            },
            title: {
                text: 'Fruit Consumption'
            },
            xAxis: {
                categories: categorias
            },
            yAxis: {
                title: {
                    text: 'Fruit eaten'
                }
            },
            series: data
        }

        //Creo el chart
        var myChart = Highcharts.chart(configuracion);

    }






	
	// Build the chart
    // var prueba = Highcharts.chart('locales', {
    //     chart: {
    //         plotBackgroundColor: null,
    //         plotBorderWidth: null,
    //         plotShadow: false,
    //         type: 'pie'
    //     },
    //     title: {
    //         text: 'Cantidad de ventas por local (en $)'
    //     },
    //     tooltip: {
    //         pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    //     },
    //     plotOptions: {
    //         pie: {
    //             allowPointSelect: true,
    //             cursor: 'pointer',
    //             dataLabels: {
    //                 enabled: false
    //             },
    //             showInLegend: true
    //         }
    //     },
    //     series: [{
    //         name: 'Brands',
    //         colorByPoint: true,
    //         data: [{
    //             name: 'Microsoft Internet Explorer',
    //             y: 56.33
    //         }, {
    //             name: 'Chrome',
    //             y: 24.03,
    //             sliced: true,
    //             selected: true
    //         }, {
    //             name: 'Firefox',
    //             y: 10.38
    //         }, {
    //             name: 'Safari',
    //             y: 4.77
    //         }, {
    //             name: 'Opera',
    //             y: 0.91
    //         }, {
    //             name: 'Proprietary or Undetectable',
    //             y: 0.2
    //         }]
    //     }]
    // });

    // console.info("prueba", prueba);


    


    // var chart1 = Highcharts.stockChart('container', {
    //      rangeSelector: {
    //         selected: 1
    //      },
    //      series: [{
    //         name: 'USD to EUR',
    //         data: usdtoeur // predefined JavaScript array
    //      }]
    //   });








    */
 });


    