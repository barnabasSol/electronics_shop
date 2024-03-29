drop TRIGGER update_review_and_reputation;


DELIMITER //
CREATE TRIGGER update_review_and_reputation 
AFTER INSERT ON ratings 
FOR EACH ROW
BEGIN
    UPDATE product_class 
    SET average_rating = (
        SELECT AVG(product_rating) 
        FROM ratings 
        WHERE product_c_id = NEW.product_c_id
    )
    WHERE product_class_id = NEW.product_c_id;

    UPDATE seller 
    SET reputation = (
        SELECT AVG(average_rating) * 2 
        FROM product_class 
        WHERE average_rating!=0 AND seller_id =(
            SELECT seller_id 
            FROM product_class 
            WHERE product_class_id = NEW.product_c_id
        ) 
    );
END; //
DELIMITER ;
