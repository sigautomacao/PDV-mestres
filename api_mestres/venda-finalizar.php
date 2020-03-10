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

$id_venda 		= $json->venda->id_venda;

// $id_cliente 	= $json->venda->id_cliente;
$cliente 		= $json->venda->cliente;
// $cpf 			= ($json->venda->cpf != '') ? $json->venda->cpf : 0;
$status 		= $json->venda->status;
// $data 			= $json->venda->data;
// $id_vendedor 		= $json->venda->vendedor;
$vdesc 			= $json->venda->vdesc;
$subtotal 		= $json->venda->subtotal;
$total 			= $json->venda->total;
$obs 			= (isset($json->venda->obs)) ? $json->venda->obs : '';



$payments = $json->paymentsCurrent;


//pagamentos
foreach ($payments as $payment) {

	$id_forma = $payment->id_pay;
	$forma = $payment->descricao;
	$valor = $payment->valor;

	$sqlPayments = "INSERT INTO `vendas_payment` SET `id_venda`='$id_venda', `id_pay`='$id_forma', `forma`='$forma', `valor`='$valor'";
	$queryPayments = mysqli_query($conexao_banco, $sqlPayments);

	if ($queryPayments) {
		
	}else{
		echo "Falha ao processar os pagamentos." .mysqli_error($conexao_banco);
		//Deleta os pagamentos ja processados
		mysqli_query($conexao_banco, "DELETE FROM `vendas_payment` WHERE `id_venda` = '$id_venda'");
		exit();
	}

}


//estoque
$sqlItens = mysqli_query($conexao_banco, "SELECT * FROM `vendas_itens` WHERE `id_venda` = '$id_venda'");
while ($item = mysqli_fetch_assoc($sqlItens)) {
	$codigo = $item['id_produto'];
	$qtde = $item['qtd'];
	//altera o estoque
	mysqli_query($conexao_banco, "UPDATE `produtos` SET `qtd`=(`qtd` - '$qtde') WHERE `id` = '$codigo'");
}

$sqlVenda = mysqli_query($conexao_banco, "UPDATE `vendas` SET `cliente`='$cliente', `status`='10', `data`='$data', `vdesc`='$vdesc', `subtotal`='$subtotal' , `total`='$total', `obs`='$obs' WHERE `id` = '$id_venda'");

if ($sqlVenda) {
	echo json_encode(array('retorno' => 1));
}else{
	echo "Falha ao Finalizar venda." .mysqli_error($conexao_banco);


	//Deleta os pagamentos ja processados
	mysqli_query($conexao_banco, "DELETE FROM `vendas_payment` WHERE `id_venda` = '$id_venda'"); 
	exit();
}