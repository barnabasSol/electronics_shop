<?php
session_start();

if(session_destroy()){
  $response = array('status' => 'success', 'message' => 'Session destroyed successfully');
} else {
  $response = array('status' => 'error', 'message' => 'Error destroying session');
}

echo json_encode($response);
header('Location: ../index.html');
exit();
?>