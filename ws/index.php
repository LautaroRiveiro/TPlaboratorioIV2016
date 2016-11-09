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
	
	$app->post("/auth/login", function($request, $response, $args){
		//Recupero desde $request las credenciales ingresadas. Usar getParsedBody() ya incluye un json_decode.
		//$credenciales = $request->getParsedBody();
		$credenciales = json_decode($request->getBody());

		//Conecto con la BD para ver si son correctas
		try
		{
			$conexion = new PDO("mysql:host=localhost;dbname=pizzeria;charset=utf8;",'root','');
			//return $conexion;

			$sql = "SELECT U.id, U.nombre, U.apellido, U.email, U.perfil, U.sexo
				FROM usuarios U
				WHERE U.email = :email AND U.password = :pass";

			$consulta = $conexion->prepare($sql);
			$consulta->bindValue(":email", $credenciales->email, PDO::PARAM_STR);
			$consulta->bindValue(":pass", $credenciales->password, PDO::PARAM_STR);
			$consulta->execute();

			//$usuarioLogueado = $consulta->fetchObject('Usuario');
			$usuarioLogueado = $consulta->fetchObject();
			//return $usuarioLogueado;
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

	//Correr la aplicación
	$app->run();
 ?>