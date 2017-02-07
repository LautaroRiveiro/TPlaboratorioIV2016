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
			    "id" => $usuarioLogueado->id,
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

	$app->get("/locales", function($request, $response, $args){

		$respuesta["consulta"] = "Lista de locales";

		//Traigo todos los locales
		require_once "clases/local.php";
		$locales = Local::TraerTodosLosLocales();		
		$respuesta["locales"] = $locales;

		//Escribo la respuesta en el body del response y lo retorno
		$response->getBody()->write(json_encode($respuesta));
		return $response;		
	});	

#PRODUCTOS
	$app->post("/productos/{producto}", function($request, $response, $args){
		//Recupero los datos del formulario de alta del producto en un stdClass
		$producto = json_decode($args["producto"]); // $producto->nombre = "Pizza"

		//Modifico el producto
		try{
			require_once "clases/producto.php";
			$respuesta["idAgregado"] = Producto::Agregar($producto);
			$respuesta["mensaje"] = "Se agregó el producto #".$respuesta["idAgregado"];
		}
		catch (Exception $e){
			$respuesta["idAgregado"] = "ERROR";
			$respuesta["error"] = $e;
		}

		//Escribo la respuesta en el body del response y lo retorno
		$response->getBody()->write(json_encode($respuesta));
		return $response;
	});

	$app->get("/productos", function($request, $response, $args){

		$respuesta["consulta"] = "Lista de productos";

		//Traigo todos los productos
		require_once "clases/producto.php";
		$productos = Producto::TraerTodosLosProductos();		
		$respuesta["productos"] = $productos;

		//Escribo la respuesta en el body del response y lo retorno
		$response->getBody()->write(json_encode($respuesta));
		return $response;		
	});

#OFERTAS
	$app->post("/ofertas/{oferta}", function($request, $response, $args){
		//Recupero los datos del formulario de alta del oferta en un stdClass
		$oferta = json_decode($args["oferta"]); // $oferta->nombre = "Pizza"

		//Modifico el oferta
		try{
			require_once "clases/oferta.php";
			$respuesta["idAgregado"] = Oferta::Agregar($oferta);
			$respuesta["mensaje"] = "Se agregó la oferta #".$respuesta["idAgregado"];
			
			require_once "clases/ofertas_prod.php";
			foreach ($oferta->productos as $valor) {
			    //$valor = $valor * 2;
			    $respuesta[] = Oferta_prod::Agregar($respuesta["idAgregado"],$valor);
			}
			//$respuesta["idAgregado"] = Oferta::Agregar($oferta);
			//$respuesta["mensaje"] = "Se agregó la oferta #".$respuesta["idAgregado"];
		}
		catch (Exception $e){
			$respuesta["idAgregado"] = "ERROR";
			$respuesta["error"] = $e;
		}

		//Escribo la respuesta en el body del response y lo retorno
		$response->getBody()->write(json_encode($respuesta));
		return $response;
	});


#PEDIDOS
	$app->post("/pedidos/{pedido}", function($request, $response, $args){
		//Recupero los datos del formulario de alta del pedido en un stdClass
		$pedido = json_decode($args["pedido"]); // $pedido->nombre = "Pizza"

		//Modifico el pedido
		try{
			require_once "clases/pedido.php";
			$respuesta["idAgregado"] = Pedido::Agregar($pedido);
			$respuesta["mensaje"] = "Se agregó el pedido #".$respuesta["idAgregado"];
			
			require_once "clases/pedidos_detalle.php";
			foreach ($pedido->productos as $valor) {
			    //$valor = $valor * 2;
			    $respuesta[] = Pedido_detalle::Agregar($respuesta["idAgregado"],$valor);
			}
			//$respuesta["idAgregado"] = Oferta::Agregar($oferta);
			//$respuesta["mensaje"] = "Se agregó la oferta #".$respuesta["idAgregado"];
		}
		catch (Exception $e){
			$respuesta["idAgregado"] = "ERROR";
			$respuesta["error"] = $e;
		}

		//Escribo la respuesta en el body del response y lo retorno
		$response->getBody()->write(json_encode($respuesta));
		return $response;
	});

	$app->get("/pedidos", function($request, $response, $args){

		$respuesta["consulta"] = "Lista de pedidos";

		//Traigo todos los pedidos
		require_once "clases/pedido.php";
		$pedidos = Pedido::TraerTodosLosPedidos();

		require_once "clases/usuario.php";
		foreach ($pedidos as $valor) {
			    //$valor = $valor * 2;
			    $valor->usuario = Usuario::TraerUnUsuarioPorId($valor->id);;
			}

		$respuesta["pedidos"] = $pedidos;

		//Escribo la respuesta en el body del response y lo retorno
		$response->getBody()->write(json_encode($respuesta));
		return $response;		
	});

	$app->put("/pedidos/{pedido}", function($request, $response, $args){
		//Recupero los datos del formulario de alta del pedido en un stdClass
		$pedido = json_decode($args["pedido"]); // $pedido->nombre = "Pizza"


		//Modifico el pedido
		try{
			require_once "clases/pedido.php";
			$respuesta["cantidad"] = Pedido::ModificarEstado($pedido);
			$respuesta["mensaje"] = "Se modificaron ".$respuesta["cantidad"]." pedidos";
		}
		catch (Exception $e){
			$respuesta["nuevoId"] = "ERROR";
			$respuesta["error"] = $e;
		}

		//Escribo la respuesta en el body del response y lo retorno
		$response->getBody()->write(json_encode($respuesta));
		return $response;		
	});

	//Correr la aplicación
	$app->run();
 ?>