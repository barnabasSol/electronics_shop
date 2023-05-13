 SELECT cart.product_c_id, cart.buyer_id, cart.units, first_table.product_name, first_table.image_path 
    FROM cart 
    JOIN (
        SELECT product_name, image_path, product_class_id 
        FROM product_class 
        JOIN product_images ON product_class.img_id=product_images.image_id
        WHERE image_type = 1
    ) AS first_table ON first_table.product_class_id = cart.product_c_id 
    WHERE cart.buyer_id = "esb001";