angular.module('miApp')
.factory('usuario', function ($http, $auth, $location, $state){
	var usuario = {};
	usuario.nombreFactory = "factoriaUsuario";
	usuario.usuario = {};
	usuario.Salir = salir;
	usuario.getUsuario = getUsuario;
	usuario.Loguear = Loguear;

	function salir(){
	    $auth.logout()
        .then(function() {
            // Desconectamos al usuario y lo redirijimos
            $location.path("/login");
            //return;
        });
	};

	function getUsuario(){
		return usuario.usuario;
	};

	/* ¿Qué hago en Loguear()?
     * Llamo por POST (http) al authProvider, que configuré en app.config.
     * Le paso como parámetro un objeto JSON que contiene las credenciales del login.
     * Si la conexión fue exitosa (no importa si el log existe), se ejecuta la función success del then(), donde recién ahí evalúo si existe o no el usuario y la clave.
     * Si hubo algún error en la conexión, se ejecuta la función de error del then(), donde muestro por consola el error.
    */
	function Loguear(usuario){
		//$auth.login() hace una llamada de tipo POST al $authProvider.loginUrl establecido en app.js
		//Al combinarlo con Slim Framework es necesario configurar $app->post() y no otro.
		$auth.login(usuario)
		.then(function(resp){
			if($auth.isAuthenticated()){
				console.info("response: ", resp);
				console.info("getPayload: ", $auth.getPayload());
				usuario.usuario = JSON.parse(JSON.stringify($auth.getPayload()));
				console.info("usuario.usuario: ", usuario.usuario);
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
	};


	return usuario;
});