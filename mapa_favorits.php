<?php
#Iniciamos la session
session_start(); 

$servername = "localhost";
$username = "root";
$password = "";
$database = "weatherapp";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection error: " . $conn->connect_error);
}

#recogemos el usuario de la session
$user = $_SESSION['user'];

#consulta para recoger las ubicaciones favoritas de un usuario
$sql = "SELECT f.name, f.lat, f.lon 
FROM favorite f 
JOIN user u ON f.user = u.id 
WHERE u.name = '$user'";

$result = $conn->query($sql);

#Creamos un array este se llena con los resultados de la consulta
$favoritos = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $favoritos[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode($favoritos);

$conn->close();
?>
