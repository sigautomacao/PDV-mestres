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

// $id_venda 		= $json->id_venda;

$sql = mysqli_query($conexao_banco, "SELECT vendas.cliente, vendas_notifications.* FROM `vendas_notifications` 
	LEFT JOIN vendas ON vendas.id = vendas_notifications.id_venda WHERE `vendas_notifications`.status = 1");


if (mysqli_num_rows($sql) > 0) {
	$notification = mysqli_fetch_assoc($sql);

	echo json_encode(array('retorno' => 1, 'venda' => $notification));
}else{
	echo json_encode(array('retorno' => 0, 'message' => 'Sem notificações'));
}

