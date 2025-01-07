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
  winner_id INT,
  status ENUM('open', 'closed', 'cancelled') DEFAULT 'open',
  icon VARCHAR(255),
  image VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (winner_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS bids (
  id INT AUTO_INCREMENT PRIMARY KEY,
  amount FLOAT,
  auction_id INT,
  user_id INT,
  is_winning_bid BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (auction_id) REFERENCES auctions(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT IGNORE INTO users (username, password, name, surname, icon, image) VALUES
('johndoe', 'password123', 'John', 'Doe', 'icons/john.png', 'images/john.jpg'),
('janedoe', 'password456', 'Jane', 'Doe', 'icons/jane.png', 'images/jane.jpg'),
('admin', 'adminpassword', 'Admin', 'User', 'icons/admin.png', 'images/admin.jpg'),
('calcutta', 'password789', 'Edoardo', 'D''Erme', 'icons/calcutta.png', 'images/calcutta.jpg'),
('gazellefan', 'password101', 'Flavio', 'Bruno', 'icons/gazzelle.png', 'images/gazzelle.jpg'),
('icanifan', 'password202', 'Niccolò', 'Contessa', 'icons/icani.png', 'images/icani.jpg');

INSERT IGNORE INTO auctions (title, description, start_price, current_price, end_date, user_id, winner_id, status, icon, image) VALUES
('Vintage Watch', 'A rare vintage watch from 1950s.', 100.0, 150.0, '2024-12-31 23:59:59', 1, NULL, 'open', 'icons/watch.png', 'images/watch.jpg'),
('Antique Vase', 'A beautiful antique vase from the 19th century.', 200.0, 300.0, '2024-12-25 23:59:59', 2, NULL, 'open', 'icons/vase.png', 'images/vase.jpg'),
('Art Piece', 'A unique piece of modern art.', 500.0, 600.0, '2024-12-20 23:59:59', 3, NULL, 'open', 'icons/art.png', 'images/art.jpg'),
('Vinile di Calcutta', 'Un raro vinile autografato di Calcutta.', 50.0, 80.0, '2024-12-15 23:59:59', 4, NULL, 'open', 'icons/calcutta_vinile.png', 'images/calcutta_vinile.jpg'),
('Felpa di Gazzelle', 'Una felpa indossata da Gazzelle durante un concerto.', 30.0, 60.0, '2024-12-10 23:59:59', 5, NULL, 'open', 'icons/gazzelle_felpa.png', 'images/gazzelle_felpa.jpg'),
('Chitarra dei Verdena', 'La chitarra usata dai Verdena nel loro tour.', 200.0, 300.0, '2024-12-20 23:59:59', 6, NULL, 'open', 'icons/verdena_chitarra.png', 'images/verdena_chitarra.jpg');

INSERT IGNORE INTO bids (amount, auction_id, user_id, is_winning_bid) VALUES
(110.0, 1, 2, FALSE),
(120.0, 1, 3, FALSE),
(250.0, 2, 1, FALSE),
(310.0, 2, 3, FALSE),
(550.0, 3, 1, FALSE),
(620.0, 3, 2, TRUE),
(90.0, 4, 5, FALSE),
(70.0, 5, 6, FALSE),
(220.0, 6, 4, TRUE);
