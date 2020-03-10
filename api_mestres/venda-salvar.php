<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-type, Accept");

if ($_SERVER['REQUEST_METHOD'] !== "POST") {
	exit("Falha na solicitação: Método inválido!");
}


require '../../files/conexao/init.php';

$data = file_get_contents("php://input");
$json = json_decode($data);

date_default_timezone_set('America/Sao_Paulo');
$data = date('Y-m-d H:i:s');

// echo '<pre>';
// print_r($json);
// exit();

$id_venda 		= $json->id_venda;

$id_cliente 	= $json->id_cliente;
$cliente 		= $json->cliente;
$cpf 			= ($json->cpf != '') ? $json->cpf : 0;
$status 		= $json->status;
// $data 			= $json->data;
$id_vendedor 		= $json->vendedor;
$vdesc 			= $json->vdesc;
$total 			= $json->subtotal;

$sqlVenda = mysqli_query($conexao_banco, "UPDATE `vendas` SET `id_cliente`='$id_cliente', `cliente`='$cliente', `cpf`='$cpf', `data`='$data', `id_vendedor`='$id_vendedor', `vdesc`='$vdesc', `valor`='$total' WHERE `id` = '$id_venda'");

if ($sqlVenda) {
	echo json_encode(array('retorno' => 1));
}else{
	echo "Falha ao salvar venda." .mysqli_error($conexao_banco);
	exit();
}