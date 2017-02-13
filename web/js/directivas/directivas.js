angular.module('directivas', [])

.directive('dvEncuesta', function(){
	// Runs during compile
	return {
		controller: 'encuestaCtrl',
		restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		templateUrl: 'templates/encuesta.html',
	};
});