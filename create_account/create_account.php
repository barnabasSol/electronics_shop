<?php
require '../config.php';

class User
{
    private $con;
    private $first_name;
    private $last_name;
    private $email;
    private $phone;
    private $acc_type;
    private $gender;
    private $dob;
    private $password;

    public function __construct()
    {
        $this->con = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        $args = func_get_args();
        $num_args = func_num_args();
        if ($num_args == 0) {
            $this->__default_construct();
        } else if ($num_args == 8) {
            $this->__construct_with_param($args[0], $args[1], $args[2], $args[3], $args[4], $args[5], $args[6], $args[7]);
        } else {
            throw new Exception('Invalid number of arguments');
        }
    }

    public function __destruct()
    {
        mysqli_close($this->con);
    }

    private function __default_construct()
    {
        $this->first_name = '';
        $this->last_name = '';
        $this->phone = '';
        $this->email = '';
        $this->acc_type = '';
        $this->gender = '';
        $this->dob = '';
        $this->password = '';
    }

    private function __construct_with_param($first_name, $last_name, $phone, $email, $acc_type, $gender, $dob, $password)
    {
        $this->first_name = $first_name;
        $this->last_name = $last_name;
        $this->phone = $phone;
        $this->email = $email;
        $this->acc_type = $acc_type;
        $this->gender = $gender;
        $this->dob = $dob;
        $this->password = $password;
    }


    public function create_user(User $x)
    {
        $fname = filter_var(trim($x->first_name), FILTER_SANITIZE_SPECIAL_CHARS);
        $lname = filter_var(trim($x->last_name), FILTER_SANITIZE_SPECIAL_CHARS);
        $email = filter_var(trim($x->email), FILTER_SANITIZE_EMAIL);
        $phone = filter_var(trim($x->phone), FILTER_SANITIZE_NUMBER_INT);
        $gender = filter_var(trim($x->gender), FILTER_SANITIZE_SPECIAL_CHARS);
        $dob = filter_var(trim($x->dob), FILTER_SANITIZE_SPECIAL_CHARS);
        $psw = filter_var(trim($x->password), FILTER_SANITIZE_SPECIAL_CHARS);

        if ($this->con->connect_errno) {
            echo "db_error";
        } else {
            $fname_cap = ucfirst($fname);
            $lname_cap = ucfirst($lname);
            if (htmlspecialchars($x->acc_type) == "Buyer") {
                $query = "CALL insert_user(generate_buyer_id(), ?, ?, ?, ?, 1, ?, ?, ?)";
                $stmt = mysqli_prepare($this->con, $query);
                mysqli_stmt_bind_param($stmt, "sssssss", $fname_cap, $lname_cap, $email, $phone, $gender, $dob, $psw);
            } else if (htmlspecialchars($x->acc_type) == "Seller") {
                
                $query = "CALL insert_user(generate_seller_id(), ?, ?, ?, ?, 2, ?, ?, ?)";
                $stmt = mysqli_prepare($this->con, $query);
                mysqli_stmt_bind_param($stmt, "sssssss", $fname_cap, $lname_cap, $email, $phone, $gender, $dob, $psw);
            }
            $result = mysqli_stmt_execute($stmt) ? "success" : "error";
            echo $result;
            mysqli_stmt_close($stmt);
        }
    }

    function hash_password($password)
    {
        $hashed = password_hash($password, PASSWORD_DEFAULT);
        return $hashed;
    }

    public function email_phone_exists($email, $phone)
    {
        if ($this->con->connect_error) {
            return "error";
        } else {
            $query_phone = "SELECT phone FROM users WHERE phone=?";

            $stmt_phone = mysqli_prepare($this->con, $query_phone);
            mysqli_stmt_bind_param($stmt_phone, "s", $phone);
            mysqli_stmt_execute($stmt_phone);
            $result1 = mysqli_stmt_get_result($stmt_phone);

            $phone_rslt = (mysqli_num_rows($result1) > 0) ? "true" : "false";

            $query_email = "SELECT email FROM users WHERE email=?";

            $stmt_email = mysqli_prepare($this->con, $query_email);
            mysqli_stmt_bind_param($stmt_email, "s", $email);
            mysqli_stmt_execute($stmt_email);
            $result2 = mysqli_stmt_get_result($stmt_email);
            $email_rslt = (mysqli_num_rows($result2) > 0) ? "true" : "false";
            mysqli_stmt_close($stmt_phone);
            mysqli_stmt_close($stmt_email);
            return "phone:" . $phone_rslt . " " . "email:" . $email_rslt;
        }
    }
}


///////////////////////////////////////////////////Requests//////////////////////////////////////////


final class RequestHandler_ca
{
    public static function handle()
    {
        $x = new User();
        if (isset($_POST['function']) && isset($_POST['email'])  && isset($_POST['phone'])) {
            if ($_POST['function'] == "email_phone_exists") {
                echo $x->email_phone_exists(htmlspecialchars($_POST['email']), htmlspecialchars($_POST['phone']));
            }
        }


        if ($_POST['function'] === 'create_account') {
            $all_variables_set = true;
            $expected_variables = array(
                'function', 'first_name', 'last_name', 'email',
                'phone', 'acc_type', 'gender', 'dob', 'password', 'confirm_password'
            );
            foreach ($expected_variables as $variable) {
                if (!isset($_POST[$variable])) {
                    $all_variables_set = false;
                    break;
                }
            }
            if ($all_variables_set) {
                $psw = $x->hash_password(htmlspecialchars($_POST['password']));

                $x = new User(
                    $_POST['first_name'],
                    $_POST['last_name'],
                    $_POST['phone'],
                    $_POST['email'],
                    $_POST['acc_type'],
                    $_POST['gender'],
                    $_POST['dob'],
                    $psw,
                );
                $x->create_user($x);
            } else {
                echo "create_denied";
            }
        }
    }
}


RequestHandler_ca::handle();
