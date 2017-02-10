<?php
class Pedido_detalle
{
//--------------------------------------------------------------------------------//
//--ATRIBUTOS (No sé por qué tuve que ponerlos public)
	public $id;
	public $id_pedido;
	public $id_item;
	public $id_oferta;
 	public $cantidad;
 	public $precio;
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
	public function GetIdItem()
	{
		return $this->id_item;
	}
	public function GetCantidad()
	{
		return $this->cantidad;
	}
	public function GetIdOferta()
	{
		return $this->id_oferta;
	}
	public function GetPrecio(){
		return $this->precio;
	}

	public function SetId($valor)
	{
		$this->id = $valor;
	}
	public function SetIdPedido($valor)
	{
		$this->id_pedido = $valor;
	}
	public function SetIdItem($valor)
	{
		$this->id_item = $valor;
	}
	public function SetIdOferta($valor)
	{
		$this->id_oferta = $valor;
	}
	public function SetCantidad($valor)
	{
		$this->cantidad = $valor;
	}
	public function SetPrecio($valor){
		$this->precio = $valor;
	}


//--------------------------------------------------------------------------------//
//--CONSTRUCTOR
	public function __construct($id=NULL)
	{
		if($id !== NULL){
			$obj = self::TraerUnPedidoDetallePorId($id);
			$this->id = $obj->GetId();
			$this->id_pedido = $obj->GetIdPedido();
			$this->id_item = $obj->GetIdItem();
			$this->id_oferta = $obj->GetIdOferta();
			$this->cantidad = $obj->GetCantidad();
			$this->precio = $obj->GetPrecio();
		}
	}

//--------------------------------------------------------------------------------//
//--METODO DE CLASE
	public static function TraerUnPedidoDetallePorId($id){
		$conexion = self::CrearConexion();

		$sql = "SELECT U.id, U.id_pedido, U.id_item, U.id_oferta, U.cantidad, U.precio
				FROM pedidos_detalle U
				WHERE U.id = :id";

		$consulta = $conexion->prepare($sql);
		$consulta->bindValue(":id", $id, PDO::PARAM_INT);
		$consulta->execute();

		$oferta = $consulta->fetchObject('Pedido_detalle');
		return $oferta;
	}

	public static function TraerTodosLosPedidosDetalle(){
		$conexion = self::CrearConexion();

		$sql = "SELECT U.id, U.id_pedido, U.id_item, U.id_oferta, U.cantidad, U.precio
				FROM pedidos_detalle U";

		$consulta = $conexion->prepare($sql);
		$consulta->execute();

		$pedidoDetalle = $consulta->fetchall(PDO::FETCH_CLASS, 'Pedido_detalle');
		return $pedidoDetalle;
	}

	public static function Agregar($id_pedido, $pedidoDetalle){
		$conexion = self::CrearConexion();

		$sql = "INSERT INTO pedidos_detalle (id_pedido, id_item, id_oferta, cantidad, precio)
				VALUES (:id_pedido, :id_item, :id_oferta, :cantidad, :precio)";

		$consulta = $conexion->prepare($sql);
		$consulta->bindValue(":id_pedido", $id_pedido, PDO::PARAM_INT);
		$consulta->bindValue(":id_item", $pedidoDetalle->id, PDO::PARAM_INT);
		$consulta->bindValue(":id_oferta", $pedidoDetalle->id_oferta, PDO::PARAM_INT);
		$consulta->bindValue(":cantidad", $pedidoDetalle->cantidad, PDO::PARAM_INT);
		$consulta->bindValue(":precio", $pedidoDetalle->precio, PDO::PARAM_INT);
		$consulta->execute();

		$idAgregado = $conexion->lastInsertId();
		return $idAgregado;
	}

	public static function Modificar($pedidoDetalle){
		$conexion = self::CrearConexion();

		$sql = "UPDATE pedidos_detalle
				SET id_pedido = :id_pedido, id_item = :id_item, id_oferta = id_oferta, cantidad = :cantidad, precio = :precio
				WHERE id = :id";

		$consulta = $conexion->prepare($sql);
		$consulta->bindValue(":id_pedido", $pedidoDetalle->id_pedido, PDO::PARAM_INT);
		$consulta->bindValue(":id_item", $pedidoDetalle->id_item, PDO::PARAM_INT);
		$consulta->bindValue(":id_oferta", $pedidoDetalle->id_oferta, PDO::PARAM_INT);
		$consulta->bindValue(":cantidad", $pedidoDetalle->cantidad, PDO::PARAM_INT);
		$consulta->bindValue(":precio", $pedidoDetalle->precio, PDO::PARAM_INT);
		$consulta->bindValue(":id", $pedidoDetalle->id, PDO::PARAM_INT);
		$consulta->execute();

		$cantidad = $consulta->rowCount();
		return $cantidad;
	}

	public static function Eliminar($id){
		$conexion = self::CrearConexion();

		$sql = "DELETE FROM pedidos_detalle
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