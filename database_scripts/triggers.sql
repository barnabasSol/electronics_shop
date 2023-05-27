
DELIMITER //
CREATE TRIGGER insert_seller 
AFTER INSERT ON users
FOR EACH ROW 
BEGIN
    IF new.login_id REGEXP '^ess[0-9]{3}$' THEN
        INSERT INTO seller (login_id, reputation) 
        VALUES (new.login_id, 0);
    END IF;
END; // 
DELIMITER ;


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
