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
$codigo = $json->codigo;
$qtde = $json->qtde;

$sql = "SELECT * FROM `produtos` WHERE `id` = '$codigo'";
$query = mysqli_query($conexao_banco, $sql)or die(mysqli_error($conexao_banco));

$rows = mysqli_num_rows($query);

if ($rows > 1) { //mais de um produto
	echo "Mais de um produto encontrado!";
}elseif ($rows == 1) { //apenas um produto
	
	$dsProduto = mysqli_fetch_assoc($query); //Dados do produto

	// if ($dsProduto['qtd'] < 1) {
	// 	exit('Produto com estoque zerado!');
	// }

	$id_produto = $dsProduto['id'];
	$descricao = $dsProduto['descricao'];
	$quantidade = $qtde;
	$valor_unitario = $dsProduto['valor'];

	$valor_total = $valor_unitario * $qtde;


	$gravaItem = mysqli_query($conexao_banco, "INSERT INTO `vendas_itens` SET `id_venda`='$id_venda', `id_produto`='$id_produto', `descricao`='$descricao', `qtd`='$quantidade', `preco`='$valor_unitario'")or die(mysqli_error($conexao_banco));
	if ($gravaItem) {
		// atualiza total da venda
		mysqli_query($conexao_banco, "UPDATE `vendas` SET `subtotal` = (`subtotal` + '$valor_total') WHERE `id` = '$id_venda'");

		echo json_encode(array('descricao' => $descricao, 'quantidade' => $quantidade, 'valor_unitario' => $valor_unitario));
	}else{
		echo 'Falha ao inserir o item. '.mysqli_error($conexao_banco);
	}

}else{ //nenhum produto
	echo "Nenhum produto encontrado!";
}