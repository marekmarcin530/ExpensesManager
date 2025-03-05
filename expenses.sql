-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 08 Kwi 2024, 23:59
-- Wersja serwera: 10.4.27-MariaDB
-- Wersja PHP: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `expenses`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `savings`
--

CREATE TABLE `savings` (
  `Id` int(11) NOT NULL,
  `Kwota` varchar(255) NOT NULL,
  `Kategoria` varchar(255) NOT NULL,
  `Wlasciciel` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Zrzut danych tabeli `savings`
--

INSERT INTO `savings` (`Id`, `Kwota`, `Kategoria`, `Wlasciciel`) VALUES
(1, '500', 'Auto', 'Marcin'),
(2, '340', 'Dom', 'Marcin'),
(3, '500', 'Auto', 'aa'),
(4, '60', 'Dom', 'aa'),
(5, '45', 'Inne', 'aa');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `savingsdeposits`
--

CREATE TABLE `savingsdeposits` (
  `Id` int(11) NOT NULL,
  `Kwota` int(11) NOT NULL,
  `Wlasciciel` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Zrzut danych tabeli `savingsdeposits`
--

INSERT INTO `savingsdeposits` (`Id`, `Kwota`, `Wlasciciel`) VALUES
(1, 195, 'aa');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `Id` int(11) NOT NULL,
  `Imie` varchar(255) NOT NULL,
  `Nazwisko` varchar(255) NOT NULL,
  `Haslo` varchar(255) NOT NULL,
  `Telefon` int(11) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Nr_Wydadkow` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Zrzut danych tabeli `users`
--

INSERT INTO `users` (`Id`, `Imie`, `Nazwisko`, `Haslo`, `Telefon`, `Email`, `Nr_Wydadkow`) VALUES
(1, 'aa', 'aa', 'aa', 11, 'aa@aa', NULL),
(2, 'Admin', 'Admin', 'admin', 530012932, 'admin@admin', NULL),
(3, 'Marcin', 'Marek', '123456', 123456789, 'marcin@gmail.com', NULL);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `wydatki`
--

CREATE TABLE `wydatki` (
  `Id` int(255) NOT NULL,
  `Kwota` varchar(255) NOT NULL,
  `Kategoria` varchar(255) NOT NULL,
  `Data` varchar(255) NOT NULL,
  `Wlasciciel` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Zrzut danych tabeli `wydatki`
--

INSERT INTO `wydatki` (`Id`, `Kwota`, `Kategoria`, `Data`, `Wlasciciel`) VALUES
(5, '552', 'Dom', '2024-01-05', 'Admin'),
(6, '50', 'Zakupy', '2024-01-20', 'Admin'),
(7, '32', 'test', '2024-01-10', 'Admin'),
(11, '23', 'dsa', '2024-01-11', 'Admin'),
(12, '32', 'ads', '2024-01-06', 'Admin'),
(15, '350', 'Dom', '2024-03-20', 'aa'),
(20, '222', 'Wakacje', '2024-04-01', 'aa'),
(21, '532', 'Auto', '2024-04-02', 'aa'),
(22, '123', 'Zakupy', '2024-04-01', 'Marcin'),
(23, '321', 'Głupoty', '2024-04-02', 'Marcin'),
(24, '50', 'Prezent', '2024-04-03', 'Marcin'),
(25, '600', 'Naprawy', '2024-04-04', 'Marcin');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `savings`
--
ALTER TABLE `savings`
  ADD PRIMARY KEY (`Id`);

--
-- Indeksy dla tabeli `savingsdeposits`
--
ALTER TABLE `savingsdeposits`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Wlasciciel` (`Wlasciciel`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`Id`);

--
-- Indeksy dla tabeli `wydatki`
--
ALTER TABLE `wydatki`
  ADD PRIMARY KEY (`Id`);

--
-- AUTO_INCREMENT dla zrzuconych tabel
--

--
-- AUTO_INCREMENT dla tabeli `savings`
--
ALTER TABLE `savings`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT dla tabeli `savingsdeposits`
--
ALTER TABLE `savingsdeposits`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT dla tabeli `users`
--
ALTER TABLE `users`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT dla tabeli `wydatki`
--
ALTER TABLE `wydatki`
  MODIFY `Id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
