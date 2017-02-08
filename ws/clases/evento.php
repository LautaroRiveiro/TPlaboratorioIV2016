<?php
class Evento
{
//--------------------------------------------------------------------------------//
//--ATRIBUTOS (No sé por qué tuve que ponerlos public)
	public $id;
	public $id_usuario;
 	public $fecha;
 	public $importe;
//--------------------------------------------------------------------------------//

//--------------------------------------------------------------------------------//
//--GETTERS Y SETTERS
	public function GetId()
	{
		return $this->id;
	}
	public function GetIdUsuario()
	{
		return $this->id_usuario;
	}
	public function GetFecha()
	{
		return $this->fecha;
	}
	public function GetImporte()
	{
		return $this->importe;
	}


	public function SetId($valor)
	{
		$this->id = $valor;
	}
	public function SetIdUsuario($valor)
	{
		$this->id_usuario = $valor;
	}
	public function SetFecha($valor)
	{
		$this->fecha = $valor;
	}
	public function SetImporte($valor)
	{
		$this->importe = $valor;
	}


//--------------------------------------------------------------------------------//
//--CONSTRUCTOR
	public function __construct($id=NULL)
	{
		if($id !== NULL){
			$obj = self::TraerUnPedidoPorId($id);
			$this->id = $obj->GetId();
			$this->id_usuario = $obj->GetIdUsuario();
			$this->fecha = $obj->GetFecha();
			$this->importe = $obj->GetImporte();
		}
	}

//--------------------------------------------------------------------------------//
//--------------------------------------------------------------------------------//
//--METODO DE CLASE
	public static function TraerUnEventoPorId($id){
		$conexion = self::CrearConexion();

		$sql = "SELECT U.id, U.id_usuario, U.fecha, U.importe
				FROM eventos U
				WHERE U.id = :id";

		$consulta = $conexion->prepare($sql);
		$consulta->bindValue(":id", $id, PDO::PARAM_INT);
		$consulta->execute();

		$evento = $consulta->fetchObject('Evento');
		return $evento;
	}

	public static function TraerTodosLosEventos(){
		$conexion = self::CrearConexion();

		$sql = "SELECT U.id, U.id_usuario, U.fecha, U.importe
				FROM eventos U";

		$consulta = $conexion->prepare($sql);
		$consulta->execute();

		$evento = $consulta->fetchall(PDO::FETCH_CLASS, 'Evento');
		return $evento;
	}

	public static function Agregar($evento){
		$conexion = self::CrearConexion();

		$sql = "INSERT INTO eventos (id_usuario, fecha, importe)
				VALUES (:id_usuario, :fecha, :importe)";

		$consulta = $conexion->prepare($sql);
		$consulta->bindValue(":id_usuario", $evento->id_usuario, PDO::PARAM_INT);
		$consulta->bindValue(":fecha", $evento->fecha, PDO::PARAM_STR);
		$consulta->bindValue(":importe", $evento->importe, PDO::PARAM_INT);
		$consulta->execute();

		$idAgregado = $conexion->lastInsertId();
		return $idAgregado;
	}

	public static function Modificar($evento){
		$conexion = self::CrearConexion();

		$sql = "UPDATE eventos
				SET id_usuario = :id_usuario, fecha = :fecha, importe = :importe
				WHERE id = :id";

		$consulta = $conexion->prepare($sql);
		$consulta->bindValue(":id_usuario", $evento->id_usuario, PDO::PARAM_INT);
		$consulta->bindValue(":fecha", $evento->fecha, PDO::PARAM_STR);
		$consulta->bindValue(":importe", $evento->importe, PDO::PARAM_INT);
		$consulta->bindValue(":id", $evento->id, PDO::PARAM_INT);
		$consulta->execute();

		$cantidad = $consulta->rowCount();
		return $cantidad;
	}

	public static function Eliminar($id){
		$conexion = self::CrearConexion();

		$sql = "DELETE FROM eventos
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