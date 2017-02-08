angular.module('locales.controller',[])

.controller('localesCtrl', function($scope, $http){

var divMapa = document.getElementById('map');
	navigator.geolocation.getCurrentPosition(fn_ok, fn_mal);
	function fn_mal(){}
	function fn_ok(rta){
		var lat = rta.coords.latitude;
		var lon = rta.coords.longitude;

		var gLatLon = new google.maps.LatLng(lat, lon);

		var objConf = {
			zoom: 17,
			center: gLatLon
		};

		$scope.gMap = new google.maps.Map(divMapa, objConf);

		
		var objConfMarker = {
			position: gLatLon,
			map: $scope.gMap,
			title: "Tu ubicación actual"
		}
		var gMarker = new google.maps.Marker(objConfMarker);
	}

	$scope.locales = {};
	
	$http.get("http://localhost/TPlaboratorioIV2016/ws/locales")
	.then(function(data){
		console.info("data.data", data.data);
		$scope.locales.locales = data.data.locales;
	}
	,function(error){
		console.info("Error: ", error);
	});

	$scope.MostrarMapa = function(local){
		var gCoder = new google.maps.Geocoder();
		var objInfo = {
			address: local.direccion+', '+local.cp
		};
		gCoder.geocode(objInfo, fn_coder);
		
		function fn_coder(datos){
			var coordenadas = datos[0].geometry.location; //obj Lat-Lon

			var objConfMarkerDV = {
				position: coordenadas,
				map: $scope.gMap,
				title: "Local "+local.direccion
			}

			$scope.gMarkerDV = new google.maps.Marker(objConfMarkerDV);
		}
	}
});