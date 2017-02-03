<?php
class Oferta
{
//--------------------------------------------------------------------------------//
//--ATRIBUTOS (No sé por qué tuve que ponerlos public)
	public $id;
 	public $descripcion;
 	public $descuento;
//--------------------------------------------------------------------------------//

//--------------------------------------------------------------------------------//
//--GETTERS Y SETTERS
	public function GetId()
	{
		return $this->id;
	}
	public function GetDescripcion()
	{
		return $this->descripcion;
	}
	public function GetDescuento()
	{
		return $this->descuento;
	}


	public function SetId($valor)
	{
		$this->id = $valor;
	}
	public function SetDescripcion($valor)
	{
		$this->descripcion = $valor;
	}
	public function SetDescuento($valor)
	{
		$this->descuento = $valor;
	}


//--------------------------------------------------------------------------------//
//--CONSTRUCTOR
	public function __construct($id=NULL)
	{
		if($id !== NULL){
			$obj = self::TraerUnaOfertaPorId($id);
			$this->id = $obj->GetId();
			$this->descripcion = $obj->GetDescripcion();
			$this->descuento = $obj->GetDescuento();
		}
	}

//--------------------------------------------------------------------------------//
//--TOSTRING	
  	public function ToString()
	{
	  	return $this->id." - ".$this->descripcion." - ".$this->descuento."\r\n";
	}
//--------------------------------------------------------------------------------//
//--------------------------------------------------------------------------------//
//--METODO DE CLASE
	public static function TraerUnaOfertaPorId($id){
		$conexion = self::CrearConexion();

		$sql = "SELECT U.id, U.descripcion, U.descuento
				FROM ofertas U
				WHERE U.id = :id";

		$consulta = $conexion->prepare($sql);
		$consulta->bindValue(":id", $id, PDO::PARAM_INT);
		$consulta->execute();

		$oferta = $consulta->fetchObject('Oferta');
		return $oferta;
	}

	public static function TraerTodosLasOfertas(){
		$conexion = self::CrearConexion();

		$sql = "SELECT U.id, U.descripcion, U.descuento
				FROM ofertas U";

		$consulta = $conexion->prepare($sql);
		$consulta->execute();

		$oferta = $consulta->fetchall(PDO::FETCH_CLASS, 'Oferta');
		return $oferta;
	}

	public static function Agregar($oferta){
		$conexion = self::CrearConexion();

		$sql = "INSERT INTO ofertas (descripcion, descuento)
				VALUES (:descripcion, :descuento)";

		$consulta = $conexion->prepare($sql);
		$consulta->bindValue(":descripcion", $oferta->descripcion, PDO::PARAM_STR);
		$consulta->bindValue(":descuento", $oferta->descuento, PDO::PARAM_INT);
		$consulta->execute();

		$idAgregado = $conexion->lastInsertId();
		return $idAgregado;
	}

	public static function Modificar($oferta){
		$conexion = self::CrearConexion();

		$sql = "UPDATE ofertas
				SET descripcion = :descripcion, descuento = :descuento
				WHERE id = :id";

		$consulta = $conexion->prepare($sql);
		$consulta->bindValue(":descripcion", $oferta->descripcion, PDO::PARAM_STR);
		$consulta->bindValue(":descuento", $oferta->descuento, PDO::PARAM_INT);
		$consulta->bindValue(":id", $oferta->id, PDO::PARAM_INT);
		$consulta->execute();

		$cantidad = $consulta->rowCount();
		return $cantidad;
	}

	public static function Eliminar($id){
		$conexion = self::CrearConexion();

		$sql = "DELETE FROM ofertas
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