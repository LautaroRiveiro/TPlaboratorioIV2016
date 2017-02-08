<?php
class Evento_detalle
{
//--------------------------------------------------------------------------------//
//--ATRIBUTOS (No sé por qué tuve que ponerlos public)
	public $id;
	public $id_evento;
	public $id_item;
 	public $cantidad;
//--------------------------------------------------------------------------------//

//--------------------------------------------------------------------------------//
//--GETTERS Y SETTERS
	public function GetId()
	{
		return $this->id;
	}
	public function GetIdEvento()
	{
		return $this->id_evento;
	}
	public function GetIdItem()
	{
		return $this->id_item;
	}
	public function GetCantidad()
	{
		return $this->cantidad;
	}


	public function SetId($valor)
	{
		$this->id = $valor;
	}
	public function SetIdEvento($valor)
	{
		$this->id_evento = $valor;
	}
	public function SetIdItem($valor)
	{
		$this->id_item = $valor;
	}
	public function SetCantidad($valor)
	{
		$this->cantidad = $valor;
	}


//--------------------------------------------------------------------------------//
//--CONSTRUCTOR
	public function __construct($id=NULL)
	{
		if($id !== NULL){
			$obj = self::TraerUnEventoDetallePorId($id);
			$this->id = $obj->GetId();
			$this->id_evento = $obj->GetIdEvento();
			$this->id_item = $obj->GetIdItem();
			$this->cantidad = $obj->GetCantidad();
		}
	}

//--------------------------------------------------------------------------------//
//--METODO DE CLASE
	public static function TraerUnEventoDetallePorId($id){
		$conexion = self::CrearConexion();

		$sql = "SELECT U.id, U.id_evento, U.id_item, U.cantidad
				FROM eventos_detalle U
				WHERE U.id = :id";

		$consulta = $conexion->prepare($sql);
		$consulta->bindValue(":id", $id, PDO::PARAM_INT);
		$consulta->execute();

		$oferta = $consulta->fetchObject('Evento_detalle');
		return $oferta;
	}

	public static function TraerTodosLosEventosDetalle(){
		$conexion = self::CrearConexion();

		$sql = "SELECT U.id, U.id_evento, U.id_item, U.cantidad
				FROM eventos_detalle U";

		$consulta = $conexion->prepare($sql);
		$consulta->execute();

		$eventoDetalle = $consulta->fetchall(PDO::FETCH_CLASS, 'Evento_detalle');
		return $eventoDetalle;
	}

	public static function Agregar($id_evento, $eventoDetalle){
		$conexion = self::CrearConexion();

		$sql = "INSERT INTO eventos_detalle (id_evento, id_item, cantidad)
				VALUES (:id_evento, :id_item, :cantidad)";

		$consulta = $conexion->prepare($sql);
		$consulta->bindValue(":id_evento", $id_evento, PDO::PARAM_INT);
		$consulta->bindValue(":id_item", $eventoDetalle->id, PDO::PARAM_INT);
		$consulta->bindValue(":cantidad", $eventoDetalle->cantidad, PDO::PARAM_INT);
		$consulta->execute();

		$idAgregado = $conexion->lastInsertId();
		return $idAgregado;
	}

	public static function Modificar($eventoDetalle){
		$conexion = self::CrearConexion();

		$sql = "UPDATE eventos_detalle
				SET id_evento = :id_evento, id_item = :id_item, cantidad = :cantidad
				WHERE id = :id";

		$consulta = $conexion->prepare($sql);
		$consulta->bindValue(":id_evento", $eventoDetalle->id_evento, PDO::PARAM_INT);
		$consulta->bindValue(":id_item", $eventoDetalle->id_item, PDO::PARAM_INT);
		$consulta->bindValue(":cantidad", $eventoDetalle->cantidad, PDO::PARAM_INT);
		$consulta->bindValue(":id", $eventoDetalle->id, PDO::PARAM_INT);
		$consulta->execute();

		$cantidad = $consulta->rowCount();
		return $cantidad;
	}

	public static function Eliminar($id){
		$conexion = self::CrearConexion();

		$sql = "DELETE FROM eventos_detalle
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