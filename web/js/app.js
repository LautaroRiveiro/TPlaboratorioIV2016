var app = angular.module("miApp", ['ui.router', 'satellizer', 'angularFileUpload', 'ui.grid', 'ui.grid.selection', 'encuesta.controller', 'login.controllers', 'starter.controllers']);

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
        .state('main', {
            url: '/main',
            templateUrl: 'templates/main.html'
        })
        .state('main.menu', {
            url: '/menu',
            templateUrl: 'templates/menu.html',
            controller: 'menuCtrl'
        })
        .state('main.cliente', {
            url: '/cliente',
            templateUrl: 'templates/cliente.html'
        })
        .state('main.altaUsuario', {
            url: '/altaUsuario',
            templateUrl: 'templates/altaUsuario.html',
            controller: 'altaUsuarioCtrl',
            params: {obj: null}
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
            controller: 'altaPedidoCtrl'
        })
        .state('main.grillaUsuarios', {
            url: '/grillaUsuarios',
            templateUrl: 'templates/grillaUsuarios.html',
            controller: 'grillaUsuariosCtrl'
        })
        .state('main.grillaLocales', {
            url: '/grillaLocales',
            templateUrl: 'templates/grillaLocales.html',
            controller: 'grillaLocalesCtrl'
        })
        .state('encuesta', {
            url: '/encuesta',
            templateUrl: 'templates/encuesta.html',
            controller: 'encuestaCtrl'
        })
	
	$urlRouterProvider.otherwise('');


    //Configuración del Satellizer
    $authProvider.loginUrl = "TPlaboratorioIV2016/ws/auth/login";
    $authProvider.signupUrl = "TPlaboratorioIV2016/ws/auth/signup";
    $authProvider.tokenName = "miToken";
    $authProvider.tokenPrefix = "miApp";
    $authProvider.authHeader = 'data';


});