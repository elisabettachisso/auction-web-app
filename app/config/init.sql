CREATE DATABASE IF NOT EXISTS auction_db;
USE auction_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(50),
  surname VARCHAR(50),
  image VARCHAR(255) DEFAULT 'default-user.jpg'
);

CREATE TABLE IF NOT EXISTS auctions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100),
  description TEXT,
  start_price FLOAT,
  current_price FLOAT,
  end_date DATE,
  user_id INT,
  winner_id INT,
  status ENUM('open', 'closed') DEFAULT 'open',
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

INSERT IGNORE INTO users (username, password, name, surname, image) VALUES
('calcuttafan', '$2b$10$VOdtzJZz8JfHO.S63./tWuDtrbXRr68ppcdxGvMXCvNdNl3ait6Uu', 'Edoardo', 'D''Erme', 'calcutta.jpg'),
('gazellefan', '$2b$10$VOdtzJZz8JfHO.S63./tWuDtrbXRr68ppcdxGvMXCvNdNl3ait6Uu', 'Flavio', 'Bruno', 'gazzelle.jpg'),
('icanifan', '$2b$10$VOdtzJZz8JfHO.S63./tWuDtrbXRr68ppcdxGvMXCvNdNl3ait6Uu', 'Niccolo', 'Contessa', 'icani.jpg');

INSERT IGNORE INTO auctions (title, description, start_price, current_price, end_date, user_id, winner_id, status, image) VALUES
('Calcutta''s Sweaty Tee', 'The legendary T-shirt worn by Calcutta during his marathon songwriting session. Smells like indie history.', 30.0, 50.0, '2024-12-15', 1, 3, 'closed','calcutta-tee.jpg'),
('Gazzelle''s Concert Hoodie', 'A hoodie soaked in nostalgia from Gazzelle''s sold-out gigs. Comes with emotional baggage.', 40.0, 70.0, '2024-01-16', 2, 3, 'open', 'gazzelle-hoodie.jpg'),
('Cani''s Distorted Axe', 'The guitar that screamed its soul out on Cani''s greatest tour. Slightly battered, very indie rock.', 300.0, 450.0, '2025-01-25', 3, 2, 'open', 'cani-guitar.jpg'),
('Pop X''s Head Torch', 'Illuminate your path to indie stardom with the iconic head torch worn by Pop X during their most chaotic concert. Perfect for late-night gigs, impromptu karaoke sessions, or just finding your way to the fridge at 3 AM. Still carries traces of glitter, sweat, and unfiltered genius. Warning: May inspire spontaneous interpretive dance.', 100.0, 125.0, '2025-02-10', 1, 2, 'open', 'popx-torch.jpg'),
('Vintage Vinyl of Vasco Brondi', 'A scratched but lovable record from Vasco Brondi, still good for late-night cries.', 20.0, 40.0, '2024-02-20', 2, 1, 'open', 'vascobrondi-vinyl.jpg'),
('Indie Rock Mystery Box', 'A surprise collection of random memorabilia from your favorite indie rock artists. Who knows what you''ll get?', 50.0, 100.0, '2024-03-28', 3, 1, 'open', 'mystery-box.jpg');

INSERT IGNORE INTO bids (amount, auction_id, user_id, is_winning_bid) VALUES
(40.0, 1, 2, FALSE),
(43.0, 1, 3, FALSE),
(48.0, 1, 2, FALSE),
(50.0, 1, 3, TRUE),
(45.0, 2, 1, FALSE),
(50.0, 2, 3, FALSE),
(60.0, 2, 1, FALSE),
(70.0, 2, 3, TRUE),
(350.0, 3, 1, FALSE),
(370.0, 3, 2, FALSE),
(400.0, 3, 1, FALSE),
(450.0, 3, 2, TRUE),
(110.0, 4, 3, FALSE),
(115.0, 4, 2, FALSE),
(120.0, 4, 3, FALSE),
(125.0, 4, 2, TRUE),
(30.0, 5, 3, FALSE),
(40.0, 5, 1, TRUE),
(70.0, 6, 2, FALSE),
(100.0, 6, 1, TRUE);

CREATE OR REPLACE VIEW v_auction_user AS
SELECT 
    a.id AS auction_id,
    a.title AS auction_title,
    a.description AS auction_description,
    a.start_price,
    a.current_price,
    a.end_date,
    a.user_id AS auction_creator_id,
    a.winner_id,
    a.status,
    a.image AS auction_image,
    a.created_at AS created_at,
    a.updated_at AS updated_at,
    a.is_deleted,
    u.id AS user_id,
    u.username AS user_username,
    u.name AS user_name,
    u.surname AS user_surname,
    u.image AS user_image
FROM 
    auctions a
JOIN 
    users u
ON 
    a.user_id = u.id;

CREATE OR REPLACE VIEW v_auction_details AS
SELECT
    a.id AS auction_id,
    a.title AS auction_title,
    a.description AS auction_description,
    a.image AS auction_image,
    a.start_price AS start_price,
    a.current_price AS current_price,
    a.end_date AS end_date,
    a.status AS status,
    a.is_deleted,
    a.winner_id AS winner_id,
    w.name AS winner_name,
    w.surname AS winner_surname,
    w.username AS winner_username,
    w.image AS winner_image,
    a.user_id AS user_id,
    u.name AS user_name,
    u.surname AS user_surname,
    u.username AS user_username,
    u.image AS user_image,
    b.id AS bid_id,
    b.amount AS bid_amount,
    b.user_id AS bidder_id,
    b.auction_id AS bid_auction_id,
    CASE 
        WHEN b.amount = (
            SELECT MAX(b2.amount)
            FROM bids b2
            WHERE b2.auction_id = b.auction_id
        )
        THEN 1
        ELSE 0
    END AS is_winning_bid,
    b.created_at AS bid_created_at,
    CASE 
        WHEN b.amount = (
            SELECT MAX(b2.amount)
            FROM bids b2
            WHERE b2.auction_id = b.auction_id
        ) AND a.status = 'closed'
        THEN 'bi bi-trophy-fill'
        WHEN b.amount = (
            SELECT MAX(b2.amount)
            FROM bids b2
            WHERE b2.auction_id = b.auction_id
        )
        THEN 'bi bi-star-fill'
        ELSE ''
    END AS bid_icon
FROM
    auctions a
LEFT JOIN
    users u ON a.user_id = u.id
LEFT JOIN
    users w ON a.winner_id = w.id
LEFT JOIN
    bids b ON a.id = b.auction_id;

CREATE OR REPLACE VIEW v_user_details AS
SELECT
    u.id AS user_id,
    u.name AS user_name,
    u.surname AS user_surname,
    u.username AS user_username,
    u.image AS user_image,
    a.id AS auction_id,
    a.title AS auction_title,
    a.description AS auction_description,
    a.image AS auction_image,
    a.start_price AS start_price,
    a.current_price AS current_price,
    a.end_date AS end_date,
    a.status AS status,
    a.is_deleted,
    a.winner_id AS winner_id,
    w.name AS winner_name,
    w.surname AS winner_surname,
    w.username AS winner_username,
    w.image AS winner_image,
    b.id AS bid_id,
    b.amount AS bid_amount,
    b.user_id AS bidder_id,
    b.auction_id AS bid_auction_id,
    CASE 
        WHEN b.amount = (
            SELECT MAX(b2.amount)
            FROM bids b2
            WHERE b2.auction_id = b.auction_id
        )
        THEN 1
        ELSE 0
    END AS is_winning_bid,
    b.created_at AS bid_created_at,
    CASE 
        WHEN b.amount = (
            SELECT MAX(b2.amount)
            FROM bids b2
            WHERE b2.auction_id = b.auction_id
        ) AND a.status = 'closed'
        THEN 'bi bi-trophy-fill'
        WHEN b.amount = (
            SELECT MAX(b2.amount)
            FROM bids b2
            WHERE b2.auction_id = b.auction_id
        )
        THEN 'bi bi-star-fill'
        ELSE ''
    END AS bid_icon
FROM
    users u
LEFT JOIN auctions a ON u.id = a.user_id
LEFT JOIN users w ON w.id = a.winner_id 
LEFT JOIN bids b ON a.id = b.auction_id;

CREATE OR REPLACE VIEW v_bid_details AS
SELECT 
    b.id AS bid_id,
    b.auction_id,
    b.amount AS bid_amount,
    b.is_winning_bid AS is_winning_bid,
    b.created_at AS bid_created_at,
    u.id AS user_id,
    u.name AS bidder_name,
    u.surname AS bidder_surname,
    u.username AS bidder_username,
    u.image AS user_image,
    a.status,
    CASE 
        WHEN b.amount = (
            SELECT MAX(b2.amount)
            FROM bids b2
            WHERE b2.auction_id = b.auction_id
        ) AND a.status = 'closed'
        THEN 'bi bi-trophy-fill'
        WHEN b.amount = (
            SELECT MAX(b2.amount)
            FROM bids b2
            WHERE b2.auction_id = b.auction_id
        )
        THEN 'bi bi-star-fill'
        ELSE ''
    END AS bid_icon
FROM 
    bids b
JOIN 
    users u
ON 
    b.user_id = u.id
JOIN auctions a
ON 
a.id = b.auction_id;
