<?php
use PHPMailer\PHPMailer\PHPMailer;
require 'vendor/autoload.php';
$defaultMail = "int@scadaint.ru";
$email_addresses = array(
    'Техническая поддержка' => 'support@scadaint.ru',
    'Запрос документации' => 'commerce@scadaint.ru',
    'Запрос пробной версии' => 'commerce@scadaint.ru',
    'Запрос ценового предложения' => 'commerce@scadaint.ru',
    'Запрос на обучение' => 'commerce@scadaint.ru'
);
$mail = new PHPMailer(true);
$mail->isHTML(true);
$mail->CharSet = "UTF-8";
$mail->isSMTP();
$mail->SMTPAuth = false;
$mail->Host = "smtp.elesy.ru";
$mail->Port = 25;
$mail->Username = "";
$mail->Password = "";
$mail->setFrom('noreply.scadaint@scadaint.ru', 'scadaint.ru');
$mail->addAddress($defaultMail);
$body = "<h1>Письмо отправлено с сайта scadaint.ru</h1>";
if(trim(!empty($_POST['NAME']))) {
    $body.='<p><strong>Компания: </strong>' .$_POST['company'].'</p>';
}
if(trim(!empty(isset($email_addresses[$_POST['select']])))) {
    $defaultMail = $email_addresses[$_POST['select']];
    $body.='<p><strong>Цель запроса: </strong>' .$_POST['select'].'</p>';
}
if(trim(!empty($_POST['EMAILTO']))) {
    $body.='<p><strong>ФИО: </strong>' .$_POST['EMAILTO'].'</p>';
}
if(trim(!empty($_POST['email']))) {
    $body.='<p><strong>Email: </strong>' .$_POST['email'].'</p>';
}
if(trim(!empty($_POST['tel']))) {
    $body.='<p><strong>Контактный телефон: </strong>' .$_POST['tel'].'</p>';
}
if(trim(!empty($_POST['message']))) {
    $body.='<p><strong>Сообщение: </strong>' .$_POST['message'].'</p>';
}

$mail->addAddress($defaultMail);
$mail->Body = $body;
if(!$mail->send()) {
    $message = "Error";
} else {
    $message = "Data sends";
}

$response = ['message' => $message];
header('Content-type: application/json');
echo json_encode($response);

?>
