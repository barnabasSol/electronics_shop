DROP DATABASE electronics_shop;

CREATE DATABASE electronics_shop;

USE electronics_shop;

CREATE TABLE account_type (
  account_type_id INT AUTO_INCREMENT,
  account_type_name VARCHAR(200),
  PRIMARY KEY (account_type_id)
);

CREATE TABLE product_types (
  product_type_id INT AUTO_INCREMENT,
  product_type_name VARCHAR(200),
  PRIMARY KEY (product_type_id)
);

CREATE TABLE users (
  login_id VARCHAR(200) PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  phone VARCHAR(50) UNIQUE,
  email VARCHAR(50) UNIQUE,
  DOB DATE,
  gender VARCHAR(2),
  active_status TINYINT DEFAULT 1,
  account_type_id INT,
  password VARCHAR(200),
  FOREIGN KEY (account_type_id) REFERENCES account_type(account_type_id)
);

CREATE TABLE seller (
  login_id VARCHAR(200),
  reputation DECIMAL(2, 1),
  FOREIGN KEY (login_id) REFERENCES users(login_id)
);

CREATE TABLE product_class(
  product_class_id VARCHAR(200) PRIMARY KEY,
  product_name VARCHAR(200),
  product_price DECIMAL(8, 2),
  product_description VARCHAR(500),
  units INT,
  discount DECIMAL(4, 2) DEFAULT 0,
  average_rating INT DEFAULT 0,
  seller_id VARCHAR(200),
  img_id varchar(200) UNIQUE,
  product_t_id INT,
  FOREIGN KEY (product_t_id) REFERENCES product_types(product_type_id),
  FOREIGN KEY (seller_id) REFERENCES users(login_id)
);

CREATE TABLE product_images (
  image_id VARCHAR(200),
  image_path VARCHAR(300),
  image_type TINYINT,
  FOREIGN KEY (image_id) REFERENCES product_class(img_id)
);

CREATE TABLE ratings (
  buyer_id VARCHAR(200),
  product_rating INT DEFAULT 0,
  product_c_id VARCHAR(200),
  FOREIGN KEY (product_c_id) REFERENCES product_class(product_class_id)
);

CREATE TABLE pending_orders (
  buyer_id VARCHAR(200),
  prod_c_id VARCHAR(200),
  seller_confirmatiation TINYINT DEFAULT 0,
  buyer_confirmatiation TINYINT DEFAULT 0,
  units INT,
  FOREIGN KEY (buyer_id) REFERENCES users(login_id),
  FOREIGN KEY (prod_c_id) REFERENCES product_class(product_class_id)
);

CREATE TABLE cart (
  buyer_id VARCHAR(200),
  product_c_id VARCHAR(200),
  units int,
  FOREIGN KEY (buyer_id) REFERENCES users(login_id),
  FOREIGN KEY (product_c_id) REFERENCES product_class(product_class_id)
);

CREATE TABLE history (
  buyer_id VARCHAR(200),
  product_c_id VARCHAR(200),
  seller_id VARCHAR(200),
  units int,
  paid_amount decimal(12, 2),
  purchased_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
);





DELIMITER //

CREATE FUNCTION generate_buyer_id() 
RETURNS VARCHAR(255)
DETERMINISTIC
BEGIN
DECLARE last_id VARCHAR(255);
DECLARE new_id VARCHAR(255);

SELECT MAX(login_id) INTO last_id 
FROM users
WHERE login_id LIKE 'ESB%';

IF last_id IS NULL THEN
  SET new_id = 'ESB001';
ELSE
  SET new_id = CONCAT('ESB', LPAD(SUBSTR(last_id, 4) + 1, LENGTH(last_id) - 3, '0'));
END IF;

RETURN new_id;
END //

DELIMITER ;





DELIMITER //
CREATE FUNCTION generate_seller_id()
RETURNS VARCHAR(255)
DETERMINISTIC
BEGIN

DECLARE last_id VARCHAR(255);
DECLARE new_id VARCHAR(255);

SELECT MAX(login_id) INTO last_id
FROM users
WHERE login_id LIKE 'ESS%';

IF last_id IS NULL THEN
SET new_id = 'ESS001';
ELSE
SET new_id = CONCAT(
'ESS',
LPAD(SUBSTR(last_id, 4) + 1, LENGTH(last_id) - 3, '0')
);
END IF;

RETURN new_id;

END //
DELIMITER ;





INSERT INTO
  account_type (account_type_name)
VALUES
  ("buyer"),
  ("seller");

insert INTO
  product_types (product_type_name)
values
  ('Phone'),
  ('Tablet'),
  ('Computer'),
  ('Other');
