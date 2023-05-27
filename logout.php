<?php
// Start the session
session_start();

// Unset the session variables
unset($_SESSION['login_id']);

// Destroy the session
session_destroy();
session_regenerate_id(true);

// Redirect the user to the logout page
header('Location: index.html');
exit;
?>