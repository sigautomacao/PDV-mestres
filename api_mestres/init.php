<?php

$host = "localhost";
$user = "root";
$pass = "";
$database = "sig_mestres";

$conexao_banco = mysqli_connect($host, $user, $pass, $database);

if (!$conexao_banco) {
	exit("Falha ao conectar com a base de dados. ".mysqli_error($conexao_banco));
}

mysqli_set_charset($conexao_banco, "uft8");
// $base_url = "https://meuapp.sigautomacao.com/api_meu_app/";