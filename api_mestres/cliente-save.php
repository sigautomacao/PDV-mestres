<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-type, Accept");

if ($_SERVER['REQUEST_METHOD'] !== "POST") {
	exit("Falha na solicitação: Método inválido!");
}


require './init.php';

$data = file_get_contents("php://input");
$json = json_decode($data);

// date_default_timezone_set('America/Sao_Paulo');
// $data = date('Y-m-d H:i:s');

$id_venda = $json->id_venda;
// $id_cliente = $json->id_cliente;
$cliente = $json->cliente;
// $cpf = (isset($json->cpf)) ? $json->cpf : '0';

$sql = "UPDATE `vendas` SET `cliente`='$cliente' WHERE `id`='$id_venda'";
$query = mysqli_query($conexao_banco, $sql)or die(mysqli_error($conexao_banco));


echo json_encode(1);