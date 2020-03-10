-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 10-Mar-2020 às 14:51
-- Versão do servidor: 10.4.11-MariaDB
-- versão do PHP: 7.4.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `sig_mestres`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `produtos`
--

CREATE TABLE `produtos` (
  `id` int(11) NOT NULL,
  `descricao` varchar(200) DEFAULT NULL,
  `valor` float DEFAULT NULL,
  `qtd` float DEFAULT NULL,
  `favorito` int(11) DEFAULT 0,
  `foto` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `produtos`
--

INSERT INTO `produtos` (`id`, `descricao`, `valor`, `qtd`, `favorito`, `foto`) VALUES
(1, 'Coca-cola Lata', 4, -8, 8, 'assets/imgs/coca.jpg'),
(2, 'X-burguer', 8, -4, 6, 'assets/imgs/burguer.png'),
(3, 'Risoto de camarao', 15, 0, 4, 'assets/imgs/risoto.jpg'),
(4, 'pizza Calabresa Grande', 25, 1, 1, 'assets/imgs/pizza.jpg');

-- --------------------------------------------------------

--
-- Estrutura da tabela `vendas`
--

CREATE TABLE `vendas` (
  `id` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `status_cozinha` int(11) DEFAULT 1,
  `cliente` varchar(500) DEFAULT NULL,
  `subtotal` float DEFAULT 0,
  `vdesc` float DEFAULT 0,
  `total` float DEFAULT 0,
  `obs` text DEFAULT NULL,
  `data` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `vendas_itens`
--

CREATE TABLE `vendas_itens` (
  `id` int(11) NOT NULL,
  `id_venda` int(11) DEFAULT NULL,
  `id_produto` int(11) DEFAULT NULL,
  `descricao` varchar(200) DEFAULT NULL,
  `qtd` float DEFAULT 0,
  `preco` float DEFAULT 0,
  `vdesc` float DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `vendas_notifications`
--

CREATE TABLE `vendas_notifications` (
  `id` int(11) NOT NULL,
  `id_venda` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `vendas_payment`
--

CREATE TABLE `vendas_payment` (
  `id` int(11) NOT NULL,
  `id_venda` int(11) DEFAULT NULL,
  `id_pay` int(11) DEFAULT NULL,
  `forma` varchar(100) DEFAULT NULL,
  `valor` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `produtos`
--
ALTER TABLE `produtos`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `vendas`
--
ALTER TABLE `vendas`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `vendas_itens`
--
ALTER TABLE `vendas_itens`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `vendas_notifications`
--
ALTER TABLE `vendas_notifications`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `vendas_payment`
--
ALTER TABLE `vendas_payment`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `produtos`
--
ALTER TABLE `produtos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `vendas`
--
ALTER TABLE `vendas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `vendas_itens`
--
ALTER TABLE `vendas_itens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `vendas_notifications`
--
ALTER TABLE `vendas_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `vendas_payment`
--
ALTER TABLE `vendas_payment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
