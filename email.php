<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" type="text/css" href="src/css/email.css" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

</head>
<body>
<?php
//Import PHPMailer classes into the global namespace
//These must be at the top of your script, not inside a function
require 'src/php/PHPMailer.php';
require 'src/php/SMTP.php';
require 'src/php/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;



//Load Composer's autoloader
// require 'vendor/autoload.php';

//Create an instance; passing `true` enables exceptions
$mail = new PHPMailer(true);

try {
    //Server settings
    $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
    $mail->isSMTP();                                            //Send using SMTP
    $mail->Host       = 'smtp.example.com';                     //Set the SMTP server to send through
    $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
    $mail->Username   = 'user@example.com';                     //SMTP username
    $mail->Password   = 'secret';                               //SMTP password
    // $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
    $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

    //Recipients
    $mail->setFrom('from@example.com', 'Mailer');
    $mail->addAddress('joe@example.net', 'Joe User');     //Add a recipient
    $mail->addAddress('ellen@example.com');               //Name is optional
    $mail->addReplyTo('info@example.com', 'Information');
    $mail->addCC('cc@example.com');
    $mail->addBCC('bcc@example.com');

    //Attachments
    // $mail->addAttachment('/var/tmp/file.tar.gz');         //Add attachments
    // $mail->addAttachment('/tmp/image.jpg', 'new.jpg');    //Optional name

    //Content
    $mail->isHTML(true);                                  //Set email format to HTML
    $mail->Subject = 'Here is the subject';
    $mail->Body    = 'This is the HTML message body <b>in bold!</b>';
    $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

    $mail->send();
    // echo 'Message has been sent';
    $resultMessage = "Úspech";
} catch (Exception $e) {
    $errorMessage = "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    $resultMessage = "Chyba aplikácie";
}
?>
	<div id="send-email-content">
		<div id="send-email-header"> <?php echo $resultMessage?></div>
		<div id="send-email-message"> Na emailovu adresu <b><i><?php echo $_POST["email"]?></i></b> <?php echo $resultMessage == 'Úspech' ? 'bol odoslany' : "sa nepodarilo odoslať" ?> email s vyplnenymi udajmi. </div>
		<div id="send-email-name"> Vase meno: <?php echo $_POST["name"]?></div>
		<div id="send-email-contact"> <?php echo isset($_POST['contact-back']) == 1 ? "Budeme vas kontaktovat" : "Vzhladom na to ze ste nezaciarkli suhlas so spatnym kontaktovanim, mozne nas pripade otazok kontaktovat na emailovu adresu aaa@blabla.sk";?>
		<div id="send-email-button"><a href="/">Späť na domovskú obrazovku</a></div>
		<div id="send-email-error"> <?php echo $errorMessage?> </div>

	</div>
	<?php

// echo 'name: ';
// echo $_POST["name"];
// echo '<br>';
// echo 'email: ';
// echo $_POST["email"];
// echo '<br>';
// echo 'suhlas: ';
// echo isset($_POST['contact-back']) == 1 ? "true" : "false";
// echo '<br>';
// echo '<a href="/">return to site</a>';
// echo '<br>';
// echo '<br>';
// ?>

</body>
</html>


