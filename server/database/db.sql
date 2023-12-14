CREATE DATABASE IF NOT EXISTS usof;
use usof;

CREATE USER IF NOT EXISTS 'atrubnikov' IDENTIFIED BY 'securepass';
GRANT ALL PRIVILEGES ON usof.* TO 'atrubnikov'@'localhost';

CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    login varchar(30) UNIQUE NOT NULL,
    password varchar(255) NOT NULL,
    full_name varchar(255) NOT NULL,
    avatar varchar(255) NOT NULL DEFAULT 'default.jpg',
    email varchar(255) NOT NULL,
    role ENUM('Admin', 'User') DEFAULT 'User',
	rating INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS posts(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    author_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image varchar(255) NULL,
    status ENUM ('active', 'inactive') NOT NULL DEFAULT 'active',
    publishDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS posts_categories (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    category_id INT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categories(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS comments (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    author_id INT NOT NULL,
    postId INT NOT NULL,
    content TEXT NOT NULL,
    publishDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM ('active', 'inactive') NOT NULL DEFAULT 'active',
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS likes_post (
    id INT NOT NULL PRIMARY KEY  AUTO_INCREMENT,
    author_id INT NOT NULL,
    post_id INT NOT NULL,
    publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type ENUM ('like', 'dislike') NOT NULL,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS likes_comment (
    id INT NOT NULL PRIMARY KEY  AUTO_INCREMENT,
    author_id INT NOT NULL,
    comment_id INT NOT NULL,
    publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type ENUM ('like', 'dislike') NOT NULL,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS category_favorites (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);