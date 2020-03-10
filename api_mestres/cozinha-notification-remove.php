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

$id_notifica 		= $json->id_notifica;

$sql = mysqli_query($conexao_banco, "DELETE FROM `vendas_notifications` WHERE `id` = '$id_notifica'")
or die('Falha ao remover notificação '.mysqli_error($conexao_banco));


echo json_encode(1);
