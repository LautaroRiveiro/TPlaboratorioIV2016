angular.module('locales.controller',[])

.controller('localesCtrl', function($scope, $http, $state){

	//Cargo la geolocalización del usuario en un mapa
	var divMapa = document.getElementById('map');
	var gLatLon;
	var dr = new google.maps.DirectionsRenderer();

	navigator.geolocation.getCurrentPosition(fn_ok, fn_mal);

	function fn_mal(){}

	function fn_ok(rta){
		var lat = rta.coords.latitude;
		var lon = rta.coords.longitude;
		gLatLon = new google.maps.LatLng(lat, lon);
		var objConf = {
			zoom: 12,
			center: gLatLon
		};

		$scope.gMap = new google.maps.Map(divMapa, objConf);
	

		var objConfMarker = {
			position: gLatLon,
			map: $scope.gMap,
			title: "Tu ubicación actual"
		}
		var gMarker = new google.maps.Marker(objConfMarker);

		gMarker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
	}


	//Recupero el listado de todos los locales
	$scope.locales = {};
	
	$http.get("http://localhost/TPlaboratorioIV2016/ws/locales")
	.then(function(data){
		console.info("data.data", data.data);
		$scope.locales.locales = data.data.locales;

		for (var i in data.data.locales) {
			$scope.MostrarMarcador(data.data.locales[i]);
		}
	}
	,function(error){
		console.info("Error: ", error);
	});


	//Función para agregar un Marcador en función de un Local
	$scope.MostrarMarcador = function(local){
		//Traduzco la dirección en coordenadas
		var gCoder = new google.maps.Geocoder();
		var objInfo = {
			address: local.direccion+', '+local.cp
		};
		gCoder.geocode(objInfo, fn_coder);

		console.info("objInfo",objInfo);
		
		function fn_coder(datos){
			console.info("DATOS",datos);
			var coordenadas = datos[0].geometry.location; //obj Lat-Lon
			
			var objConfMarkerDV = {
				position: coordenadas,
				map: $scope.gMap,
				title: "Local "+local.direccion
			}

			$scope.gMarkerDV = new google.maps.Marker(objConfMarkerDV);
			$scope.gMarkerDV.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png')
			
			//Agrego la ventana de información cuando pincho al marcador
			var objHTML = {
				content: '<div style="max-width:150px;"><img src="http://localhost/TPlaboratorioIV2016/ws/img/'+local.foto1+'" alt="" style="width:100%;">'+local.direccion+'</div>'
			}
			var gInfoWindow = new google.maps.InfoWindow(objHTML);
			google.maps.event.addListener($scope.gMarkerDV, 'click', function(){
				gInfoWindow.open($scope.gMap, $scope.gMarkerDV);
			});
		}
	}

	//Función para mostrar el trayecto entre el usuario y el Local
	$scope.MostrarTrayecto = function(local){
		dr.setMap(null);

		var objConfDR = {
			map: $scope.gMap,
			suppressMarkers: true
		}

		var objConfDS = {
			origin: gLatLon, 							//LatLong o Domicilio
			destination: local.direccion+', '+local.cp,	//LatLong o Domicilio
			travelMode: google.maps.TravelMode.DRIVING	//Caminando, auto, colectivo
		}

		var ds = new google.maps.DirectionsService(); //Obtener coordenadas del trayecto
		dr = new google.maps.DirectionsRenderer( objConfDR ); //Mostrar la ruta de las coordenadas

		ds.route( objConfDS, function(datos, status){
			if (status == 'OK') {
				dr.setDirections(datos);
			}
			else{
				console.info("No se encontró una ruta", status);
			}
		} );
	}

	$scope.Volver = function(){
		$state.go("inicio");
	}
});