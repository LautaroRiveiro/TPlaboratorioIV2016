var app = angular.module("miApp", ['ui.router', 'satellizer', 'angularFileUpload', 'ui.grid', 'ui.grid.selection', 'ui.grid.autoResize', 'ui.grid.pagination', 'encuesta.controller', 'login.controllers', 'starter.controllers', 'cliente.controllers', 'altas.controllers', 'grillas.controllers', 'estadisticas.controller', 'locales.controller', 'ui.grid.exporter', 'directivas']);

app.config(function($stateProvider, $urlRouterProvider, $authProvider){
	
    //Configuración del ui-router
	$stateProvider
        .state('inicio', {
            url: '',
            templateUrl: 'templates/inicio.html'
        })
        .state('login', {
        	url: '/login',
        	templateUrl: 'templates/login.html',
            controller: 'loginCtrl'
        })
        .state('locales', {
            url: '/locales',
            templateUrl: 'templates/locales.html',
            controller: 'localesCtrl'
        })
        .state('main', {
            url: '/main',
            templateUrl: 'templates/main.html',
            controller: 'mainCtrl'
        })
        .state('main.menu', {
            url: '/menu',
            templateUrl: 'templates/menu.html',
            controller: 'menuCtrl'
        })
        .state('main.cliente', {
            url: '/cliente',
            templateUrl: 'templates/cliente.html',
            controller: 'clienteCtrl'
        })
        .state('main.altaUsuario', {
            url: '/altaUsuario',
            templateUrl: 'templates/altaUsuario.html',
            controller: 'altaUsuarioCtrl',
            params: {obj: null, encargado: false}
        })
        .state('main.altaLocal', {
            url: '/altaLocal',
            templateUrl: 'templates/altaLocal.html',
            controller: 'altaLocalCtrl'
        })
        .state('main.altaProducto', {
            url: '/altaProducto',
            templateUrl: 'templates/altaProducto.html',
            controller: 'altaProductoCtrl'
        })
        .state('main.altaOferta', {
            url: '/altaOferta',
            templateUrl: 'templates/altaOferta.html',
            controller: 'altaOfertaCtrl'
        })
        .state('main.altaPedido', {
            url: '/altaPedido',
            templateUrl: 'templates/altaPedido.html',
            controller: 'altaPedidoCtrl',
            params: {perfil: null}
        })
        .state('main.altaEvento', {
            url: '/altaEvento',
            templateUrl: 'templates/altaEvento.html',
            controller: 'altaEventoCtrl'
        })
        .state('main.altaReserva', {
            url: '/altaReserva',
            templateUrl: 'templates/altaReserva.html',
            controller: 'altaReservaCtrl'
        })
        .state('main.grillaUsuarios', {
            url: '/grillaUsuarios',
            templateUrl: 'templates/grillaUsuarios.html',
            controller: 'grillaUsuariosCtrl',
            params: {
                encargado: false
            }
        })
        .state('main.grillaLocales', {
            url: '/grillaLocales',
            templateUrl: 'templates/grillaLocales.html',
            controller: 'grillaLocalesCtrl'
        })
        .state('main.grillaPedidos', {
            url: '/grillaPedidos',
            templateUrl: 'templates/grillaPedidos.html',
            controller: 'grillaPedidosCtrl'
        })
        .state('main.estadisticas', {
            url: '/estadisticas',
            templateUrl: 'templates/estadisticas.html',
            controller: 'estadisticasCtrl'
        })
        .state('encuesta', {
            url: '/encuesta',
            templateUrl: 'templates/encuesta.html',
            controller: 'encuestaCtrl'
        })
        .state('404', {
            url: '/404',
            templateUrl: 'templates/404.html',
            controller: 'denegadoCtrl'  
        })
	
	$urlRouterProvider.otherwise('');


    //Configuración del Satellizer
    $authProvider.loginUrl = "TPlaboratorioIV2016/ws/auth/login";
    $authProvider.signupUrl = "TPlaboratorioIV2016/ws/auth/signup";
    $authProvider.tokenName = "miToken";
    $authProvider.tokenPrefix = "miApp";
    $authProvider.authHeader = 'data';


});