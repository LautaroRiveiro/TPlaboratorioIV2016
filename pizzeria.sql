-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-02-2017 a las 17:57:30
-- Versión del servidor: 10.1.10-MariaDB
-- Versión de PHP: 5.6.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `pizzeria`
--
CREATE DATABASE IF NOT EXISTS `pizzeria` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `pizzeria`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `encuestas`
--

DROP TABLE IF EXISTS `encuestas`;
CREATE TABLE `encuestas` (
  `id` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eventos`
--

DROP TABLE IF EXISTS `eventos`;
CREATE TABLE `eventos` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha` varchar(100) NOT NULL,
  `importe` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `eventos`
--

INSERT INTO `eventos` (`id`, `id_usuario`, `fecha`, `importe`) VALUES
(1, 13, '2017-02-11T03:00:00.000Z', 125),
(2, 13, '2017-02-12T03:00:00.000Z', 110);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eventos_detalle`
--

DROP TABLE IF EXISTS `eventos_detalle`;
CREATE TABLE `eventos_detalle` (
  `id` int(11) NOT NULL,
  `id_evento` int(11) NOT NULL,
  `id_item` int(11) NOT NULL,
  `cantidad` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `eventos_detalle`
--

INSERT INTO `eventos_detalle` (`id`, `id_evento`, `id_item`, `cantidad`) VALUES
(1, 2, 1, 1),
(2, 2, 2, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `locales`
--

DROP TABLE IF EXISTS `locales`;
CREATE TABLE `locales` (
  `id` int(11) UNSIGNED NOT NULL,
  `direccion` varchar(100) NOT NULL,
  `cp` varchar(10) NOT NULL,
  `foto1` varchar(50) NOT NULL DEFAULT 'sinfoto.jpg',
  `foto2` varchar(50) NOT NULL DEFAULT 'sinfoto.jpg',
  `foto3` varchar(50) NOT NULL DEFAULT 'sinfoto.jpg'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `locales`
--

INSERT INTO `locales` (`id`, `direccion`, `cp`, `foto1`, `foto2`, `foto3`) VALUES
(1, 'Av. Bartolomé Mitre 850', 'Avellaneda', 'sinfoto.jpg', 'sinfoto.jpg', 'sinfoto.jpg'),
(2, 'Av. Las Flores 891', 'Wilde', 'sinfoto.jpg', 'sinfoto.jpg', 'sinfoto.jpg'),
(3, 'Av. Leandro N. Alem 800', 'CABA', 'sinfoto.jpg', 'sinfoto.jpg', 'sinfoto.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ofertas`
--

DROP TABLE IF EXISTS `ofertas`;
CREATE TABLE `ofertas` (
  `id` int(11) NOT NULL,
  `descripcion` varchar(100) NOT NULL,
  `descuento` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `ofertas`
--

INSERT INTO `ofertas` (`id`, `descripcion`, `descuento`) VALUES
(8, 'Gde Muzza x2 y Agua', 25),
(9, 'Napolitana   Faina   2 Helados', 10),
(10, 'Porción Fugazzeta, 2 Empanadas de Carne y Agua', 50);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ofertas_prod`
--

DROP TABLE IF EXISTS `ofertas_prod`;
CREATE TABLE `ofertas_prod` (
  `id` int(11) NOT NULL,
  `id_oferta` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `ofertas_prod`
--

INSERT INTO `ofertas_prod` (`id`, `id_oferta`, `id_producto`, `cantidad`) VALUES
(3, 8, 1, 2),
(4, 8, 2, 1),
(5, 9, 3, 1),
(6, 9, 4, 1),
(7, 9, 6, 2),
(8, 10, 2, 1),
(9, 10, 5, 2),
(10, 10, 7, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
CREATE TABLE `pedidos` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_local` int(11) NOT NULL,
  `fecha` varchar(100) NOT NULL,
  `importe` int(11) NOT NULL,
  `estado` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id`, `id_usuario`, `id_local`, `fecha`, `importe`, `estado`) VALUES
(1, 1, 1, '2017-02-06T19:30:25.875Z', 95, 'Entregado'),
(2, 1, 1, '2017-02-06T19:38:31.956Z', 80, 'Pedido'),
(3, 1, 1, '2017-02-06T19:38:39.515Z', 80, 'Entregado'),
(4, 1, 1, '2017-02-06T19:39:15.051Z', 90, 'Cancelado'),
(5, 1, 1, '2017-02-06T20:13:17.637Z', 91, 'Pedido'),
(6, 1, 1, '2017-02-06T20:13:53.893Z', 91, 'Entregado'),
(7, 1, 1, '2017-02-06T20:14:31.925Z', 91, 'Pedido'),
(8, 1, 1, '2017-02-06T20:16:17.797Z', 90, 'Pedido'),
(9, 1, 1, '2017-02-06T20:16:41.077Z', 30, 'Pedido'),
(10, 1, 1, '2017-02-06T20:17:29.933Z', 105, 'Pedido'),
(11, 1, 1, '2017-02-06T20:17:56.045Z', 10, 'Pedido'),
(12, 1, 1, '2017-02-09T16:36:28.223Z', 80, 'Pedido'),
(13, 1, 2, '2017-02-09T16:39:46.433Z', 11, 'Pedido'),
(14, 1, 1, '2017-02-09T16:56:40.881Z', 30, 'Pedido'),
(15, 1, 3, '2017-02-09T17:03:40.354Z', 131, 'Pedido'),
(16, 1, 1, '2017-02-09T17:04:01.722Z', 37, 'Pedido'),
(17, 1, 2, '2017-02-09T17:06:47.113Z', 131, 'Pedido'),
(18, 1, 1, '2017-02-09T17:14:26.514Z', 131, 'Pedido'),
(19, 1, 1, '2017-02-09T17:19:45.578Z', 168, 'Pedido'),
(20, 1, 3, '2017-02-09T17:22:35.370Z', 318, 'Pedido'),
(21, 1, 3, '2017-02-09T22:32:51.343Z', 189, 'Pedido'),
(22, 1, 2, '2017-02-09T22:36:08.590Z', 117, 'Pedido'),
(23, 1, 3, '2017-02-09T23:04:07.352Z', 151, 'Pedido'),
(24, 1, 3, '2017-02-09T23:05:56.904Z', 131, 'Pedido'),
(25, 1, 1, '2017-02-09T23:07:36.457Z', 153, 'Pedido'),
(26, 1, 3, '2017-02-09T23:08:57.448Z', 169, 'Pedido'),
(27, 1, 1, '2017-02-09T23:10:30.504Z', 269, 'Pedido');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos_detalle`
--

DROP TABLE IF EXISTS `pedidos_detalle`;
CREATE TABLE `pedidos_detalle` (
  `id` int(11) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `id_item` int(11) NOT NULL,
  `id_oferta` int(11) NOT NULL,
  `cantidad` int(2) NOT NULL,
  `precio` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `pedidos_detalle`
--

INSERT INTO `pedidos_detalle` (`id`, `id_pedido`, `id_item`, `id_oferta`, `cantidad`, `precio`) VALUES
(1, 7, 1, 0, 1, 0),
(2, 7, 6, 0, 1, 0),
(3, 8, 3, 0, 1, 0),
(4, 9, 2, 0, 1, 0),
(5, 9, 5, 0, 1, 0),
(6, 10, 2, 0, 1, 0),
(7, 10, 3, 0, 1, 0),
(8, 11, 4, 0, 1, 0),
(12, 13, 6, 0, 1, 0),
(15, 0, 7, 0, 1, 0),
(18, 14, 5, 0, 2, 0),
(24, 19, 2, 0, 1, 0),
(25, 19, 6, 0, 2, 0),
(27, 20, 6, 0, 1, 0),
(28, 20, 7, 0, 1, 0),
(32, 22, 1, 0, 1, 0),
(33, 23, 4, 0, 2, 10),
(34, 24, 6, 0, 2, 11),
(35, 25, 6, 0, 2, 11),
(36, 26, 7, 0, 2, 30),
(37, 27, 1, 0, 2, 80),
(38, 27, 3, 9, 1, 90),
(39, 27, 4, 9, 1, 10),
(40, 27, 6, 9, 1, 11);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos_oferta`
--

DROP TABLE IF EXISTS `pedidos_oferta`;
CREATE TABLE `pedidos_oferta` (
  `id` int(11) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `id_oferta` int(11) NOT NULL,
  `cantidad` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `pedidos_oferta`
--

INSERT INTO `pedidos_oferta` (`id`, `id_pedido`, `id_oferta`, `cantidad`) VALUES
(1, 21, 9, 1),
(2, 22, 10, 1),
(3, 23, 8, 1),
(4, 24, 9, 1),
(5, 25, 8, 1),
(6, 26, 9, 1),
(7, 27, 9, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

DROP TABLE IF EXISTS `productos`;
CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `descripcion` varchar(50) NOT NULL,
  `categoria` varchar(20) NOT NULL,
  `precio` int(3) NOT NULL,
  `foto1` varchar(100) NOT NULL,
  `foto2` varchar(100) NOT NULL,
  `foto3` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `descripcion`, `categoria`, `precio`, `foto1`, `foto2`, `foto3`) VALUES
(1, 'Pizza muzzarella', 'Comida', 80, 'sinfoto.jpg', 'sinfoto.jpg', 'sinfoto.jpg'),
(2, 'Agua mineral', 'Bebida', 15, 'sinfoto.jpg', 'sinfoto.jpg', 'sinfoto.jpg'),
(3, 'Pizza napolitana', 'Comida', 90, 'sinfoto.jpg', 'sinfoto.jpg', 'sinfoto.jpg'),
(4, 'Faina', 'Comida', 10, 'sinfoto.jpg', 'sinfoto.jpg', 'sinfoto.jpg'),
(5, 'Empanada carne', 'Comida', 15, 'sinfoto.jpg', 'sinfoto.jpg', 'sinfoto.jpg'),
(6, 'helado', 'Postre', 11, 'sinfoto.jpg', 'sinfoto.jpg', 'sinfoto.jpg'),
(7, 'Porción de fugazzeta rellena', 'Comida', 30, 'slider_small_03.jpg', 'sinfoto.jpg', 'sinfoto.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas`
--

DROP TABLE IF EXISTS `reservas`;
CREATE TABLE `reservas` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_local` int(11) NOT NULL,
  `fecha` varchar(100) NOT NULL,
  `cantidad` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `reservas`
--

INSERT INTO `reservas` (`id`, `id_usuario`, `id_local`, `fecha`, `cantidad`) VALUES
(1, 0, 3, '2017-02-10T13:15:00.000Z', 2),
(2, 13, 2, '2017-02-10T13:10:00.000Z', 1),
(3, 0, 3, '2017-02-18T13:10:00.000Z', 5),
(4, 13, 1, '2017-02-10T17:30:00.000Z', 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id` int(11) UNSIGNED NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `apellido` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `sexo` varchar(50) DEFAULT NULL,
  `perfil` varchar(15) DEFAULT NULL,
  `password` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `apellido`, `email`, `sexo`, `perfil`, `password`) VALUES
(1, 'Administrador', 'Administrador', 'admin@admin.com', 'Masculino', 'Administrador', '1234'),
(2, 'Brian', 'Freeman', 'encargado@encargado.com', 'Masculino', 'Encargado', '1234'),
(3, 'Eric', 'Daniels', 'edaniels23@com.com', 'Masculino', 'Empleado', '1234'),
(4, 'Lisa', 'Burke', 'lburke3@ezinearticles.com', 'Femenino', 'Encargado', '1234'),
(5, 'Julie', 'Mccoy', 'empleado@empleado.com', 'Femenino', 'Empleado', '1234'),
(6, 'Robert', 'Bell', 'rbell5@fc2.com', 'Masculino', 'Empleado', '1234'),
(7, 'Donald', 'Harris', 'dharris6@blogtalkradio.com', 'Masculino', 'Empleado', '1234'),
(8, 'Judith', 'Ross', 'jross7@freewebs.com', 'Femenino', 'Empleado', '1234'),
(9, 'Mildred', 'Lane', 'mlane8@wikispaces.com', 'Femenino', 'Empleado', '1234'),
(10, 'Howard', 'Collins', 'hcollins9@tamu.edu', 'Masculino', 'Empleado', '1234'),
(11, 'Nicole', 'Little', 'nlittlea@oakley.com', 'Femenino', 'Empleado', '1234'),
(12, 'Phyllis', 'Robertson', 'probertsonb@sogou.com', 'Femenino', 'Empleado', '1234'),
(13, 'Brenda', 'Meyer', 'cliente@cliente.com', 'Femenino', 'Cliente', '1234'),
(14, 'Todd', 'Cook', 'tcookd@globo.com', 'Masculino', 'Cliente', '1234'),
(15, 'Benjamin', 'Peters', 'bpeterse@newyorker.com', 'Masculino', 'Cliente', '1234'),
(16, 'Matthew', 'Marshall', 'mmarshallf@nps.gov', 'Masculino', 'Cliente', '1234'),
(17, 'Douglas', 'Rice', 'driceg@g.co', 'Masculino', 'Cliente', '1234'),
(18, 'Joyce', 'Woods', 'jwoodsh@php.net', 'Femenino', 'Cliente', '1234'),
(19, 'Fred', 'Mcdonald', 'fmcdonaldi@phoca.cz', 'Masculino', 'Cliente', '1234'),
(20, 'Philip', 'Jones', 'pjonesj@de.vu', 'Masculino', 'Cliente', '1234'),
(21, 'Prueba', 'Test', '44@prueba.com', 'M', 'Cliente', '1234'),
(22, 'Prueba', 'Test', '88@prueba.com', 'M', 'Cliente', '1234'),
(23, 'Prueba', 'Test', '997@prueba.com', 'M', 'Cliente', '1234'),
(24, 'Prueba', 'Test', '33@prueba.com', 'M', 'Cliente', '1234'),
(25, 'Prueba', 'Test', '50@prueba.com', 'M', 'Cliente', '1234'),
(26, 'Prueba', 'Test', '1@prueba.com', 'M', 'Cliente', '1234'),
(27, 'Prueba', 'Test', 'pepa@prueba.com', 'F', 'Cliente', '1234');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `encuestas`
--
ALTER TABLE `encuestas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `eventos`
--
ALTER TABLE `eventos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `eventos_detalle`
--
ALTER TABLE `eventos_detalle`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `locales`
--
ALTER TABLE `locales`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `ofertas`
--
ALTER TABLE `ofertas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `id_2` (`id`);

--
-- Indices de la tabla `ofertas_prod`
--
ALTER TABLE `ofertas_prod`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pedidos_detalle`
--
ALTER TABLE `pedidos_detalle`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pedidos_oferta`
--
ALTER TABLE `pedidos_oferta`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `eventos`
--
ALTER TABLE `eventos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT de la tabla `eventos_detalle`
--
ALTER TABLE `eventos_detalle`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT de la tabla `locales`
--
ALTER TABLE `locales`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT de la tabla `ofertas`
--
ALTER TABLE `ofertas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT de la tabla `ofertas_prod`
--
ALTER TABLE `ofertas_prod`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
--
-- AUTO_INCREMENT de la tabla `pedidos_detalle`
--
ALTER TABLE `pedidos_detalle`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;
--
-- AUTO_INCREMENT de la tabla `pedidos_oferta`
--
ALTER TABLE `pedidos_oferta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT de la tabla `reservas`
--
ALTER TABLE `reservas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
