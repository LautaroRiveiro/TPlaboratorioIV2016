 angular.module('estadisticas.controller',[])

 .controller('estadisticasCtrl', function($scope, $http){

 	var categorias = [];
 	var datos = [];

 	//Recupero los datos de los productos
 	$http.get("http://localhost/TPlaboratorioIV2016/ws/productos").then(
 		function(data){
 			console.info("data",data.data);

 			for (var item in data.data.productos) {
 				categorias.push(data.data.productos[item].descripcion);
 			}

 			console.info("categorias",categorias);
 		},
 		function(error){
 			console.info("error",error)
 	});

 	//Recupero la cantidad de ventas por producto
 	$http.get("http://localhost/TPlaboratorioIV2016/ws/productos").then(
 		function(data){
 			console.info("data",data.data);

 			for (var item in data.data.productos) {
 				categorias.push(data.data.productos[item].descripcion);
 			}

 			console.info("categorias",categorias);
 		},
 		function(error){
 			console.info("error",error)
 	});



 		var usdtoeur = [{
            name: 'Jane',
            data: [{name: 'Bananas', y:1}, 0, 4, 6, 4, 8]
        }];

	    var myChart = Highcharts.chart('container', {
	        chart: {
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
	        series: usdtoeur
	    });









	
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
 });


    