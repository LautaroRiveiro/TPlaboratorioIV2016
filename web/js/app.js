var app = angular.module("miApp", ['ui.router']);

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
	
	$urlRouterProvider.otherwise('/inicio');
});