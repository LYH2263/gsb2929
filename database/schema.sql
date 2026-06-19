CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    stock INT DEFAULT 0,
    category VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'paid',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255),
    product_image VARCHAR(255),
    product_category VARCHAR(50),
    quantity INT DEFAULT 1,
    price DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO products (name, description, price, image_url, stock, category) VALUES
('至臻无线降噪耳机', '高品质音质，采用先进的降噪技术，为您带来沉浸式听觉体验。', 1999.00, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 50, '数码电子'),
('智能手表 Pro', '全天候监测您的健身数据、心率和通知，是您的完美生活助手。', 1299.50, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', 100, '数码电子'),
('经典真皮双肩包', '耐用且时尚的多功能背包，适合日常工作和旅行使用。', 585.00, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', 30, '时尚配饰'),
('人体工学静音鼠标', '专为长时间办公设计，舒适握感，静音点击不喧哗。', 256.99, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', 150, '办公外设'),
('RGB 机械键盘', '酷炫的 RGB 背光，手感清脆的机械轴体，电竞办公两相宜。', 820.00, 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500', 20, '办公外设');
