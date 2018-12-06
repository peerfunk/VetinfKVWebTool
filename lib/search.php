<?php
require ('db_handler.php');
$conn = get_connection();
search($conn);

function search($conn){
	if($_GET['id'] == "M"){
		$sql = search_string_m($_GET['search'], $_GET['level']);	
	}else if($_GET['id'] == "L"){
		$sql = search_string_l($_GET['search'], $_GET['level']);
	}
	$q = sql_q($sql, $conn);
	create_table($q);
}

function get_searchlevel($search, $level){
	switch($level){
		case "": return  '%' . $search . '%' ;	break;
		case 2:  return  '%'. $search . '%';	break;
		case 0:  return   $search;			break;
		case 1:  return  '%'.  $search  ;	break;
		case 3:  return   $search  .'%' ;	break;
	}
}

function search_string_m($search, $level){
	if($search != ""){
		return "Select bez, vkempf as preis, concat(vpanz  , ' ' , vpeinh) as einheit  from vetinf.vetmedat where upper(bez) LIKE  '" . strtoupper(get_searchlevel($search, $level)) . "' order by bez asc;";
	}
	return "Select bez, vkempf as preis , concat(vpanz  , ' ' , vpeinh) as einheit  from vetinf.vetmedat order by bez asc";
}
function search_string_l($search, $level){
	if($search != ""){
		return "Select kubez as bez , preis, '1 Mal' as einheit  from vetinf.vetledat where upper(kubez) LIKE  '" . strtoupper(get_searchlevel($search, $level)) ."' order by kubez asc;";
	}
	return "Select kubez as bez, preis , '1 Mal' as einheit from vetinf.vetledat order by kubez asc";
}

function create_table($res){
	echo '<table class="_bashic-shadow"><thead><tr id="head"><th>Beschreibung</th><th>Anzahl</th><th>Menge</th><th>VkP(€)</th><th>Sum(€)</th></tr></thead>';
	while($row = $res->fetch_assoc()) {
	echo '<tr><td> ' . $row['bez']  . '</td><td><input type="number" name="count" min="0" max="500" value="1"></td><td>' . $row['einheit'] . '</td><td>' . $row['preis'] . '</td><td>' . $row['preis']. '</td></tr>';
	}
	echo '</table>' ;
}
?>
