-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Sep 26, 2019 at 11:38 PM
-- Server version: 5.7.23
-- PHP Version: 7.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `users`
--

-- --------------------------------------------------------

--
-- Table structure for table `feed`
--

CREATE TABLE `feed` (
  `feed_id` int(11) NOT NULL,
  `feed_img` varchar(255) NOT NULL,
  `feed_text` text NOT NULL,
  `user_id` int(11) NOT NULL,
  `feed_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `feed`
--

INSERT INTO `feed` (`feed_id`, `feed_img`, `feed_text`, `user_id`, `feed_date`) VALUES
(1, '/img/upload_images/cat.jpg', 'I love my cat!', 2, '2019-09-25 08:40:29'),
(2, '/img/upload_images/roses.jpg', 'I discovered this beautiful garden near my home.', 1, '2019-09-25 09:55:29'),
(3, '/img/upload_images/racoon.jpg', 'This racoon came to my garden. ', 4, '2019-09-26 06:05:29'),
(4, '/img/upload_images/sake.jpeg', 'These are my favorite.', 5, '2019-09-26 08:40:29'),
(5, '/img/upload_images/rose.jpg', 'Finally bloomed!', 1, '2019-09-29 21:01:18'),
(6, '/img/upload_images/spacex-uj3hvdfQujI-unsplash.jpg', 'Space X', 5, '2019-09-29 22:54:55'),
(7, '/img/upload_images/spacex-9dF7pCyaM9s-unsplash.jpg', 'Another Space X', 5, '2019-09-29 23:00:18');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `mob_no` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `prof_pic_path` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `mob_no`, `user_name`, `password`, `prof_pic_path`) VALUES
(1, 'Mihoko', 'S', 1234567890, 'miho123', 'miho123', '/img/profile_images/david-edelstein-N4DbvTUDikw-unsplash.jpg'),
(2, 'Miho', 'I', 1234567890, 'miho1234', 'miho1234', '/img/default-profile.jpg'),
(3, 'aaa', 'aaaa', 88888888, 'aaaa@gmail.com', 'jjjjjjj', '/img/default-profile.jpg'),
(4, 'Bbb', 'Bbb', 2121212121, 'bbb@test.com', 'bbb', '/img/default-profile.jpg'),
(5, 'ccc', 'ccc', 55555, 'ccc@test.com', 'ccc', '/img/profile_images/bg_uchu_space.jpg'),
(6, 'ppp', 'ppp', 1234567890, 'ppp@test.com', 'ppp', '/img/default-profile.jpg'),
(7, 'zzz', 'zzzz', 12345, 'zzz@test.com', 'zzz', '/img/default-profile.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `feed`
--
ALTER TABLE `feed`
  ADD PRIMARY KEY (`feed_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `feed`
--
ALTER TABLE `feed`
  MODIFY `feed_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
