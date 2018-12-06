<?php
$command = escapeshellcmd('../scripts/dbf2sqlite.py mydb.dbf -e iso8859_16');
$output = shell_exec($command);
echo $output;
?>
