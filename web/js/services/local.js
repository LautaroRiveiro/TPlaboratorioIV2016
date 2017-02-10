angular.module('miApp')

.service('ws', function($http){

	this.url = "http://localhost/TPlaboratorioIV2016/ws/";

	this.getAll = function(clase){
		return $http.get(this.url+clase);
	};

	this.post = function(clase, objeto){
    	return $http.post(this.url+clase+'/'+objeto);
    };
    
    this.put = function(clase, objeto){
    	return $http.put(this.url+clase+'/'+objeto);
    };
});

/*
.service('local', function($http){
	//Públicas -> this.
	//Privadas -> var
	// this.getLocales = function(success, error){
	// 	return $http.get("http://localhost/TPlaboratorioIV2016/ws/locales")
	// 		.then(success, error);
	// }

	this.getLocales = function(){
		return $http.get("http://localhost/TPlaboratorioIV2016/ws/locales");
	};

	this.postLocal = function(local){
    	return $http.post('http://localhost/TPlaboratorioIV2016/ws/locales/'+local);
    };

    
})

.service('reserva', function($http){

	this.getReservas = function(){
		return $http.get("http://localhost/TPlaboratorioIV2016/ws/reservas");
	};

	this.postReserva = function(reserva){
    	return $http.post('http://localhost/TPlaboratorioIV2016/ws/reservas/'+reserva);
    };
    
})

.service('producto', function($http){

	this.getProductos = function(){
		return $http.get("http://localhost/TPlaboratorioIV2016/ws/productos");
	};

	this.postProducto = function(producto){
    	return $http.post('http://localhost/TPlaboratorioIV2016/ws/productos/'+producto);
    };
    
})

.service('evento', function($http){

	this.getEventos = function(){
		return $http.get("http://localhost/TPlaboratorioIV2016/ws/eventos");
	};

	this.postEvento = function(evento){
    	return $http.post('http://localhost/TPlaboratorioIV2016/ws/eventos/'+evento);
    };
    
})

.service('oferta', function($http){

	this.getOfertas = function(){
		return $http.get("http://localhost/TPlaboratorioIV2016/ws/ofertas");
	};

	this.postOferta = function(oferta){
    	return $http.post('http://localhost/TPlaboratorioIV2016/ws/ofertas/'+oferta);
    };
    
})

.service('pedido', function($http){

	this.getPedidos = function(){
		return $http.get("http://localhost/TPlaboratorioIV2016/ws/pedidos");
	};

	this.postPedido = function(pedido){
    	return $http.post('http://localhost/TPlaboratorioIV2016/ws/pedidos/'+pedido);
    };
    
});*/