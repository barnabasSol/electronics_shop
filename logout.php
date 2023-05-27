<?php
session_start();

if (isset($_SESSION['email'])) {
    unset($_SESSION['email']);
    $_SESSION = [];
    session_destroy();
} elseif (isset($_SESSION['phone'])) {
    unset($_SESSION['phone']);
    $_SESSION = [];
    session_destroy();
} else {
    unset($_SESSION['login_id']);
    $_SESSION = array();
    session_destroy();
}

// Send a JSON response indicating success
echo json_encode(array('success' => true));
exit;
?>