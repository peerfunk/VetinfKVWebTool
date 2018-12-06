<?php


function get_connection(){
	$username = "root";
	$password = "";
	$hostname = "localhost";

	$conn = new mysqli($hostname, $username, $password);
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}
return $conn;
}

function sql_q($sql, $conn){
  return  $conn->query($sql);
}

function get_count($conn, $table){
	$sql = "Select count(*) as cnt from vetinf." . $table;
	$q = sql_q($sql, $conn);
	$count=0;
	while($row = $q->fetch_assoc()) {
		$count=$row["cnt"];	
	}	
	return $count;
}
?>