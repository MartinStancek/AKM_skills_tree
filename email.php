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
$treesLabels = json_decode(file_get_contents(__DIR__ . "/src/data/trees.json"));
try {
    if($_SERVER['REQUEST_METHOD'] != "POST"){
        throw new Exception("Http method {$_SERVER['REQUEST_METHOD']} is not allowed");
    }

    $treeData = json_decode($_POST["jsonData"]);


    $mailBody = "<h2>Sumarizácia skills: </h2>";
    $mailAltBody = "Sumarizácia skills:\r\n\r\n";
    /*array(2) { 
    [0]=> object(stdClass)#1 (2) { ["tId"]=> int(1) ["elems"]=> array(3) { [0]=> string(1) "1" [1]=> string(1) "5" [2]=> string(1) "2" } } 
    [1]=> object(stdClass)#2 (2) { ["tId"]=> int(1) ["elems"]=> array(0) { } } }
*/
    foreach ($treeData as &$treeObj) {
        $treeObjResolved = NULL;
        foreach ($treesLabels as &$treesLabelsObj) {
            if($treesLabelsObj->id == $treeObj->tId){
                $treeObjResolved = $treesLabelsObj;
                break;
            }
        }
        $treeInfoArr = json_decode(file_get_contents(__DIR__ . "/src/data/" . $treeObjResolved->fileName));


        $mailBody .="<h3>" . $treeObjResolved->displayName . "</h3>";
        $mailAltBody .= $treeObjResolved->displayName . "\r\n";
        $mailBody .="<ul>";


        foreach ($treeObj->elems as &$treeId) {
            $treeInfoResolved = NULL;
            foreach ($treeInfoArr as &$treeInfoObj) {
                if($treeInfoObj->id == $treeId){
                    $treeInfoResolved = $treeInfoObj;
                    break;
                }
            }


            $mailBody .="<li>" . $treeInfoResolved->name . "</li>";
            $mailAltBody .= "\t- " . $treeInfoResolved->name . "\r\n";

        }
        $mailBody .="</ul>";
        $mailAltBody .= "\r\n";
        // $mailBody .="<br><br>";

    }
    if(file_exists(__DIR__ . "/../smtp-config.ini")){
        // echo fileperms(__DIR__ . "/../smtp-config.ini");
    }
    else {
        throw new Exception("File {__DIR__}./smtp-config.ini does not exists.");
    }

    $config = parse_ini_file(__DIR__  . "/../smtp-config.ini", true);
    // print_r($config);
    // var_dump($config);
    if(!$config){
        throw new Exception("Unable to load mail configuration.");
    }
    // echo json_encode($config);

    //Create an instance; passing `true` enables exceptions
    $mail = new PHPMailer(true);


    //Server settings
    // $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
    $mail->isSMTP();                                            //Send using SMTP
    $mail->Host       = $config['smtp']['host'];                //Set the SMTP server to send through
    $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
    $mail->Username   = $config['smtp']['login'];      //SMTP username
    $mail->Password   = $config['smtp']['password'];                           //SMTP password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;            //Enable implicit TLS encryption
    $mail->Port       = 587;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

    //Recipients
    $mail->setFrom($config['smtp']['emailFrom'], $config['smtp']['nameFrom']);
    $mail->addAddress($_POST["email"], $_POST["name"]);     //Add a recipient //Name is optional
    // $mail->addReplyTo('skillstrees@kritickemyslenie.sk', 'Information');
    if(isset($_POST['contact-back']) == "on"){
        $mail->addBcc($config['smtp']['bccAddress']);
    }

    //Attachments
    // $mail->addAttachment('/var/tmp/file.tar.gz');         //Add attachments
    // $mail->addAttachment('/tmp/image.jpg', 'new.jpg');    //Optional name

    //Content
    $mail->isHTML(true);                                  //Set email format to HTML
    $mail->Subject = 'Sumarizácia skills';
    $mail->Body    = $mailBody;
    $mail->AltBody = $mailAltBody;
    $mail->CharSet = "UTF-8";

    $mail->send();
    // echo 'Message has been sent';
    $resultMessage = "Úspech";
} catch (Exception $e) {
    $resultMessage = "Chyba aplikácie";
    $errorMessage = "Message could not be sent. Mailer Error: {$mail->ErrorInfo} <br><br> Detailed message: <br> {$e->getMessage()}";
}
?>

	<div id="send-email-content">
		<div id="send-email-header"> <?php echo $resultMessage?></div>
		<div id="send-email-message"> Na emailovu adresu <b><i><?php echo $_POST["email"]?></i></b> <?php echo $resultMessage == 'Úspech' ? 'bol odoslany' : "sa nepodarilo odoslať" ?> email s vyplnenymi udajmi. </div>
		<div id="send-email-name"> Vase meno: <?php echo $_POST["name"]?></div>
		<div id="send-email-contact"> <?php echo isset($_POST['contact-back']) == 1 ? "Budeme vas kontaktovat" : "Vzhladom na to ze ste nezaciarkli suhlas so spatnym kontaktovanim, mozne nas pripade otazok kontaktovat na emailovu adresu aaa@blabla.sk";?>
		<button id="send-email-button" onclick="closeSummaryPopup({'srcElement':{'id':'close-popup-area-summary'}})">Zavrieť</button>
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


