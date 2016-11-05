<?php 
	//Requerir autoload.php
	require_once "vendor/autoload.php";
	
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
			$respuesta["login"] = "OK!";
			$respuesta["datos"] = $usuarioLogueado;
		}
		else{
			$respuesta["login"] = "Error!";
		}


		//Escribo la respuesta en el body del response y lo retorno
		$response->getBody()->write(json_encode($respuesta));
		return $response;
	});

	//Correr la aplicación
	$app->run();
 ?>