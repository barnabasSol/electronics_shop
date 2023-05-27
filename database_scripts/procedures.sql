DELIMITER //
CREATE PROCEDURE get_pending_orders_of_user(IN buyer_id VARCHAR(200))
BEGIN
     SELECT pending_orders.prod_c_id, pending_orders.buyer_id, pending_orders.units, pending_orders.seller_confirmation, first_table.product_name, first_table.image_path, first_table.units as product_units, first_table.product_price
    FROM pending_orders 
    JOIN (
        SELECT product_name, image_path, product_class_id, product_class.units, product_class.product_price
        FROM product_class 
        JOIN product_images ON product_class.img_id=product_images.image_id
        WHERE image_type = 1
    ) AS first_table ON first_table.product_class_id = pending_orders.prod_c_id 
    WHERE pending_orders.buyer_id = buyer_id;
END // 
DELIMITER ;





DELIMITER //
CREATE PROCEDURE get_cart_items_of_user(IN buyer_id VARCHAR(200))
BEGIN
    SELECT cart.product_c_id, cart.buyer_id, cart.units, first_table.product_name, first_table.image_path, first_table.units as product_units
    FROM cart 
    JOIN (
        SELECT product_name, image_path, product_class_id, product_class.units
        FROM product_class 
        JOIN product_images ON product_class.img_id=product_images.image_id
        WHERE image_type = 1
    ) AS first_table ON first_table.product_class_id = cart.product_c_id 
    WHERE cart.buyer_id = buyer_id;
END // 
DELIMITER ;






DELIMITER //
CREATE PROCEDURE insert_user (
IN p_login_id VARCHAR(200),
IN p_first_name VARCHAR(255),
IN p_last_name VARCHAR(255),
IN p_email VARCHAR(255),
IN p_phone VARCHAR(255),
IN p_acc_type VARCHAR(255),
IN p_gender VARCHAR(255),
IN p_dob DATE,
IN p_password VARCHAR(255)
)
BEGIN
INSERT INTO
users (
login_id,
first_name,
last_name,
email,
phone,
account_type_id,
gender,
dob,
password
)
VALUES
(
p_login_id,
p_first_name,
p_last_name,
p_email,
p_phone,
p_acc_type,
p_gender,
p_dob,
p_password
);
END //
DELIMITER ;