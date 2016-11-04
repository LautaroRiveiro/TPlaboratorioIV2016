<?php 
	require_once 'vendor/autoload.php';

	$app = new \Slim\Slim();

	$app->get('/j/{usuario}', function($r, $re){
		echo "Hola, $usuario";
	});

	$app->get('/user/:usuario', function($usuario){
		echo "Hola, $usuario";
	});

	$app->get('/', function(){
		echo "Hola";
	});

	$app->run();

	/********************
	* La ruta raiz es http://localhost:8080/TP/ws/
	*********************
	*/
 ?>