angular.module('estadisticas.controller',[])

.controller('estadisticasCtrl', function($scope, $http, ws){

    //------------------------------ CHART PEDIDOS ----------------------------------------//
    $scope.producto = {};
    var categorias = [];
    var datos = [];
    var serie = [];

    //Traigo el detalle de los productos pedidos
    ws.getAll("pedidos_detalle")
    //$http.get("http://localhost/TPlaboratorioIV2016/ws/pedidos_detalle")
    .then(
        function(data){
            console.info("Pedidos_detalle",data.data);
            $scope.pedidos_detalle = data.data.pedidos_detalle;
            TraerProductos();
        },function(error){
            console.info("Error",error);
    });


    function TraerProductos(){
        //Traigo los productos
        ws.getAll("productos")
        //$http.get("http://localhost/TPlaboratorioIV2016/ws/productos")
        .then(
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
    ws.getAll('locales')
    .then(
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
        ws.getAll('pedidos')
        //$http.get("http://localhost/TPlaboratorioIV2016/ws/pedidos")
        .then(
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
});


    