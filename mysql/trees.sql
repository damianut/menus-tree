-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Czas generowania: 25 Cze 2020, 18:16
-- Wersja serwera: 8.0.20
-- Wersja PHP: 7.2.24-0ubuntu0.18.04.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `nav_tree`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `trees`
--

CREATE TABLE `trees` (
  `id` int NOT NULL,
  `uuid` tinytext NOT NULL,
  `tree` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Zrzut danych tabeli `trees`
--

INSERT INTO `trees` (`id`, `uuid`, `tree`) VALUES
(1, '1c6d7e6d-7c81-4931-8343-d3a36ad17659', '{\"Menu\":{},\"Menu 2\":{},\"Menu 3\":{\"Menu 14\":{},\"Menu 4\":{\"Menu 6\":{},\"Menu 7\":{},\"Menu 8\":{\"Menu 9\":{},\"Menu 10\":{},\"Menu 11\":{}}},\"Menu 5\":{}}}');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `trees`
--
ALTER TABLE `trees`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT dla tabel zrzutów
--

--
-- AUTO_INCREMENT dla tabeli `trees`
--
ALTER TABLE `trees`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
