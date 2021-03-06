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

			#-------------------------------------- REDIMENSIONAR IMAGEN A 600x400 --------------------------------#
			$maxDimW = 600;
			$maxDimH = 400;
			list($width, $height, $type, $attr) = getimagesize( $_FILES['file']['tmp_name'] );
			// if ( $width > $maxDimW || $height > $maxDimH ) {
			    $target_filename = $_FILES['file']['tmp_name'];
			    $fn = $_FILES['file']['tmp_name'];
			 
			    $size = getimagesize( $fn );
			    $ratio = $size[0]/$size[1]; // width/height
			    // if( $ratio > 1) {
			    //     $width = $maxDimW;
			    //     $height = $maxDimH/$ratio;
			    // } else {
			    //     $width = $maxDimW*$ratio;
			    //     $height = $maxDimH;
			    // }
				$width = $maxDimW;
				$height = $maxDimH;
			    $src = imagecreatefromstring(file_get_contents($fn));
			    $dst = imagecreatetruecolor( $width, $height );
			    imagecopyresampled($dst, $src, 0, 0, 0, 0, $width, $height, $size[0], $size[1] );

			    imagejpeg($dst, $target_filename); // adjust format as needed
			#-------------------------------------------------------------------------------------------------------#

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

	$app->get("/localID", function($request, $response, $args){

		$respuesta["consulta"] = "Próximo ID a insertar";

		//Traigo todos los locales
		require_once "clases/local.php";
		$locales = Local::ProximoID();		
		$respuesta["proximoID"] = $locales;

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

	$app->get("/productoID", function($request, $response, $args){

		$respuesta["consulta"] = "Próximo ID a insertar";

		//Traigo todos los productos
		require_once "clases/producto.php";
		$productos = Producto::ProximoID();		
		$respuesta["proximoID"] = $productos;

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
			//require_once "clases/producto.php";
			foreach ($oferta->productos as $valor) {
			    //$valor = $valor * 2;
			    //$auxProducto = Producto::TraerUnProductoPorId($valor->id);
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

	$app->get("/ofertas", function($request, $response, $args){

		$respuesta["consulta"] = "Lista de ofertas";

		//Incluyo las librerías
		require_once "clases/oferta.php";
		require_once "clases/ofertas_prod.php";
		require_once "clases/producto.php";

		//Traigo todos los ofertas y los detalles
		$ofertas = Oferta::TraerTodasLasOfertas();
		$ofertasProd = Oferta_prod::TraerTodasLasOfertasProd();	

		/*Acá lo que hago es agregar, para cada oferta (oferta), un array que contenga el detalle de cada uno de los
		* productos que componen la oferta (oferta_prod). Además, para completar la descripción de cada uno de estos
		* productos, le sumo un array con los datos de ese producto (producto). */ 
		foreach ($ofertas as $oferta) {
		    foreach ($ofertasProd as $key => $ofProd) {
		    	if ($oferta->id == $ofProd->id_oferta) {
		    		$ofProd->productoDetalle = Producto::TraerUnProductoPorId($ofProd->id_producto);
		    		$oferta->productos[] = $ofProd;
		    	}
		    }
		}

		//Incluyo los datos en la repsuesta a enviar
		$respuesta["ofertas"] = $ofertas;

		//Escribo la respuesta en el body del response y lo retorno
		$response->getBody()->write(json_encode($respuesta));
		return $response;		
	});

#PEDIDOS
	$app->post("/pedidos/{pedido}", function($request, $response, $args){
		//Recupero los datos del formulario de alta del pedido en un stdClass
		$pedido = json_decode($args["pedido"]); // $pedido->nombre = "Pizza"

		require_once "clases/ofertas_prod.php";
		$ofertas_prod = Oferta_prod::TraerTodasLasOfertasProd();

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

			require_once "clases/pedidos_oferta.php";
			require_once "clases/producto.php";
			foreach ($pedido->ofertas as $valor) {
			    //$valor = $valor * 2;
			    $respuesta[] = Pedido_oferta::Agregar($respuesta["idAgregado"],$valor);

			    $valor->id; //ID OFERTA
			    foreach ($ofertas_prod as $key => $ofProd) {
			    	if ($ofProd->id_oferta == $valor->id) {
			    		$prod = new stdClass();
			    		$prod->id = $ofProd->id_producto;
			    		$prod->cantidad = $valor->cantidad;
			    		$prod->id_oferta = $ofProd->id_oferta;
			    		$aux = Producto::TraerUnProductoPorId($ofProd->id_producto);
			    		$prod->precio = $aux->precio;




		// $consulta->bindValue(":id_pedido", $id_pedido, PDO::PARAM_INT);
		// $consulta->bindValue(":id_item", $pedidoDetalle->id, PDO::PARAM_INT);
		// $consulta->bindValue(":id_oferta", $pedidoDetalle->id_oferta, PDO::PARAM_INT);
		// $consulta->bindValue(":cantidad", $pedidoDetalle->cantidad, PDO::PARAM_INT);
		// $consulta->bindValue(":precio", $pedidoDetalle->precio, PDO::PARAM_INT);






			    		$respuesta[] = Pedido_detalle::Agregar($respuesta["idAgregado"],$prod);
			    	}
			    }
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
			    $valor->usuario = Usuario::TraerUnUsuarioPorId($valor->id_usuario);;
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

#RESERVAS
	$app->post("/reservas/{reserva}", function($request, $response, $args){
		//Recupero los datos del formulario de alta de la reserva en un stdClass
		$reserva = json_decode($args["reserva"]); // $reserva->cantidad = 10

		//Modifico el reserva
		try{
			require_once "clases/reserva.php";
			$respuesta["idAgregado"] = Reserva::Agregar($reserva);
			$respuesta["mensaje"] = "Se agregó la reserva #".$respuesta["idAgregado"];
		}
		catch (Exception $e){
			$respuesta["idAgregado"] = "ERROR";
			$respuesta["error"] = $e;
		}

		//Escribo la respuesta en el body del response y lo retorno
		$response->getBody()->write(json_encode($respuesta));
		return $response;
	});

	$app->get("/reservas", function($request, $response, $args){

		$respuesta["consulta"] = "Lista de reservas";

		//Traigo todos los reservas
		require_once "clases/reserva.php";
		$reservas = Reserva::TraerTodosLasReservas();

		$respuesta["reservas"] = $reservas;

		//Escribo la respuesta en el body del response y lo retorno
		$response->getBody()->write(json_encode($respuesta));
		return $response;		
	});

#EVENTOS
	$app->post("/eventos/{evento}", function($request, $response, $args){
		//Recupero los datos del formulario de alta del evento en un stdClass
		$evento = json_decode($args["evento"]); // $evento->nombre = "Pizza"

		//Modifico el evento
		try{
			require_once "clases/evento.php";
			$respuesta["idAgregado"] = Evento::Agregar($evento);
			$respuesta["mensaje"] = "Se agregó el evento #".$respuesta["idAgregado"];
			
			require_once "clases/eventos_detalle.php";
			foreach ($evento->productos as $valor) {
			    //$valor = $valor * 2;
			    $respuesta[] = Evento_detalle::Agregar($respuesta["idAgregado"],$valor);
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

#PEDIDOS_DETALLE
	$app->get("/pedidos_detalle", function($request, $response, $args){

		$respuesta["consulta"] = "Lista de pedidos_detalle";

		//Traigo todos los pedidos_detalle
		require_once "clases/pedidos_detalle.php";
		$pedidos_detalle = Pedido_detalle::TraerTodosLosPedidosDetalle();

		$respuesta["pedidos_detalle"] = $pedidos_detalle;

		//Escribo la respuesta en el body del response y lo retorno
		$response->getBody()->write(json_encode($respuesta));
		return $response;		
	});

#OFERTAS_PROD
	$app->get("/ofertas_prod", function($request, $response, $args){

		$respuesta["consulta"] = "Lista de ofertas_prod";

		//Traigo todos los ofertas_prod
		require_once "clases/ofertas_prod.php";
		$ofertas_prod = Oferta_prod::TraerTodosLasOfertasProd();

		$respuesta["ofertas_prod"] = $ofertas_prod;

		//Escribo la respuesta en el body del response y lo retorno
		$response->getBody()->write(json_encode($respuesta));
		return $response;		
	});

#ENCUESTAS
	$app->post("/encuestas/{encuesta}", function($request, $response, $args){
		//Recupero los datos del formulario de alta de la encuesta en un stdClass
		$encuesta = json_decode($args["encuesta"]); // $encuesta->nombre = "Pizza"

		//Modifico el encuesta
		try{
			require_once "clases/encuesta.php";
			$respuesta["idAgregado"] = Encuesta::Agregar($encuesta);
			$respuesta["mensaje"] = "Se agregó la encuesta #".$respuesta["idAgregado"];
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