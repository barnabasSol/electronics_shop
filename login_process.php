<?php
require 'config.php';

class LoginProcess
{
    private $con;
    
    public function __construct()
    {
        $this->con = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    }
    public function __destruct()
    {
        mysqli_close($this->con);
    }

    public function email_exists($email)
    {
        if ($this->con->connect_errno) {
            return false;
        } else {
            $query = "SELECT COUNT(*) FROM users WHERE email = '{$email}'";
            $result = mysqli_query($this->con, $query);
            $row = mysqli_fetch_array($result, MYSQLI_NUM);
            mysqli_free_result($result);
            return $row[0] > 0;
        }
    }

    public function phone_exists($phone)
    {
        if ($this->con->connect_errno) {
            return false;
        } else {
            $query = "SELECT COUNT(*) FROM users WHERE phone = '{$phone}'";
            $result = mysqli_query($this->con, $query);
            $row = mysqli_fetch_array($result, MYSQLI_NUM);
            mysqli_free_result($result);
            return $row[0] > 0;
        }
    }

    public function login_id_exists($login_id)
    {
        if ($this->con->connect_errno) {
            return false;
        } else {
            $query = "SELECT COUNT(*) FROM users WHERE login_id = '{$login_id}'";
            $result = mysqli_query($this->con, $query);
            $row = mysqli_fetch_array($result, MYSQLI_NUM);
            mysqli_free_result($result);
            return $row[0] > 0;
        }
    }


    function process_login($login, $password)
    {
        if ($this->con->connect_errno) {
            return "error_db_connection";
        } else {
            if ($login) {
                if (filter_var($login, FILTER_VALIDATE_EMAIL)) {
                    if ($this->email_exists($login)) {
                        $query = "select password, account_type_id from users where email = '{$login}'";
                        $result = mysqli_query($this->con, $query);
                        $row = mysqli_fetch_row($result);
                        $db_password = $row[0];
                        if (password_verify($password, $db_password) && $row[1] === "1") {
                            session_start();
                            $_SESSION['email'] = $login;
                            header('Location: buyer_home_page/buyer_home.html', true, 302);
                            exit;
                        } else if (password_verify($password, $db_password) && $row[1] === "2") {
                            session_start();
                            $_SESSION['email'] = $login;
                            //NATI'S PAGE
                            exit;
                        } else {
                            return "psw_error";
                        }
                    } else {
                        return "email_doesnt_exist";
                    }
                } elseif (preg_match('/^(?:\+251|0)?\d{9}$/', $login)) {
                    if ($this->phone_exists($login)) {
                        $query = "select password, account_type_id from users where phone = '{$login}'";
                        $result = mysqli_query($this->con, $query);
                        $row = mysqli_fetch_row($result);
                        $db_password = $row[0];
                        if (password_verify($password, $db_password) && $row[1] === "1") {
                            session_start();
                            $_SESSION['phone'] = $login;
                            header('Location: buyer_home_page/buyer_home.html', true, 302);
                            exit;
                        } else if (password_verify($password, $db_password) && $row[1] === "2") {
                            session_start();
                            $_SESSION['phone'] = $login;
                            //NATI'S PAGE
                            exit;
                        } else {
                            return "psw_error";
                        }
                    } else {
                        return "phone_doesnt_exist";
                    }
                } elseif (preg_match('/^ES[BS]\d*$/i', $login)) {
                    if ($this->login_id_exists($login)) {
                        $query = "select password, account_type_id from users where login_id = '{$login}'";
                        $result = mysqli_query($this->con, $query);
                        $row = mysqli_fetch_row($result);
                        $db_password = $row[0];
                        if (password_verify($password, $db_password) && $row[1] === "1") {
                            session_start();
                            $_SESSION['login_id'] = $login;
                            header('Location: buyer_home_page/buyer_home.html', true, 302);
                            exit;
                        } else if (password_verify($password, $db_password) && $row[1] === "2") {
                            session_start();
                            $_SESSION['login_id'] = $login;
                            //NATI'S PAGE
                            exit;
                        } else {
                            return "psw_error";
                        }
                    } else {
                        return "loginid_doesnt_exist";
                    }
                } else {
                    return "invalid";
                }
            }
        }
    }

    function get_user_info()
    {
        session_start();
        $login = "";
        if (isset($_SESSION['login_id'])) {
            $login = htmlspecialchars($_SESSION['login_id']);
        } else if (isset($_SESSION['email'])) {
            $login = htmlspecialchars($_SESSION['email']);
        } else if (isset($_SESSION['phone'])) {
            $login = htmlspecialchars($_SESSION['phone']);
        } else {
            return;
        }
        if ($this->con->errno) {
            return "db_error";
        } else {
            $stmt = $this->con->prepare("SELECT * FROM users WHERE email = ? OR phone = ? OR login_id = ?");
            $stmt->bind_param("sss", $login, $login, $login);
            $stmt->execute();
            $result = $stmt->get_result();
            $user = $result->fetch_all(MYSQLI_ASSOC);
            mysqli_stmt_close($stmt);
            return $user;
        }
    }
}


//////////////////////////////////////REQUESTS//////////////////////////////////

final class RequestHandler_lp
{
    public static function handle()
    {
        $x = new LoginProcess();
        if (isset($_POST['login_input']) && $_POST['password_input'] && $_POST['function']) {
            if ($_POST['function'] === "process_login") {
                echo $x->process_login(htmlspecialchars($_POST["login_input"]), htmlspecialchars($_POST["password_input"]));
            }
        }
        else if (isset($_GET['function'])) {
            if ($_GET['function'] === "get_user_info")
                echo json_encode($x->get_user_info());
        }
    }
}


RequestHandler_lp::handle();
