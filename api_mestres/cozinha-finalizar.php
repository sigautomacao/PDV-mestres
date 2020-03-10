<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-type, Accept");

if ($_SERVER['REQUEST_METHOD'] !== "POST") {
	exit("Falha na solicitação: Método inválido!");
}


require './init.php';

$data = file_get_contents("php://input");
$json = json_decode($data);

date_default_timezone_set('America/Sao_Paulo');
$data = date('Y-m-d H:i:s');

// echo '<pre>';
// print_r($json);
// exit();

$id_venda 		= $json->id_venda;

$sqlVenda = mysqli_query($conexao_banco, "UPDATE `vendas` SET `status_cozinha`='10' WHERE `id` = '$id_venda'");

if ($sqlVenda) {

	//gerar notificação
	mysqli_query($conexao_banco, "INSERT INTO `vendas_notifications` SET `id_venda` = '$id_venda', `status`=1");

	echo json_encode(array('retorno' => 1));
}else{
	echo "Falha ao Finalizar venda." .mysqli_error($conexao_banco);
}