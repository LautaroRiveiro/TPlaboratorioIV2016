var app = angular.module("miApp", ['ui.router', 'satellizer', 'encuesta.controller', 'login.controllers']);

app.config(function($stateProvider, $urlRouterProvider, $authProvider){
	
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
            templateUrl: 'templates/menu.html'
        })
        .state('main.cliente', {
            url: '/cliente',
            templateUrl: 'templates/cliente.html'
        })
        .state('encuesta', {
            url: '/encuesta',
            templateUrl: 'templates/encuesta.html',
            controller: 'encuestaCtrl'
        })
	
	$urlRouterProvider.otherwise('');


    //Configuración del Satellizer
    $authProvider.loginUrl = "TP/web/#/auth/login";
    $authProvider.signUpUrl = "RUTA!!!/auth/signup";
    $authProvider.tokenName = "token";
    $authProvider.tokenPrefix = "miApp";


});