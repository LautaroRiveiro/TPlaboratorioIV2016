<?php
class Encuesta
{
//--------------------------------------------------------------------------------//
//--ATRIBUTOS (No sé por qué tuve que ponerlos public)
	public $id;
 	public $pregunta1;
 	public $pregunta2;
 	public $pregunta3;
  	public $pregunta4;
  	public $pregunta5;
  	public $pregunta6;
  	public $pregunta71;
  	public $pregunta72;
  	public $pregunta73;
  	public $pregunta74;
  	public $pregunta75;
  	public $comentario;
//--------------------------------------------------------------------------------//

//--------------------------------------------------------------------------------//
//--GETTERS Y SETTERS
	public function GetId()
	{
		return $this->id;
	}
	public function GetPregunta1()
	{
		return $this->pregunta1;
	}
	public function GetPregunta2()
	{
		return $this->pregunta2;
	}
	public function GetPregunta3()
	{
		return $this->pregunta3;
	}
	public function GetPregunta4()
	{
		return $this->pregunta4;
	}
	public function GetPregunta5()
	{
		return $this->pregunta5;
	}
	public function GetPregunta6()
	{
		return $this->pregunta6;
	}
	public function GetPregunta71()
	{
		return $this->pregunta71;
	}
	public function GetPregunta72()
	{
		return $this->pregunta72;
	}
	public function GetPregunta73()
	{
		return $this->pregunta73;
	}
	public function GetPregunta74()
	{
		return $this->pregunta74;
	}
	public function GetPregunta75()
	{
		return $this->pregunta75;
	}
	public function GetComentario()
	{
		return $this->comentario;
	}


	public function SetId($valor)
	{
		$this->id = $valor;
	}
	public function SetPregunta1($valor)
	{
		$this->pregunta1 = $valor;
	}
	public function SetPregunta2($valor)
	{
		$this->pregunta2 = $valor;
	}
	public function SetPregunta3($valor)
	{
		$this->pregunta3 = $valor;
	}
	public function SetPregunta4($valor)
	{
		$this->pregunta4 = $valor;
	}
	public function SetPregunta5($valor)
	{
		$this->pregunta5 = $valor;
	}
	public function SetPregunta6($valor)
	{
		$this->pregunta6 = $valor;
	}
	public function SetPregunta71($valor)
	{
		$this->pregunta71 = $valor;
	}
	public function SetPregunta72($valor)
	{
		$this->pregunta72 = $valor;
	}
	public function SetPregunta73($valor)
	{
		$this->pregunta73 = $valor;
	}
	public function SetPregunta74($valor)
	{
		$this->pregunta74 = $valor;
	}
	public function SetPregunta75($valor)
	{
		$this->pregunta75 = $valor;
	}
	public function SetComentario($valor)
	{
		$this->comentario = $valor;
	}


//--------------------------------------------------------------------------------//
//--CONSTRUCTOR
	public function __construct($id=NULL)
	{
		if($id !== NULL){
			$obj = self::TraerUnaConsultaPorId($id);
			$this->id = $obj->GetId();
			$this->pregunta1 = $obj->GetPregunta1();
			$this->pregunta2 = $obj->GetPregunta2();
			$this->pregunta3 = $obj->GetPregunta3();
			$this->pregunta4 = $obj->GetPregunta4();
			$this->pregunta5 = $obj->GetPregunta5();
			$this->pregunta6 = $obj->GetPregunta6();
			$this->pregunta71 = $obj->GetPregunta71();
			$this->pregunta72 = $obj->GetPregunta72();
			$this->pregunta73 = $obj->GetPregunta73();
			$this->pregunta74 = $obj->GetPregunta74();
			$this->pregunta75 = $obj->GetPregunta75();
			$this->comentario = $obj->GetComentario();
		}
	}

//--------------------------------------------------------------------------------//
//--------------------------------------------------------------------------------//
//--METODO DE CLASE
	public static function TraerUnaConsultaPorId($id){
		$conexion = self::CrearConexion();

		$sql = "SELECT U.id, U.pregunta1, U.pregunta2, U.pregunta3, U.pregunta4, U.pregunta5, U.pregunta6, U.pregunta71, U.pregunta72, U.pregunta73, U.pregunta74, U.pregunta75, U.comentario
				FROM encuestas U
				WHERE U.id = :id";

		$consulta = $conexion->prepare($sql);
		$consulta->bindValue(":id", $id, PDO::PARAM_INT);
		$consulta->execute();

		$encuesta = $consulta->fetchObject('Encuesta');
		return $encuesta;
	}

	public static function TraerTodosLasEncuestas(){
		$conexion = self::CrearConexion();

		$sql = "SELECT U.id, U.pregunta1, U.pregunta2, U.pregunta3, U.pregunta4, U.pregunta5, U.pregunta6, U.pregunta71, U.pregunta72, U.pregunta73, U.pregunta74, U.pregunta75, U.comentario
				FROM encuestas U";

		$consulta = $conexion->prepare($sql);
		$consulta->execute();

		$encuesta = $consulta->fetchall(PDO::FETCH_CLASS, 'Encuesta');
		return $encuesta;
	}

	public static function Agregar($encuesta){
		$conexion = self::CrearConexion();

		$sql = "INSERT INTO encuestas (pregunta1, pregunta2, pregunta3, pregunta4, pregunta5, pregunta6, pregunta71, pregunta72, pregunta73, pregunta74, pregunta75, comentario)
				VALUES (:pregunta1, :pregunta2, :pregunta3, :pregunta4, :pregunta5, :pregunta6, :pregunta71, :pregunta72, :pregunta73, :pregunta74, :pregunta75, :comentario)";

		$consulta = $conexion->prepare($sql);
		$consulta->bindValue(":pregunta1", $encuesta->pregunta1, PDO::PARAM_INT);
		$consulta->bindValue(":pregunta2", $encuesta->pregunta2, PDO::PARAM_INT);
		$consulta->bindValue(":pregunta3", $encuesta->pregunta3, PDO::PARAM_INT);
		$consulta->bindValue(":pregunta4", $encuesta->pregunta4, PDO::PARAM_INT);
		$consulta->bindValue(":pregunta5", $encuesta->pregunta5, PDO::PARAM_INT);
		$consulta->bindValue(":pregunta6", $encuesta->pregunta6, PDO::PARAM_INT);
		$consulta->bindValue(":pregunta71", $encuesta->pregunta7->uno, PDO::PARAM_INT);
		$consulta->bindValue(":pregunta72", $encuesta->pregunta7->dos, PDO::PARAM_INT);
		$consulta->bindValue(":pregunta73", $encuesta->pregunta7->tres, PDO::PARAM_INT);
		$consulta->bindValue(":pregunta74", $encuesta->pregunta7->cuatro, PDO::PARAM_INT);
		$consulta->bindValue(":pregunta75", $encuesta->pregunta7->cinco, PDO::PARAM_INT);
		$consulta->bindValue(":comentario", $encuesta->comentario, PDO::PARAM_STR);
		$consulta->execute();

		$idAgregado = $conexion->lastInsertId();
		return $idAgregado;
	}

	public static function Modificar($encuesta){
		$conexion = self::CrearConexion();

		$sql = "UPDATE encuestas
				SET pregunta1 = :pregunta1, pregunta2 = :pregunta2, pregunta3 = :pregunta3, pregunta4 = :pregunta4, pregunta5 = :pregunta5, pregunta6 = :pregunta6, pregunta71 = :pregunta71, pregunta72 = :pregunta72, pregunta73 = :pregunta73, pregunta74 = :pregunta74, pregunta75 = :pregunta75, comentario = :comentario
				WHERE id = :id";

		$consulta = $conexion->prepare($sql);
		$consulta->bindValue(":pregunta1", $encuesta->pregunta1, PDO::PARAM_INT);
		$consulta->bindValue(":pregunta2", $encuesta->pregunta2, PDO::PARAM_INT);
		$consulta->bindValue(":pregunta3", $encuesta->pregunta3, PDO::PARAM_INT);
		$consulta->bindValue(":pregunta4", $encuesta->pregunta4, PDO::PARAM_INT);
		$consulta->bindValue(":pregunta5", $encuesta->pregunta5, PDO::PARAM_INT);
		$consulta->bindValue(":pregunta6", $encuesta->pregunta6, PDO::PARAM_INT);
		$consulta->bindValue(":pregunta71", $encuesta->pregunta7->uno, PDO::PARAM_INT);
		$consulta->bindValue(":pregunta72", $encuesta->pregunta7->dos, PDO::PARAM_INT);
		$consulta->bindValue(":pregunta73", $encuesta->pregunta7->tres, PDO::PARAM_INT);
		$consulta->bindValue(":pregunta74", $encuesta->pregunta7->cuatro, PDO::PARAM_INT);
		$consulta->bindValue(":pregunta75", $encuesta->pregunta7->cinco, PDO::PARAM_INT);
		$consulta->bindValue(":comentario", $encuesta->comentario, PDO::PARAM_STR);
		$consulta->bindValue(":id", $encuesta->id, PDO::PARAM_INT);
		$consulta->execute();

		$cantidad = $consulta->rowCount();
		return $cantidad;
	}

	public static function Eliminar($id){
		$conexion = self::CrearConexion();

		$sql = "DELETE FROM encuestas
				WHERE id = :id";

		$consulta = $conexion->prepare($sql);
		$consulta->bindValue(":id", $id, PDO::PARAM_INT);
		$consulta->execute();

		$cantidad = $consulta->rowCount();
		return $cantidad;
	}

	public static function CrearConexion(){
		try
		{
			$conexion = new PDO("mysql:host=localhost;dbname=pizzeria;charset=utf8;",'root','');
			return $conexion;
		}
		catch (Exception $e) {
			print_r("Error: " . $e->GetMessage());
			die();
			return;
		}
	}
//--------------------------------------------------------------------------------//
}
?>