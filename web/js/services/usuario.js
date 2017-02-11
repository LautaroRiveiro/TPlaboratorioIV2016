angular.module('miApp')
.factory('usuario', function ($http, $auth, $location, $state){

	return{

		nombreFactory: "factoriaUsuario",

		/* ¿Qué hago en Loguear()?
		 * Llamo por POST (http) al authProvider, que configuré en app.config.
		 * Le paso como parámetro un objeto JSON que contiene las credenciales del login.
		 * Si la conexión fue exitosa (no importa si el log existe), se ejecuta la función success del then(), donde recién ahí evalúo si existe o no el usuario y la clave.
		 * Si hubo algún error en la conexión, se ejecuta la función de error del then(), donde muestro por consola el error.
		*/
		Loguear: function(usuario){
			//$auth.login() hace una llamada de tipo POST al $authProvider.loginUrl establecido en app.js
			//Al combinarlo con Slim Framework es necesario configurar $app->post() y no otro.
			$auth.login(usuario)
			.then(function(resp){
				if($auth.isAuthenticated()){
					//console.info("response: ", resp);
					console.info("getPayload: ", $auth.getPayload());
					usuario.usuario = JSON.parse(JSON.stringify($auth.getPayload()));
					if(usuario.usuario.perfil == "Cliente"){
						$state.go("main.cliente");
					}
					else{
						$location.path("/main/menu");
					}
				}
				else{
					console.log("Usuario o contraseña incorrecta");
					console.log(resp);
					usuario.password = "";
				}
			})
			.catch(function(error){
				//Error durante logueo
				console.info("Error de conexión", error);
			});
		},

		Salir: function(){
		    $auth.logout()
	        .then(function() {
	            // Desconectamos al usuario y lo redirijimos
	            $location.path("/login");
	            //return;
	        });
		},

		VerificarLogueado: function(){
			if (!$auth.isAuthenticated()) {
				console.info("Ud. no está logueado");
				$state.go("inicio");
			}
		},

		VerificarPerfil: function(nivel){
			
			var perfil = $auth.getPayload().perfil;

			switch(nivel) {
			    case 'Administrador':
			        if (perfil != 'Administrador'){
			        	$state.go("404");
			        }
			        break;

			    case 'Encargado':
			        if (perfil != 'Administrador' && perfil != 'Encargado'){
			        	$state.go("404");
			        }
			        break;

			    case 'Empleado':
			        if (perfil != 'Administrador' && perfil != 'Encargado' && perfil != 'Empleado'){
			        	$state.go("404");
			        }
			        break;

			    default:
			        break;
			} 

			// for (var i in nivel) {
			// 	if (perfil == nivel[i]){
			// 		return;
			// 	}
			// }
			// $state.go("404");
			
		},		

		Datos: function(){
			return JSON.parse(JSON.stringify($auth.getPayload()));
		}

	}

});