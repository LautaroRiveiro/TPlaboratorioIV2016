<?php
class Oferta_prod
{
//--------------------------------------------------------------------------------//
//--ATRIBUTOS (No sé por qué tuve que ponerlos public)
	public $id;
	public $id_oferta;
 	public $id_producto;
 	public $cantidad;
//--------------------------------------------------------------------------------//

//--------------------------------------------------------------------------------//
//--GETTERS Y SETTERS
	public function GetId()
	{
		return $this->id;
	}
	public function GetIdOferta()
	{
		return $this->id_oferta;
	}
	public function GetIdProducto()
	{
		return $this->id_producto;
	}
	public function GetCantidad()
	{
		return $this->cantidad;
	}

	public function SetId($valor)
	{
		$this->id = $valor;
	}
	public function SetIdOferta($valor)
	{
		$this->id_oferta = $valor;
	}
	public function SetIdProducto($valor)
	{
		$this->id_producto = $valor;
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
			$obj = self::TraerUnaOfertaProdPorId($id);
			$this->id = $obj->GetId();
			$this->id_oferta = $obj->GetIdOferta();
			$this->id_producto = $obj->GetIdProducto();
			$this->cantidad = $obj->GetCantidad();
		}
	}

//--------------------------------------------------------------------------------//
//--METODO DE CLASE
	public static function TraerUnaOfertaProdPorId($id){
		$conexion = self::CrearConexion();

		$sql = "SELECT U.id, U.id_oferta, U.id_producto, U.cantidad
				FROM ofertas_prod U
				WHERE U.id = :id";

		$consulta = $conexion->prepare($sql);
		$consulta->bindValue(":id", $id, PDO::PARAM_INT);
		$consulta->execute();

		$oferta = $consulta->fetchObject('Oferta_prod');
		return $oferta;
	}

	public static function TraerTodasLasOfertasProd(){
		$conexion = self::CrearConexion();

		$sql = "SELECT U.id, U.id_oferta, U.id_producto, U.cantidad
				FROM ofertas_prod U";

		$consulta = $conexion->prepare($sql);
		$consulta->execute();

		$ofertaProd = $consulta->fetchall(PDO::FETCH_CLASS, 'Oferta_prod');
		return $ofertaProd;
	}

	public static function Agregar($id_oferta, $ofertaProd, $auxProducto){
		$conexion = self::CrearConexion();

		$sql = "INSERT INTO ofertas_prod (id_oferta, id_producto, cantidad)
				VALUES (:id_oferta, :id_producto, :cantidad)";

		$consulta = $conexion->prepare($sql);
		$consulta->bindValue(":id_oferta", $id_oferta, PDO::PARAM_INT);
		$consulta->bindValue(":id_producto", $ofertaProd->id, PDO::PARAM_INT);
		$consulta->bindValue(":cantidad", $ofertaProd->cantidad, PDO::PARAM_INT);
		$consulta->execute();

		$idAgregado = $conexion->lastInsertId();
		return $idAgregado;
	}

	public static function Modificar($ofertaProd){
		$conexion = self::CrearConexion();

		$sql = "UPDATE ofertas_prod
				SET id_oferta = :id_oferta, id_producto = :id_producto, cantidad = :cantidad
				WHERE id = :id";

		$consulta = $conexion->prepare($sql);
		$consulta->bindValue(":id_oferta", $ofertaProd->id_oferta, PDO::PARAM_INT);
		$consulta->bindValue(":id_producto", $ofertaProd->id_producto, PDO::PARAM_INT);
		$consulta->bindValue(":cantidad", $ofertaProd->cantidad, PDO::PARAM_INT);
		$consulta->bindValue(":id", $ofertaProd->id, PDO::PARAM_INT);
		$consulta->execute();

		$cantidad = $consulta->rowCount();
		return $cantidad;
	}

	public static function Eliminar($id){
		$conexion = self::CrearConexion();

		$sql = "DELETE FROM ofertas_prod
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