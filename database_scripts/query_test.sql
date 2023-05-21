/* SELECT
    cart.product_c_id,
    cart.buyer_id,
    cart.units,
    first_table.product_name,
    first_table.image_path,
    first_table.units
FROM
    cart
    JOIN (
        SELECT
            product_name,
            image_path,
            product_class_id,
            units
        FROM
            product_class
            JOIN product_images ON product_class.img_id = product_images.image_id
        WHERE
            image_type = 1
    ) AS first_table ON first_table.product_class_id = cart.product_c_id
WHERE
    cart.buyer_id = "esb001"; 
 */


/* DELIMITER //
CREATE PROCEDURE get_cart_items_of_user(IN buyer_id VARCHAR(200))
BEGIN
    SELECT cart.product_c_id, cart.buyer_id, cart.units, first_table.product_name, first_table.image_path, first_table.units as product_units, first_table.product_price
    FROM cart 
    JOIN (
        SELECT product_name, image_path, product_class_id, product_class.units, product_class.product_price
        FROM product_class 
        JOIN product_images ON product_class.img_id=product_images.image_id
        WHERE image_type = 1
    ) AS first_table ON first_table.product_class_id = cart.product_c_id 
    WHERE cart.buyer_id = buyer_id;
END // 
DELIMITER ;
 */



UPDATE product_class
SET product_description = 'Immerse yourself in the ultimate audio experience with the New Z-X headphones. With their advanced noise-cancellation technology, powerful bass, and crystal-clear sound, the New Z-X headphones are perfect for music lovers and audiophiles alike.With their stylish and comfortable design, you can wear them all day without any discomfort. Get your hands on the ultimate headphones today!'; 