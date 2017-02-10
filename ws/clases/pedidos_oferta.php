<?php
class Pedido_oferta
{
//--------------------------------------------------------------------------------//
//--ATRIBUTOS (No sé por qué tuve que ponerlos public)
	public $id;
	public $id_pedido;
	public $id_oferta;
 	public $cantidad;
//--------------------------------------------------------------------------------//

//--------------------------------------------------------------------------------//
//--GETTERS Y SETTERS
	public function GetId()
	{
		return $this->id;
	}
	public function GetIdPedido()
	{
		return $this->id_pedido;
	}
	public function GetIdOferta()
	{
		return $this->id_oferta;
	}
	public function GetCantidad()
	{
		return $this->cantidad;
	}


	public function SetId($valor)
	{
		$this->id = $valor;
	}
	public function SetIdPedido($valor)
	{
		$this->id_pedido = $valor;
	}
	public function SetIdOferta($valor)
	{
		$this->id_oferta = $valor;
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
			$obj = self::TraerUnPedidoOfertaPorId($id);
			$this->id = $obj->GetId();
			$this->id_pedido = $obj->GetIdPedido();
			$this->id_oferta = $obj->GetIdOferta();
			$this->cantidad = $obj->GetCantidad();
		}
	}

//--------------------------------------------------------------------------------//
//--METODO DE CLASE
	public static function TraerUnPedidoOfertaPorId($id){
		$conexion = self::CrearConexion();

		$sql = "SELECT U.id, U.id_pedido, U.id_oferta, U.cantidad
				FROM pedidos_oferta U
				WHERE U.id = :id";

		$consulta = $conexion->prepare($sql);
		$consulta->bindValue(":id", $id, PDO::PARAM_INT);
		$consulta->execute();

		$oferta = $consulta->fetchObject('Pedido_oferta');
		return $oferta;
	}

	public static function TraerTodosLosPedidosOferta(){
		$conexion = self::CrearConexion();

		$sql = "SELECT U.id, U.id_pedido, U.id_oferta, U.cantidad
				FROM pedidos_oferta U";

		$consulta = $conexion->prepare($sql);
		$consulta->execute();

		$pedidoOferta = $consulta->fetchall(PDO::FETCH_CLASS, 'Pedido_oferta');
		return $pedidoOferta;
	}

	public static function Agregar($id_pedido, $pedidoOferta){
		$conexion = self::CrearConexion();

		$sql = "INSERT INTO pedidos_oferta (id_pedido, id_oferta, cantidad)
				VALUES (:id_pedido, :id_oferta, :cantidad)";

		$consulta = $conexion->prepare($sql);
		$consulta->bindValue(":id_pedido", $id_pedido, PDO::PARAM_INT);
		$consulta->bindValue(":id_oferta", $pedidoOferta->id, PDO::PARAM_INT);
		$consulta->bindValue(":cantidad", $pedidoOferta->cantidad, PDO::PARAM_INT);
		$consulta->execute();

		$idAgregado = $conexion->lastInsertId();
		return $idAgregado;
	}

	public static function Modificar($pedidoOferta){
		$conexion = self::CrearConexion();

		$sql = "UPDATE pedidos_oferta
				SET id_pedido = :id_pedido, id_oferta = :id_oferta, cantidad = :cantidad
				WHERE id = :id";

		$consulta = $conexion->prepare($sql);
		$consulta->bindValue(":id_pedido", $pedidoOferta->id_pedido, PDO::PARAM_INT);
		$consulta->bindValue(":id_oferta", $pedidoOferta->id_oferta, PDO::PARAM_INT);
		$consulta->bindValue(":cantidad", $pedidoOferta->cantidad, PDO::PARAM_INT);
		$consulta->bindValue(":id", $pedidoOferta->id, PDO::PARAM_INT);
		$consulta->execute();

		$cantidad = $consulta->rowCount();
		return $cantidad;
	}

	public static function Eliminar($id){
		$conexion = self::CrearConexion();

		$sql = "DELETE FROM pedidos_oferta
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