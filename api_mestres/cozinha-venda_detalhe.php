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

$sql = "SELECT * FROM `vendas` WHERE `id` = '$id_venda'";
$query = mysqli_query($conexao_banco, $sql)or die(mysqli_error($conexao_banco));

$venda = mysqli_fetch_assoc($query);

$vendaPD = array(
   'id_venda' => $venda['id'],
   'cliente' => ($venda['cliente'] != '' && $venda['cliente'] != null) ? $venda['cliente'] : 'Consumidor Final',
   'status' => $venda['status'],
   'data' => $venda['data'],
   'vdesc' => floatval($venda['vdesc']),
   'subtotal' => floatval($venda['subtotal']),
   'total' => floatval($venda['subtotal']) - floatval($venda['vdesc']),
   'obs' => $venda['obs']
);

if ($vendaPD['status'] == 0) {
	exit('Venda Cancelada, não é possível recuperar!');
}

//sql dos itens
$sqlItens = mysqli_query($conexao_banco, "SELECT * FROM `vendas_itens` WHERE `id_venda` = '$id_venda'");

$itens = array();
$vdesc_itens = 0;
while ($item = mysqli_fetch_assoc($sqlItens)) {//looop para tratamento dos dados dos itens

	$itemPD = array( //padrão de dados
		'id_item' => $item['id'],
		'id_venda' => $item['id_venda'],
		'id_produto' => $item['id_produto'],
		'descricao' => $item['descricao'],
		'vdesc' => floatval($item['vdesc']),
		'quantidade' => floatval($item['qtd']),
		'valor_unitario' => floatval($item['preco']),
		'valor_total' => floatval($item['preco']) * floatval($item['qtd']) - floatval($item['vdesc'])
	);

	$itemPD['desc'] = ($itemPD['quantidade']*$itemPD['valor_unitario']);

	if ($itemPD['desc'] > 0) {
		$itemPD['desc'] = ($itemPD['vdesc']/$itemPD['desc']) * 100;
	}else{
		$itemPD['desc'] = 0;
	}

	$vdesc_itens += floatval($item['vdesc']);

	array_push($itens, $itemPD);
}



$vendaPD['itens'] = $itens;

echo json_encode($vendaPD);