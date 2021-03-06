<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-type, Accept");

if ($_SERVER['REQUEST_METHOD'] !== "POST") {
	exit("Falha na solicitação: Método inválido!");
}


require './init.php';

$data = file_get_contents("php://input");
$json = json_decode($data);

// echo "<pre>";
// print_r($json);

$id_item = $json->id_item_b;
$id_venda = $json->id_venda_b;
$quantidade = $json->quantidade_b;
$valor_unitario = $json->valor_unitario_b;
$vdesc = $json->vdesc_b;

$sql = "UPDATE `vendas_itens` SET `qtd`='$quantidade', `preco`='$valor_unitario', `vdesc`='$vdesc' WHERE `id` = '$id_item'";
$query = mysqli_query($conexao_banco, $sql)or die(mysqli_error($conexao_banco));

//verifica o total do itens
$sqlItens = mysqli_query($conexao_banco, "SELECT * FROM `vendas_itens` WHERE `id_venda` = '$id_venda'");
$total_itens = 0;
while ($item = mysqli_fetch_assoc($sqlItens)) {
	$total_itens += floatval($item['preco']) * floatval($item['qtd']);
}

mysqli_query($conexao_banco, "UPDATE `vendas` SET `subtotal` = ('$total_itens') WHERE `id` = '$id_venda'");

echo json_encode(array('retorno' => 1));