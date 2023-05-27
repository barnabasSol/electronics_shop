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
        }
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

    public function sort_products_by($by)
    {
        if (!$this->con) {
            return "db_error";
        }

        switch ($by) {
            case "affordable":
                $query = "SELECT *, image_path FROM product_class JOIN product_images ON img_id = image_id WHERE image_type = 1 ORDER BY product_price ASC";
                break;
            case "expensive":
                $query = "SELECT *, image_path FROM product_class JOIN product_images ON img_id = image_id WHERE image_type = 1 ORDER BY product_price DESC";
                break;
            case "rating":
                $query = "SELECT *, image_path FROM product_class JOIN product_images ON img_id = image_id WHERE image_type = 1 ORDER BY average_rating DESC";
                break;
        }
        $result = mysqli_query($this->con, $query);
        $finally = mysqli_fetch_all($result, MYSQLI_ASSOC);
        mysqli_free_result($result);
        return json_encode($finally);
    }

    public function search_product($by_name)
    {
        if (!$this->con) {
            return "db_error";
        }
        $search_string = '%' . $by_name . '%';
        $stmt = $this->con->prepare("SELECT *, image_path FROM product_class JOIN product_images ON img_id = image_id WHERE image_type = 1 AND (product_name LIKE ? OR product_class_id LIKE ?)");
        $stmt->bind_param("ss", $search_string, $search_string);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        mysqli_stmt_close($stmt);
        return json_encode($result);
    }

    public function get_seller_contact($prod_id)
    {
        if (!$this->con) {
            return "db_error";
        }
        $stmt = $this->con->prepare("SELECT email, phone FROM product_class JOIN users ON seller_id=login_id WHERE product_class_id=? LIMIT 1");
        $stmt->bind_param("s", $prod_id);
        $result = $stmt->execute() ? $stmt->get_result()->fetch_all(MYSQLI_ASSOC) : "failed";
        mysqli_stmt_close($stmt);
        return $result;
    }

    public function insert_rating($buyer_id, $rating, $prod_id){
        if (!$this->con) {
            return "db_error";
        } else {
            $query = "INSERT INTO ratings(buyer_id, product_rating, product_c_id) VALUES (?, ?, ?)";
            $stmt = mysqli_prepare($this->con, $query);
            mysqli_stmt_bind_param($stmt, "sss", $buyer_id, $rating, $prod_id);
            $status = mysqli_stmt_execute($stmt) ? "success" : "error";
            mysqli_stmt_close($stmt);
            return $status;
        }
    }

    public function get_seller_reputation($seller_id)
    {
        if (!$this->con) {
            return "db_error";
        }
        $stmt = $this->con->prepare("SELECT reputation FROM seller where login_id = ?");
        $stmt->bind_param("s", $seller_id);
        $result = $stmt->execute() ? $stmt->get_result()->fetch_all(MYSQLI_ASSOC) : "failed";
        return $result;
    }

    public function cart_item_exists($product_id, $buyer_id)
    {
        if (!$this->con) {
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

    public function check_notification($current_user)
    {
        if (!$this->con) {
            return "db_error";
        }
        $stmt = $this->con->prepare("SELECT prod_c_id, seller_confirmation FROM pending_orders WHERE buyer_id=?");
        $stmt->bind_param("s", $current_user);
        $result = $stmt->execute() ? $stmt->get_result()->fetch_all(MYSQLI_ASSOC) : "failed";
        mysqli_stmt_close($stmt);
        return json_encode($result);
    }

    public function get_history_of_buyer($buyer_id){
        if (!$this->con){
            return "db_error";
        }
        $stmt = $this->con->prepare("SELECT * FROM history WHERE buyer_id = ?");
        $stmt->bind_param("s", $buyer_id);
        $result = $stmt->execute() ? $stmt->get_result()->fetch_all(MYSQLI_ASSOC) : "failed";
        mysqli_stmt_close($stmt);
        return json_encode($result);
    }

    public function get_pending_orders_of($current_user)
    {
        if (!$this->con) {
            return "db_error";
        }
        $stmt = $this->con->prepare("CALL get_pending_orders_of_user(?);");
        $stmt->bind_param("s", $current_user);
        $orders = $stmt->execute() ? $stmt->get_result()->fetch_all(MYSQLI_ASSOC) : "failed";
        return json_encode($orders);
    }

    public function cancel_order($prod_id, $user)
    {
        if (!$this->con) {
            return "db_error";
        }
        $stmt = $this->con->prepare("DELETE FROM pending_orders WHERE prod_c_id=? AND buyer_id=?");
        $stmt->bind_param("ss", $prod_id, $user);
        $status = $stmt->execute() ? "success" : "failed";
        return $status;
    }

    public function cancel_all_order($user)
    {

        if (!$this->con) {
            return "db_error";
        }
        $stmt = $this->con->prepare("DELETE FROM pending_orders WHERE buyer_id=?");
        $stmt->bind_param("s", $user);
        $status = $stmt->execute() ? "success" : "failed";
        return $status;
    }

    public function get_product_images($prod_img_id)
    {
        if (!$this->con) {
            return "db_error";
        }
        $stmt = $this->con->prepare("SELECT image_path FROM product_images WHERE image_id=?");
        $stmt->bind_param("s", $prod_img_id);
        $result = $stmt->execute() ? $stmt->get_result()->fetch_all(MYSQLI_ASSOC) : "failed";
        return $result;
    }

    public function make_order($ordered_items)
    {
        if (!$this->con) {
            echo "db_error";
        }
        try {
            $this->con->begin_transaction();
            $this->clear_cart_content($ordered_items[0]["buyer_id"]);
            foreach ($ordered_items as $value) {
                $stmt = $this->con->prepare("INSERT INTO pending_orders(buyer_id, prod_c_id, units) values (?, ?, ?)");
                $stmt->bind_param("sss", $value["buyer_id"], $value["product_c_id"], $value["units"]);
                $stmt->execute();
            }

            $this->con->commit();
            $status = "success";
        } catch (Exception $e) {
            $this->con->rollback();
            $status = "failed: " . $e->getMessage();
        }
        return $status;
    }


    public function update_cart($current_user, $cart_content)
    {
        if (!$this->con) {
            echo "db_error";
        }
        try {
            $this->con->begin_transaction();

            foreach ($cart_content as $value) {
                $stmt = $this->con->prepare("UPDATE cart SET units = ? WHERE buyer_id = ? AND product_c_id = ?");
                $stmt->bind_param("sss", $value["units"], $current_user, $value["product_c_id"]);
                $stmt->execute();
            }

            $this->con->commit();
            $status = "success";
        } catch (Exception $e) {
            $this->con->rollback();
            $status = "failed: " . $e->getMessage();
        }
        return $status;
    }

    public function clear_cart_content($current_user)
    {
        if (!$this->con) {
            return "db_error";
        }
        $stmt = $this->con->prepare("DELETE FROM cart WHERE buyer_id = ?");
        $stmt->bind_param("s", $current_user);
        $status = $stmt->execute() ? "success" : "failed";
        return $status;
    }
}


///////////////////////////////////////Requests///////////////////////////////


final class RequestHandler_bp
{
    public static function handle()
    {
        $buyer = new Buyer();


        ///////////////////////////////////////////MAKE ORDER/////////////////////////////
        if (isset($_POST["function"]) && $_POST["function"] === "make_order") {
            if (isset($_POST["ordered_items"])) {
                $ordered_items_assos = json_decode($_POST["ordered_items"], true);
                $result = $buyer->make_order($ordered_items_assos);
                echo $result;
            } else {
                http_response_code(400);
                echo "Invalid or missing parameters";
            }
        } else if (isset($_POST["function"]) && $_POST["function"] === "add_rating") {
            if (isset($_POST["rating"]) && isset($_POST["user"]) && isset($_POST["product_id"])) {
                $result = $buyer->insert_rating($_POST['user'], $_POST['rating'], $_POST['product_id']);
                echo $result;
            } else {
                http_response_code(400);
                echo "Invalid or missing parameters";
            }
        }
        //////////////////////////////////////searching product//////////////////////////////////////
        else if (isset($_GET['function'], $_GET['search_string_param']) && $_GET['function'] == "search_product") {
            echo $buyer->search_product(htmlspecialchars($_GET['search_string_param']));
        } else if (isset($_GET['cat_value'])) {
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
        /////////////////REQUEST TO DELETE//////////////////
        else if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
            $json = file_get_contents("php://input");
            $data = json_decode($json, true);
            if (isset($data["action"])) {
                if ($data["action"] == "delete_cart_content" && isset($data["current_user"])) {
                    $result = $buyer->clear_cart_content($data["current_user"]);
                    echo json_encode(["result" => $result]);
                } else if ($data["action"] == "delete_from_cart" && isset($data["product_id"])) {
                    $result = $buyer->delete_cart_item($data["product_id"], $data["current_user"]);
                    echo json_encode(["status" => $result]);
                } else if ($data["action"] == "cancel_order" && isset($data["product_id"], $data["user"])) {
                    $result = $buyer->cancel_order($data["product_id"], $data["user"]);
                    echo json_encode(["status" => $result]);
                } else if ($data["action"] == "cancel_all_order" && isset($data["user"])) {
                    $result = $buyer->cancel_all_order($data["user"]);
                    echo json_encode(["status" => $result]);
                } else {
                    http_response_code(400);
                    echo "Invalid or missing parameters";
                }
            } else {
                http_response_code(400);
                echo "Invalid or missing parameters";
            }
        }
        ////////////////////////REQUEST TO UPDATE CART CONTENT////////////
        else if ($_SERVER["REQUEST_METHOD"] === "PUT") {
            $json = file_get_contents("php://input");
            $data = json_decode($json, true);

            if (isset($data["action"], $data["current_user"], $data["cart_items"]) && $data["action"] === "update_cart_content") {
                $result = $buyer->update_cart($data["current_user"], $data["cart_items"]);
                header("Content-Type: application/json");
                echo json_encode(["status" => $result]);
            }
        } else if (isset($_GET["function"]) && $_GET["function"] === "get_product_images") {
            if (isset($_GET["prod_img_id"])) {
                echo json_encode($buyer->get_product_images($_GET["prod_img_id"]));
            }
        } else if (isset($_GET["function"]) && $_GET["function"] === "seller_contact") {
            if (isset($_GET["product_id"])) {
                echo json_encode($buyer->get_seller_contact($_GET["product_id"]));
            }
        } else if (isset($_GET["function"]) && $_GET["function"] === "seller_rep") {
            if (isset($_GET["seller_id"])) {
                echo json_encode($buyer->get_seller_reputation($_GET["seller_id"]));
            }
        } else if (isset($_GET["function"]) && $_GET["function"] === "sort_products") {
            if (isset($_GET["sort_by"])) {
                echo $buyer->sort_products_by($_GET["sort_by"]);
            }
        } else if (isset($_GET["function"]) && $_GET["function"] === "get_orders") {
            if (isset($_GET["user"])) {
                echo $buyer->get_pending_orders_of($_GET["user"]);
            }
        }else if (isset($_GET["function"]) && $_GET["function"] === "notification") {
            if (isset($_GET["user"])) {
                echo $buyer->check_notification($_GET["user"]);
            }
        }else if (isset($_GET["function"]) && $_GET["function"] === "get_history") {
            if (isset($_GET["user"])) {
                echo $buyer->get_history_of_buyer($_GET["user"]);
            }
        }
        
    }
}

RequestHandler_bp::handle();
