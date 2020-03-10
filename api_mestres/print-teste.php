<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-type, Accept");

if ($_SERVER['REQUEST_METHOD'] !== "POST") {
	exit("Falha na solicitação: Método inválido!");
}

require './init.php';
require './vendor/autoload.php';

// use Mike42\Escpos\PrintConnectors\FilePrintConnector;
use NFePHP\POS\PrintConnectors\Base64PrintConnector;
use Mike42\Escpos\Printer;

//armazena todo o codigo para impressão
$connector = new Base64PrintConnector();

$printer = new Printer($connector);

/* Initialize */
$printer -> initialize();
/* Text */
$printer -> text("HPIStore\n");
$printer -> cut();


/* Font modes */
// $modes = array(
//     Printer::MODE_FONT_B,
//     Printer::MODE_EMPHASIZED,
//     Printer::MODE_DOUBLE_HEIGHT,
//     Printer::MODE_DOUBLE_WIDTH,
//     Printer::MODE_UNDERLINE);
// for ($i = 0; $i < pow(2, count($modes)); $i++) {
//     $bits = str_pad(decbin($i), count($modes), "0", STR_PAD_LEFT);
//     $mode = 0;
//     for ($j = 0; $j < strlen($bits); $j++) {
//         if (substr($bits, $j, 1) == "1") {
//             $mode |= $modes[$j];
//         }
//     }
//     $printer -> selectPrintMode($mode);
//     $printer -> text("HPIStore\n");
// }

// $printer -> selectPrintMode(); // Reset
// $printer -> cut();


/* QR Code - see also the more in-depth demo at qr-code.php */
$testStr = "Testing 123";
$models = array(
    Printer::QR_MODEL_1 => "QR Model 1",
    Printer::QR_MODEL_2 => "QR Model 2 (default)",
    Printer::QR_MICRO => "Micro QR code\n(not supported on all printers)");
foreach ($models as $model => $name) {
    $printer -> qrCode($testStr, Printer::QR_ECLEVEL_L, 3, $model);
    $printer -> text("$name\n");
    $printer -> feed();
}
$printer -> cut();

/* Pulse */
$printer -> pulse();

/* Always close the printer! On some PrintConnectors, no actual
 * data is sent until the printer is closed. */
$printer -> close();


// Obter impressão em base64
$base64 = $connector->getBase64Data();

// Retornar resposta
echo json_encode(array('print_data' => $base64));