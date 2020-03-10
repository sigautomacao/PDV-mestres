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

// echo '<pre>';
// print_r($json);

$sql = "SELECT * FROM `produtos` WHERE `favorito` > 0 ORDER BY `favorito` ASC";
$query = mysqli_query($conexao_banco, $sql)or die(mysqli_error($conexao_banco));

$produtos = array();
while ($item = mysqli_fetch_assoc($query)) {//looop para tratamento dos dados dos itens
	$itemPD = array( //padrão de dados
		'id_produto' => $item['id'],
		// 'codigo_barras' => $item['cod_barras'],
		// 'referencia' => '',
		'descricao' => $item['descricao'],
		'estoque' => $item['qtd'],
		'valor_unitario' => $item['valor'],
		'foto' => $item['foto']
	);

	array_push($produtos, $itemPD);
}

echo json_encode($produtos);
