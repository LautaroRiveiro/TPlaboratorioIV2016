<?php 
	//Requerir autoload.php
	require_once "vendor/autoload.php";
	//Incluyo librerías de JWT
	require_once 'jwt/vendor/autoload.php';
	use \Firebase\JWT\JWT;

	//Instanciar una aplicación Slim
	$app = new \Slim\App;
	
	//Definir las rutas con sus funciones:
	//GET (consultar y leer recursos), POST (crear recursos), PUT (editar recursos) y DELETE (eliminar recursos)
	$app->get("/", function(){
		echo "Bienvenidos al WS!";
	});

#LOGIN
	$app->post("/auth/login", function($request, $response, $args){
		//Recupero desde $request las credenciales ingresadas. Usar getParsedBody() ya incluye un json_decode.
		//$credenciales = $request->getParsedBody();
		$credenciales = json_decode($request->getBody());

		//Conecto con la BD para ver si son correctas
		try
		{
			require_once "clases/usuario.php";
			$usuarioLogueado = Usuario::TraerUsuarioLogueado($credenciales);
		}
		catch (Exception $e) {
			print_r("Error: " . $e->GetMessage());
			die();
			return;
		}

		//Preparo una respuesta para bien o para mal
		if($usuarioLogueado)
		{
			##Todo lo que está acá (más incluir las librerías arriba) es la funcionalidad del JWT, que lo vimos dentro de auth.php. JWT solo usa dos funciones decode y encode.##
			//Clave elegida por el admin del server para encoding y decoding el JWT
			$key = "123456";
			//Creo el token que voy a codificar
			$token = array(
			    "nombre" => $usuarioLogueado->nombre,
			    "perfil" => $usuarioLogueado->perfil,
			    "email" => $usuarioLogueado->email,
			    "exp" => time()+100000
			);
			//Codifico el token con la función encode()
			$jwt = JWT::encode($token, $key);
			//Creo un array de respuesta donde uno de sus elementos tiene por índice el mismo nombre que en la configuración del Satellizer del cliente, y su valor es el JWT
			$respuesta["miToken"] = $jwt;
			$respuesta["datosDB"] = $usuarioLogueado; //A modo de TEST envío al cliente los datos de la BD
			$decoded = JWT::decode($jwt, $key, array('HS256'));
			$decoded_array = (array) $decoded;
			$respuesta["datosTOKEN"] = $decoded_array; //A modo de TEST envío al cliente los datos descifrados
		}
		else{
			$respuesta["login"] = "Error! Usuario o clave incorrectas";
		}

		//Escribo la respuesta en el body del response y lo retorno
		$response->getBody()->write(json_encode($respuesta));
		return $response;
	});

	$app->post("/auth/signup", function($request, $response, $args){
		//Recuperar los datos recibidos
		$datosRegistro = json_encode(json_decode($request->getBody()));

		//Validar
			//... (en un futuro)
		//Guardar en la BD
		try
		{
			require_once "clases/usuario.php";
			$idAgregado = Usuario::Agregar(json_decode($datosRegistro));
		}
		catch (Exception $e) {
			print_r("Error: " . $e->GetMessage());
			die();
			return;
		}
		//Loguearlo
		if($idAgregado)
		{
			try
			{
				require_once "clases/usuario.php";
				$usuarioLogueado = Usuario::TraerUnUsuarioPorId($idAgregado);
			}
			catch (Exception $e) {
				print_r("Error: " . $e->GetMessage());
				die();
				return;
			}

			##Todo lo que está acá (más incluir las librerías arriba) es la funcionalidad del JWT, que lo vimos dentro de auth.php. JWT solo usa dos funciones decode y encode.##
			//Clave elegida por el admin del server para encoding y decoding el JWT
			$key = "123456";
			//Creo el token que voy a codificar
			$token = array(
			    "nombre" => $usuarioLogueado->nombre,
			    "perfil" => $usuarioLogueado->perfil,
			    "email" => $usuarioLogueado->email,
			    "exp" => time()+100000
			);
			//Codifico el token con la función encode()
			$jwt = JWT::encode($token, $key);
			//Creo un array de respuesta donde uno de sus elementos tiene por índice el mismo nombre que en la configuración del Satellizer del cliente, y su valor es el JWT
			$respuesta["miToken"] = $jwt;
			$respuesta["datosDB"] = $usuarioLogueado; //A modo de TEST envío al cliente los datos de la BD
			$decoded = JWT::decode($jwt, $key, array('HS256'));
			$decoded_array = (array) $decoded;
			$respuesta["datosTOKEN"] = $decoded_array; //A modo de TEST envío al cliente los datos descifrados
		}
		else{
			$respuesta["login"] = "Error!";
		}

		//Escribo la respuesta en el body del response y lo retorno
		$response->getBody()->write(json_encode($respuesta));
		return $response;
	});


#USUARIOS
	$app->post("/usuarios/{usuario}", function($request, $response, $args){
		//Recupero los datos del formulario de alta del usuario en un stdClass
		$usuario = json_decode($args["usuario"]); // $usuario->nombre = "Lautaro"

		//Modifico el usuario
		try{
			require_once "clases/usuario.php";
			$respuesta["idAgregado"] = Usuario::Agregar($usuario);
			$respuesta["mensaje"] = "Se agregó el usuario #".$respuesta["idAgregado"];
		}
		catch (Exception $e){
			$respuesta["idAgregado"] = "ERROR";
			$respuesta["error"] = $e;
		}

		//Escribo la respuesta en el body del response y lo retorno
		$response->getBody()->write(json_encode($respuesta));
		return $response;
	});

	$app->get("/usuarios", function($request, $response, $args){

		$respuesta["consulta"] = "Lista de usuarios";

		//Traigo todos los usuarios
		require_once "clases/usuario.php";
		$usuarios = Usuario::TraerTodosLosUsuarios();		
		$respuesta["usuarios"] = $usuarios;

		//Escribo la respuesta en el body del response y lo retorno
		$response->getBody()->write(json_encode($respuesta));
		return $response;		
	});

	$app->delete("/usuarios/{id}", function($request, $response, $args){
		//Recupero el Id del usuario
		$id = json_decode($args["id"]);

		//Elimino el usuario
		try{
			require_once "clases/usuario.php";
			$respuesta["cantidad"] = Usuario::Eliminar($id);
			$respuesta["mensaje"] = "Se eliminaron ".$respuesta["cantidad"]." usuarios";
		}
		catch (Exception $e){
			$respuesta["nuevoId"] = "ERROR";
			$respuesta["error"] = $e;
		}

		//Escribo la respuesta en el body del response y lo retorno
		$response->getBody()->write(json_encode($respuesta));
		return $response;
	});

	$app->put("/usuarios/{usuario}", function($request, $response, $args){
		//Recupero los datos del formulario de modificación del usuario en un stdClass
		$usuario = json_decode($args["usuario"]); // $usuario->nombre = "Lautaro"

		//Modifico el usuario
		try{
			require_once "clases/usuario.php";
			$respuesta["cantidad"] = Usuario::Modificar($usuario);
			$respuesta["mensaje"] = "Se modificaron ".$respuesta["cantidad"]." usuarios";
		}
		catch (Exception $e){
			$respuesta["nuevoId"] = "ERROR";
			$respuesta["error"] = $e;
		}

		//Escribo la respuesta en el body del response y lo retorno
		$response->getBody()->write(json_encode($respuesta));
		return $response;
	});


#ARCHIVOS
	$app->post("/files", function($request, $response, $args){
		if ( !empty( $_FILES ) ) {
		    $tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
		    // $uploadPath = dirname( __FILE__ ) . DIRECTORY_SEPARATOR . 'img' . DIRECTORY_SEPARATOR . $_FILES[ 'file' ][ 'name' ];
		    //$uploadPath = "../". DIRECTORY_SEPARATOR . 'img' . DIRECTORY_SEPARATOR . $_FILES[ 'file' ][ 'name' ];
		    $uploadPath = 'img' . DIRECTORY_SEPARATOR . $_FILES[ 'file' ][ 'name' ];
		    move_uploaded_file( $tempPath, $uploadPath );
		    $respuesta["mensaje"] = 'Archivo Cargado!';
		} else {
		    $respuesta["error"] = 'No se cargo el archivo';
		}

		//Escribo la respuesta en el body del response y lo retorno
		$response->getBody()->write(json_encode($respuesta));
		return $response;
	});

#LOCALES
	$app->post("/locales/{local}", function($request, $response, $args){
		//Recupero los datos del formulario de alta del local en un stdClass
		$local = json_decode($args["local"]); // $local->direccion = "Prueba 123"

		//Modifico el local
		try{
			require_once "clases/local.php";
			$respuesta["idAgregado"] = Local::Agregar($local);
			$respuesta["mensaje"] = "Se agregó el local #".$respuesta["idAgregado"];
		}
		catch (Exception $e){
			$respuesta["idAgregado"] = "ERROR";
			$respuesta["error"] = $e;
		}

		//Escribo la respuesta en el body del response y lo retorno
		$response->getBody()->write(json_encode($respuesta));
		return $response;
	});

	//Correr la aplicación
	$app->run();
 ?>