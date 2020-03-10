<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-type, Accept");

if ($_SERVER['REQUEST_METHOD'] !== "POST") {
	exit("Falha na solicitação: Método inválido!");
}

require './init.php';
require './vendor/autoload.php';
require './util/functions.php';

// use Mike42\Escpos\PrintConnectors\FilePrintConnector;
use NFePHP\POS\PrintConnectors\Base64PrintConnector;
use Mike42\Escpos\EscposImage;
use Mike42\Escpos\Printer;

//armazena todo o codigo para impressão
$connector = new Base64PrintConnector();

$printer = new Printer($connector);

/* Initialize */
$printer -> initialize();

//Anotação.... Espaçamento é de 49 caracteres para 80mm

$data = file_get_contents("php://input");
$json = json_decode($data);


$id_venda = $json->id_venda;



$dsEmit = array(
	'razao' => 'Mestres da WEB LTDA',
	'fantasia' => 'Mestres da WEB',
	'cnpj' => '17586244000109',
	'logra' => 'Rua dos mestres',
	'nro' => '8080',
	'bairro' => 'https',
	'municipio' => 'Web',
	'uf' => 'SP',
	'cep' => '10101010',
);


$sqlVenda = mysqli_query($conexao_banco, "SELECT * FROM `vendas` WHERE vendas.`id`='$id_venda' LIMIT 1");
$dsVenda = mysqli_fetch_assoc($sqlVenda);


//header ================================================================================================
$printer->setJustification(Printer::JUSTIFY_CENTER);

if (isset($dsEmit['logo']) && ($dsEmit['logo'] != null && $dsEmit['logo'] != '')) {
	// $logo = file_get_contents("../../certificados/".$dsEmit['logo']);
	$logopath = EscposImage::load("../../certificados/05784359000110/logo.png");
	$printer->bitImage($logopath);
}

$printer->setEmphasis(true);
$printer->text($dsEmit['fantasia']."\n");
$printer->setEmphasis(false);

$printer->setFont(Printer::FONT_B);
$printer->text( (strlen($dsEmit['cnpj']) == 11) ? mask($dsEmit['cnpj'], '###.###.###-##') : mask($dsEmit['cnpj'], '##.###.###/####-##')."\n");
$printer->text($dsEmit['logra']. ', '.$dsEmit['nro']. ' - '. $dsEmit['bairro'] ."\n");
$printer->text($dsEmit['municipio']. '/'.$dsEmit['uf']. ' - '. mask($dsEmit['cep'], '##.###-###') ."\n\n\n");

$printer->setFont(Printer::FONT_A);

//Fim header ================================================================================================


//sub Header ================================================================================================
$printer->setEmphasis(true);
$printer->text("Cupom não fiscal \n");
$printer->setEmphasis(false);

$printer->setJustification(Printer::JUSTIFY_LEFT);

$line = str_pad("Cupom:" .$dsVenda['id'], 24, " ", STR_PAD_RIGHT);
$line .= str_pad("Data:" . date('d/m/Y H:m', strtotime($dsVenda['data'])), 24, " ", STR_PAD_LEFT);

$printer->text($line);
//Fim sub Header ================================================================================================

$printer->text(separador());

//Itens do cupom ================================================================================================
$printer->setEmphasis(true);
$line = str_pad(strtoupper("cod"), 7, " ", STR_PAD_RIGHT);
$line .= str_pad(strtoupper("descricao"), 18, " ", STR_PAD_RIGHT);
$line .= str_pad(strtoupper("Qtd."), 9, " ", STR_PAD_RIGHT);
$line .= str_pad(strtoupper("Unit."), 9, " ", STR_PAD_RIGHT);
$line .= str_pad(strtoupper("Total"), 9, " ", STR_PAD_RIGHT);

$printer->text($line."\n");
$printer->setEmphasis(false);

//sql Itens
$sqlItens = mysqli_query($conexao_banco, "SELECT * FROM `vendas_itens` WHERE `id_venda`='$id_venda'");
$count_itens = 0;
$vdesc_itens = 0;
$total_venda = 0;
while ($item = mysqli_fetch_assoc($sqlItens)) {

	$cod = $item['id_produto'];
	$descricao = substr($item['descricao'], 0, 41);
	$quantidade = number_format($item['qtd'],3,',','.');
	$valor_unitario = number_format($item['preco'],2,',','.');
	$total = number_format($item['preco'] * $item['qtd'],2,',','.');

	//somas externas
	$count_itens ++;
	$vdesc_itens += $item['vdesc'];
	$total_venda += $item['preco'] * $item['qtd'];

	$line = str_pad(strtoupper($cod), 7, " ", STR_PAD_RIGHT);
	$line .= str_pad(strtoupper($descricao), 41, " ", STR_PAD_RIGHT);
	$printer->text($line."\n");

	$line = str_pad(strtoupper($quantidade), 28, " ", STR_PAD_LEFT);
	$line .= str_pad(strtoupper($valor_unitario), 10, " ", STR_PAD_LEFT);
	$line .= str_pad(strtoupper($total), 10, " ", STR_PAD_LEFT);
	$printer->text($line."\n");
}

$total_final = $total_venda - $dsVenda['vdesc'] - $vdesc_itens;

$printer->text(separador());

//Fim Itens do cupom ================================================================================================

//Pagamento do cupom ================================================================================================

$printer->setJustification(Printer::JUSTIFY_RIGHT);
$printer->setEmphasis(true);

$line = str_pad("Itens: ", 30, " ", STR_PAD_LEFT);
$line .= str_pad($count_itens, 18, " ", STR_PAD_LEFT);
$printer->text($line."\n");

$line = str_pad("subtotal: ", 30, " ", STR_PAD_LEFT);
$line .= str_pad("R$ ".number_format($total_venda,2,',','.'), 18, " ", STR_PAD_LEFT);
$printer->text($line."\n");

$line = str_pad("Descontos: ", 30, " ", STR_PAD_LEFT);
$line .= str_pad("- R$ ".number_format($dsVenda['vdesc'] + $vdesc_itens,2,',','.'), 18, " ", STR_PAD_LEFT);
$printer->text($line."\n");

$line = str_pad("Total: ", 30, " ", STR_PAD_LEFT);
$line .= str_pad("R$ ".number_format($total_final,2,',','.'), 18, " ", STR_PAD_LEFT);
$printer->text($line."\n");



$printer->setEmphasis(false);

$printer->text(separador('-'));

//sql Payments
$sqlPayments = mysqli_query($conexao_banco, "SELECT * FROM `vendas_payment` WHERE `id_venda`='$id_venda'");
$total_pago = 0;
while ($item = mysqli_fetch_assoc($sqlPayments)) {

	$forma = substr($item['forma'], 0, 41);
	$valor = number_format($item['valor'],2,',','.');

	//somas externas
	$total_pago += $item['valor'];

	$line = str_pad(strtoupper($forma).":", 33, " ", STR_PAD_LEFT);
	$line .= str_pad("R$ ".strtoupper($valor), 15, " ", STR_PAD_LEFT);
	$printer->text($line."\n");
}

$printer->setEmphasis(true);

$printer->text(separador('-'));

$troco = $total_pago - $total_final;

$line = str_pad("Troco:", 33, " ", STR_PAD_LEFT);
$line .= str_pad("R$ ".number_format($troco,2,',','.'), 15, " ", STR_PAD_LEFT);
$printer->text($line."\n");

$printer->setEmphasis(false);

$printer->setJustification(Printer::JUSTIFY_LEFT);

$printer->text(separador('-'));

//Fim Pagamento do cupom ================================================================================================

$printer->text("Cliente: ".strtoupper($dsVenda['cliente']) ."\n");

$printer->text(separador('-'));

//Fim dados do cliente ================================================================================================

$printer->text("Operador: ".strtoupper('Mestre Francisco') ."\n");

$printer->text(separador('-'));

$printer->setJustification(Printer::JUSTIFY_CENTER);

$printer->setFont(Printer::FONT_B);
$printer->text("Powered by Mestres da Web\n");
$printer->setFont(Printer::FONT_A);

// for ($i=0; $i < 5; $i++) { 
	$printer->feed();
// }

$printer->cut();
$printer->close();

// Obter impressão em base64
$base64 = $connector->getBase64Data();

// Retornar resposta
echo json_encode(array('print_data' => $base64));