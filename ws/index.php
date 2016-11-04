<?php 
	//Requerir autoload.php
	require_once "vendor/autoload.php";
	
	//Instanciar una aplicación Slim
	$app = new \Slim\App;
	
	//Definir las rutas con sus funciones:
	//GET (consultar y leer recursos), POST (crear recursos), PUT (editar recursos) y DELETE (eliminar recursos)
	$app->get("/", function(){
		echo "Hola, mundo";
	});
	
	$app->get("/user/{nombre}", function($request, $response, $args){
		//echo "Hola, ".$rq->getAttribute('nombre');
		return $args["nombre"];

	});

	//Correr la aplicación
	$app->run();
 ?>