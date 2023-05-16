<?php
require "../config.php";

class Product
{
}


final class Buyer
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

    const PHONES = 1;
    const TABLETS = 2;
    const COMPUTERS = 3;
    const OTHERS = 4;

    public function get_products($category)
    {
        if (!$this->con) {
            return "db_error";
        } else {
            switch ($category) {
                case "All":
                    $query = "SELECT *, image_path FROM product_class JOIN product_images ON img_id = image_id WHERE image_type = 1";
                    break;
                case "Phones":
                    $query = "SELECT *, image_path FROM product_class JOIN product_images ON img_id = image_id WHERE product_t_id = " . self::PHONES . " AND image_type = 1";
                    break;
                case "Tablets":
                    $query = "SELECT *, image_path FROM product_class JOIN product_images ON img_id = image_id WHERE product_t_id = " . self::TABLETS . " AND image_type = 1";
                    break;
                case "Computers":
                    $query = "SELECT *, image_path FROM product_class JOIN product_images ON img_id = image_id WHERE product_t_id = " . self::COMPUTERS . " AND image_type = 1";
                    break;
                case "Others":
                    $query = "SELECT *, image_path FROM product_class JOIN product_images ON img_id = image_id WHERE product_t_id = " . self::OTHERS . " AND image_type = 1";
                    break;
                default:
                    return "doesnt_exist";
            }

            $result = mysqli_query($this->con, $query);
            $finally = mysqli_fetch_all($result, MYSQLI_ASSOC);
            mysqli_free_result($result);
            return json_encode($finally);
        }
    }

    public function cart_item_exists($product_id, $buyer_id)
    {
        if ($this->con->connect_errno) {
            return false;
        } else {
            $trimmed = trim($product_id);
            $query = "SELECT COUNT(*) FROM cart WHERE product_c_id = '{$trimmed}' AND buyer_id='{$buyer_id}'";
            $result = mysqli_query($this->con, $query);
            $row = mysqli_fetch_array($result, MYSQLI_NUM);
            mysqli_free_result($result);
            return $row[0] > 0;
        }
    }

    public function insert_in_cart($buyer_id, $product_id, $units)
    {
        $trimmed_id = trim($product_id);
        if ($this->cart_item_exists($trimmed_id, $buyer_id)) {
            echo "item_exists";
            return;
        }
        if ($this->con->connect_errno) {
            echo "db_error";
        } else {
            $query = "INSERT INTO cart VALUES (?, ?, ?)";
            $stmt = mysqli_prepare($this->con, $query);
            mysqli_stmt_bind_param($stmt, "sss", $buyer_id, $trimmed_id, $units);
            $status = mysqli_stmt_execute($stmt) ? "success" : "error";
            echo $status;
            mysqli_stmt_close($stmt);
        }
    }
    public function get_cart_items($buyer_id)
    {
        if (!$this->con) {
            echo "db_error";
        } else {
            $stmt = $this->con->prepare("CALL get_cart_items_of_user(?);");
            $stmt->bind_param("s", $buyer_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $cart_items = $result->fetch_all(MYSQLI_ASSOC);
            mysqli_stmt_close($stmt);
            return json_encode($cart_items);
        }
    }

    public function delete_cart_item($product_id, $current_user)
    {
        if (!$this->con) {
            echo "db_error";
        } else {
                $stmt = $this->con->prepare("DELETE from cart where product_c_id = ? AND buyer_id = ?");
                $stmt->bind_param("ss", $product_id, $current_user);
                $status = $stmt->execute() ? "success" : "failed";
                return $status;
        }
    }


    public function update_cart($cart_items, $current_user) {
        if (!$this->con) {
          echo "db_error";
        }
        try {
          $this->con->begin_transaction();
      
          foreach ($cart_items as $value) {
            $stmt = $this->con->prepare("UPDATE cart SET units = ? WHERE buyer_id = ? AND product_c_id = ?");
            $stmt->bind_param("sss", $value['units'], $current_user, $value['product_c_id']);
            $stmt->execute();
          }
          
          $this->con->commit();
          $status = "success";
        } catch (Exception $e) {
          $this->con->rollback();
          $status = "failed: " . $e->getMessage();
        }
        echo $status;
      }
}


///////////////////////////////////////Requests///////////////////////////////


final class RequestHandler_bp
{
    public static function handle()
    {
        $buyer = new Buyer();
        if (isset($_GET['cat_value'])) {
            echo $buyer->get_products(htmlspecialchars($_GET['cat_value']));
        } else if (isset($_GET['function']) && isset($_GET['current_user_id'])) {
            if ($_GET['function'] === 'get_cart_items') {
                echo $buyer->get_cart_items($_GET['current_user_id']);
            }
        } else if (isset($_POST['function']) && isset($_POST['buyer_id']) && isset($_POST['product_id']) && isset($_POST['units'])) {
            if ($_POST['function'] === "insert_in_cart") {
                $buyer->insert_in_cart(htmlspecialchars($_POST['buyer_id']), htmlspecialchars($_POST['product_id']), htmlspecialchars($_POST['units']));
            }
        }
        /////////////////REQUEST TO DELETE A CART ITEM//////////////////
        else if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
            // Read the request body as a JSON string
            $json = file_get_contents("php://input");
          
            $data = json_decode($json, true);
          
            if (isset($data["action"]) && $data["action"] === "delete_from_cart") {
              $product_id = $data["product_id"];
              $current_user = $data["current_user"];
          
              $result = $buyer->delete_cart_item($product_id, $current_user);
          
              header("Content-Type: application/json");
              echo json_encode(["status" => $result]);
            } else {
              header("HTTP/1.1 400 Bad Request");
              echo "Invalid or missing action parameter";
            }
          }
    }
}

RequestHandler_bp::handle();
