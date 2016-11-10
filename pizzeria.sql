-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-11-2016 a las 06:21:38
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

CREATE TABLE `encuestas` (
  `id` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `locales`
--

CREATE TABLE `locales` (
  `id` varchar(2) NOT NULL,
  `direccion` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `locales`
--

INSERT INTO `locales` (`id`, `direccion`) VALUES
('1', 'Av. Mitre 850'),
('2', 'Las Flores 2220'),
('3', 'Alem 1679');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` varchar(5) NOT NULL,
  `descripcion` varchar(50) NOT NULL,
  `categoria` varchar(20) NOT NULL,
  `precio` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `descripcion`, `categoria`, `precio`) VALUES
('1', 'Pizza muzzarella', 'Comida', 80),
('2', 'Agua mineral', 'Bebida', 15),
('3', 'Pizza napolitana', 'Comida', 90),
('4', 'Faina', 'Comida', 10),
('5', 'Empanada carne', 'Comida', 15);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

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
(3, 'Eric', 'Daniels', 'edaniels2@com.com', 'Masculino', 'Encargado', '1234'),
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
(25, 'Prueba', 'Test', '50@prueba.com', 'M', 'Cliente', '1234');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `encuestas`
--
ALTER TABLE `encuestas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `locales`
--
ALTER TABLE `locales`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
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
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
