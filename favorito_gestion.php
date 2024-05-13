<?php
session_start(); 

$servername = "localhost";
$username = "root";
$password = "";
$database = "weatherapp";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection error: " . $conn->connect_error);
}

$user = $_SESSION['user'];

if ($_SERVER["REQUEST_METHOD"] == "DELETE") {
    $id = $_GET["id"]; 
    $sql = "DELETE FROM favorite WHERE id = $id";
    if ($conn->query($sql) === TRUE) {
        echo "Favorite place deleted successfully";
        exit(); 
    } else {
        echo "Error deleting favorite place: " . $conn->error;
        exit(); 
    }
}

$sql = "SELECT id, name, lat, lon 
FROM favorite 
WHERE user = (SELECT id FROM user WHERE name = '$user')";

$result = $conn->query($sql);
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
