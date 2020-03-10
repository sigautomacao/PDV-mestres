<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-type, Accept");

if ($_SERVER['REQUEST_METHOD'] !== "POST") {
	exit("Falha na solicitação: Método inválido!");
}


require './init.php';

$data = file_get_contents("php://input");
$json = json_decode($data);

// print_r($json);

$id_venda = $json->id_venda;

//Cancela Venda
$sql = mysqli_query($conexao_banco, "UPDATE `vendas` SET `status`=0 WHERE `id` = '$id_venda'")or die(mysqli_error($conexao_banco));


echo json_encode(1);