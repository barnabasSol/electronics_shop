DROP DATABASE electronics_shop;

CREATE DATABASE electronics_shop;

USE electronics_shop;

CREATE TABLE account_type (
  account_type_id VARCHAR(200),
  account_type_name VARCHAR(200),
  PRIMARY KEY (account_type_id)
);

CREATE TABLE product_types (
  product_type_id VARCHAR(200),
  product_type_name VARCHAR(200),
  PRIMARY KEY (product_type_id)
);

CREATE TABLE users (
  login_id VARCHAR(200) PRIMARY KEY,
  first_name VARCHAR(200),
  last_name VARCHAR(200),
  phone VARCHAR(200),
  email VARCHAR(200),
  DOB DATE,
  gender varchar(2),
  account_type_id VARCHAR(200),
  password varchar(200),
  FOREIGN KEY (account_type_id) REFERENCES account_type(account_type_id)
);

CREATE TABLE seller (
  login_id VARCHAR(200),
  reputation DECIMAL(2, 1),
  total_earning DECIMAL(12, 2),
  FOREIGN KEY (login_id) REFERENCES users(login_id)
);

CREATE TABLE products (
  product_id VARCHAR(200) PRIMARY KEY,
  product_name VARCHAR(200),
  product_price DECIMAL(8, 2),
  product_description VARCHAR(500),
  units INT,
  product_rating int DEFAULT 0,
  seller_id VARCHAR(200),
  product_type_id VARCHAR(200),
  product_class VARCHAR(200),
  discount DECIMAL(4, 2),
  pending_status TINYINT,
  FOREIGN KEY (product_type_id) REFERENCES product_types(product_type_id),
  FOREIGN KEY (seller_id) REFERENCES users(login_id)
);

 CREATE TABLE rating (
 buyer_id varchar(200),
 rating decimal(2, 1),
 product_id varchar(200),
 FOREIGN KEY (buyer_id) REFERENCES users(login_id),
 FOREIGN KEY (product_id) REFERENCES products(product_id)
 );
 
 CREATE TABLE pending_orders (
 buyer_id varchar(200),
 product_id varchar(200),
 seller_confirmation TINYINT,
 buyer_confirmation TINYINT,
 product_class varchar(200),
 FOREIGN KEY (buyer_id) REFERENCES users(login_id),
 FOREIGN KEY (product_id) REFERENCES products(product_id)
 );
 
 CREATE TABLE cart (
 buyer_id varchar(200),
 product_id varchar(200),
 FOREIGN KEY (buyer_id) REFERENCES users(login_id),
 FOREIGN KEY (product_id) REFERENCES products(product_id)
 );
 
 CREATE TABLE history (
 buyer_id varchar(200),
 product_id varchar(200),
 seller_id varchar(200),
 paid_amount decimal(12, 2),
 purchased_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
 FOREIGN KEY (seller_id) REFERENCES seller(login_id),
 FOREIGN KEY (buyer_id) REFERENCES users(login_id),
 FOREIGN KEY (product_id) REFERENCES products(product_id)
 );
 
 CREATE TABLE product_images (
 image_path varchar(100),
 product_id varchar(200),
 seller_id varchar(200),
 FOREIGN KEY (seller_id) REFERENCES seller(login_id),
 FOREIGN KEY (product_id) REFERENCES products(product_id)
 );
 
/*
 */