CREATE DATABASE IF NOT EXISTS auction_platform;
USE auction_platform;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(50),
  surname VARCHAR(50),
  icon VARCHAR(255),
  image VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS auctions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100),
  description TEXT,
  start_price FLOAT,
  current_price FLOAT,
  end_date DATETIME,
  user_id INT,
  icon VARCHAR(255),
  image VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS bids (
  id INT AUTO_INCREMENT PRIMARY KEY,
  amount FLOAT,
  auction_id INT,
  user_id INT,
  FOREIGN KEY (auction_id) REFERENCES auctions(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT IGNORE INTO users (username, password, name, surname, icon, image) VALUES
('johndoe', 'password123', 'John', 'Doe', 'icons/john.png', 'images/john.jpg'),
('janedoe', 'password456', 'Jane', 'Doe', 'icons/jane.png', 'images/jane.jpg'),
('admin', 'adminpassword', 'Admin', 'User', 'icons/admin.png', 'images/admin.jpg');

INSERT IGNORE INTO auctions (title, description, start_price, current_price, end_date, user_id, icon, image) VALUES
('Vintage Watch', 'A rare vintage watch from 1950s.', 100.0, 150.0, '2024-12-31 23:59:59', 1, 'icons/watch.png', 'images/watch.jpg'),
('Antique Vase', 'A beautiful antique vase from the 19th century.', 200.0, 300.0, '2024-12-25 23:59:59', 2, 'icons/vase.png', 'images/vase.jpg'),
('Art Piece', 'A unique piece of modern art.', 500.0, 600.0, '2024-12-20 23:59:59', 3, 'icons/art.png', 'images/art.jpg');

INSERT IGNORE INTO bids (amount, auction_id, user_id) VALUES
(110.0, 1, 2),
(120.0, 1, 3),
(250.0, 2, 1),
(310.0, 2, 3),
(550.0, 3, 1),
(620.0, 3, 2);
