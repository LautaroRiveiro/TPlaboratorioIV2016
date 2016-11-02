var app = angular.module("miApp", ['ui.router', 'encuesta.controller']);

app.config(function($stateProvider, $urlRouterProvider){
	
	$stateProvider
        .state('inicio', {
            url: '',
            templateUrl: 'templates/inicio.html'
        })
        .state('login', {
        	url: '/login',
        	templateUrl: 'templates/login.html'
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
});