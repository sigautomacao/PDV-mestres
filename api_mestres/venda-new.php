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

$vendedor = $json->usuario->id;

$sql = "INSERT `vendas` SET `status` = '1', `data` = '$data'";
$query = mysqli_query($conexao_banco, $sql)or die(mysqli_error($conexao_banco));


$id_venda = mysqli_insert_id($conexao_banco);


$retorno = array(
   'retorno' => 1,
   'id_venda' => $id_venda
);

echo json_encode($retorno);