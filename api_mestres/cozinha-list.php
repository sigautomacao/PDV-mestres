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

// print_r($json);

$sql = "SELECT * FROM `vendas` WHERE `status` = '10' AND `status_cozinha`='1' ORDER BY `data` ASC";

$query = mysqli_query($conexao_banco, $sql)or die(mysqli_error($conexao_banco));

$vendas = array();
while ($venda = mysqli_fetch_assoc($query)) {//looop para tratamento dos dados das vendas

	$vendaPD = array( //padrão de dados
		'id_venda' => $venda['id'],
		'cliente' => $venda['cliente'],
		'status' => $venda['status'],
		'status_cozinha' => $venda['status_cozinha'],
		'data' => $venda['data'],
		'vdesc' => $venda['vdesc'],
		'subtotal' => $venda['subtotal'],
		'total' => $venda['subtotal'] - $venda['vdesc']
	);

	//add dentro do array
	array_push($vendas, $vendaPD);
}

echo json_encode($vendas);