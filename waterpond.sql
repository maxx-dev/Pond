-- phpMyAdmin SQL Dump
-- version 3.2.4
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Aug 22, 2013 at 11:45 PM
-- Server version: 5.1.44
-- PHP Version: 5.3.1

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `waterpond`
--

-- --------------------------------------------------------

--
-- Table structure for table `Flowers`
--

CREATE TABLE IF NOT EXISTS `Flowers` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `PosX` float NOT NULL,
  `PosY` float NOT NULL,
  `Radius` float NOT NULL,
  `Rotate` int(11) NOT NULL,
  `Image` int(90) NOT NULL,
  `Group` int(11) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `Flowers`
--

INSERT INTO `Flowers` (`ID`, `PosX`, `PosY`, `Radius`, `Rotate`, `Image`, `Group`) VALUES
(1, 0.198958, 0.330556, 100, 0, 0, 0),
(2, 0.220313, 0.738889, 100, 0, 1, 1),
(3, 0.780729, 0.25, 100, 0, 2, 2),
(4, 0.68125, 0.772222, 100, 0, 3, 3);

-- --------------------------------------------------------

--
-- Table structure for table `Leafs`
--

CREATE TABLE IF NOT EXISTS `Leafs` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `PosX` float NOT NULL,
  `PosY` float NOT NULL,
  `Radius` float NOT NULL,
  `Rotate` int(11) NOT NULL,
  `Image` int(90) NOT NULL,
  `Title` varchar(90) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `Val` float NOT NULL,
  `Group` int(11) NOT NULL,
  `GroupMember` int(11) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=396 ;

--
-- Dumping data for table `Leafs`
--

INSERT INTO `Leafs` (`ID`, `PosX`, `PosY`, `Radius`, `Rotate`, `Image`, `Title`, `Val`, `Group`, `GroupMember`) VALUES
(1, 0.0942708, 0.326852, 70, 20, 1, 'Hana Dev Edition', 2.477, 0, 0),
(2, 0.155729, 0.230556, 70, 30, 3, 'Live Customers', 248, 0, 1),
(3, 0.240104, 0.207407, 80, 0, 0, 'Hana One Premium', 0, 0, 2),
(4, 0.35, 0.273148, 50, 50, 5, 'Hana One', 614, 0, 3),
(5, 0.293229, 0.410185, 70, 80, 3, 'Hana Customers', 1385, 0, 4),
(6, 0.183333, 0.413889, 60, 220, 4, 'HEC Pipeline', 0, 0, 5),
(7, 0.19375, 0.601852, 70, -110, 1, 'Fiori Customers', 1, 1, 0),
(8, 0.273958, 0.703704, 70, -40, 3, 'Personas Pipeline', 11, 1, 1),
(9, 0.323958, 0.902778, 80, -20, 0, 'Customer Engagement', 50, 1, 2),
(10, 0.205729, 0.803704, 70, -70, 1, 'End User Agreement', 375, 1, 3),
(11, 0.155729, 0.863889, 50, 10, 2, 'Fiori Live', 1, 1, 4),
(12, 0.0864583, 0.697222, 80, 50, 0, 'Gateway Installations', 4.533, 1, 5),
(13, 0.829687, 0.168519, 80, -70, 0, 'Marketplace Apps', 39, 2, 0),
(14, 0.76875, 0.424074, 80, 60, 0, 'Marketplace Purchases', 2, 2, 1),
(15, 0.653125, 0.394444, 70, -40, 3, 'Marketplace PV', 3.405, 2, 2),
(16, 0.678646, 0.272222, 70, 30, 1, 'saphana.com UV April', 110, 2, 3),
(17, 0.686458, 0.537037, 70, 90, 1, 'saphana.com PV April', 458, 2, 4),
(18, 0.625, 0.655556, 70, 80, 3, 'Lumira Cloud', 0, 3, 0),
(19, 0.68125, 0.663889, 70, 90, 1, 'Lumira Desktop', 10.821, 3, 1),
(20, 0.813021, 0.634259, 50, 50, 2, 'HANA Apps', 69, 3, 2),
(21, 0.765104, 0.839815, 70, 10, 1, 'Lumira eStudio', 392, 3, 3),
(22, 0.573958, 0.792593, 70, 50, 3, 'Design Studio', 458, 3, 4),
(23, 0.706771, 0.9, 50, 10, 5, 'Neo', 39, 3, 5),
(24, 0.641667, 0.861111, 50, 130, 2, 'My Runway', 2, 3, 6);

-- --------------------------------------------------------

--
-- Table structure for table `savedFlowers`
--

CREATE TABLE IF NOT EXISTS `savedFlowers` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `PosX` double NOT NULL,
  `PosY` double NOT NULL,
  `Radius` float NOT NULL,
  `Rotate` int(11) NOT NULL,
  `Image` int(90) NOT NULL,
  `Group` int(11) NOT NULL,
  `expandStatus` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `savedFlowers`
--

INSERT INTO `savedFlowers` (`ID`, `PosX`, `PosY`, `Radius`, `Rotate`, `Image`, `Group`, `expandStatus`) VALUES
(1, 0.198958, 0.330556, 100, 0, 0, 0, 0),
(2, 0.220313, 0.738889, 100, 0, 1, 1, 0),
(3, 0.780729, 0.25, 100, 0, 2, 2, 0),
(4, 0.68125, 0.772222, 100, 0, 3, 3, 0);

-- --------------------------------------------------------

--
-- Table structure for table `savedLeafs`
--

CREATE TABLE IF NOT EXISTS `savedLeafs` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `PosX` double NOT NULL,
  `PosY` double NOT NULL,
  `Radius` float NOT NULL,
  `Rotate` int(11) NOT NULL,
  `Image` int(90) NOT NULL,
  `Title` varchar(90) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `Val` float NOT NULL,
  `Group` int(11) NOT NULL,
  `GroupMember` int(11) NOT NULL,
  `jointDistance` float NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=396 ;

--
-- Dumping data for table `savedLeafs`
--

INSERT INTO `savedLeafs` (`ID`, `PosX`, `PosY`, `Radius`, `Rotate`, `Image`, `Title`, `Val`, `Group`, `GroupMember`, `jointDistance`) VALUES
(1, 0.131263072165, 0.328160845553, 70, 20, 1, 'Hana Dev Edition', 2.477, 0, 0, 130),
(2, 0.157699627645, 0.235114577914, 70, 30, 3, 'Live Customers', 248, 0, 1, 130),
(3, 0.231770833333, 0.200925925926, 80, 0, 0, 'Hana One Premium', 0, 0, 2, 153.523),
(4, 0.266381136709, 0.319519587759, 50, 50, 5, 'Hana One', 614, 0, 3, 130),
(5, 0.257291308598, 0.391667185733, 70, 80, 3, 'Hana Customers', 1385, 0, 4, 130),
(6, 0.177546667928, 0.444749314273, 60, 220, 4, 'HEC Pipeline', 0, 0, 5, 130),
(7, 0.198253238418, 0.625083949823, 70, -110, 1, 'Fiori Customers', 1, 1, 0, 130),
(8, 0.283835092353, 0.697225754228, 70, -40, 3, 'Personas Pipeline', 11, 1, 1, 130),
(9, 0.270909675194, 0.81889516046, 80, -20, 0, 'Customer Engagement', 50, 1, 2, 130),
(10, 0.209425811572, 0.857688013265, 70, -70, 1, 'End User Agreement', 375, 1, 3, 130),
(11, 0.172369508363, 0.823892403301, 50, 10, 2, 'Fiori Live', 1, 1, 4, 130),
(12, 0.153612933543, 0.718126250025, 80, 50, 0, 'Gateway Installations', 4.533, 1, 5, 130),
(13, 0.830157491127, 0.167735959688, 80, -70, 0, 'Marketplace Apps', 39, 2, 0, 130),
(14, 0.810790236732, 0.357858558432, 80, 60, 0, 'Marketplace Purchases', 2, 2, 1, 130),
(15, 0.717575556727, 0.293420495952, 70, -40, 3, 'Marketplace PV', 3.405, 2, 2, 130),
(16, 0.718905638337, 0.200905828697, 70, 30, 1, 'saphana.com UV April', 110, 2, 3, 130),
(17, 0.753556745476, 0.360266802507, 70, 90, 1, 'saphana.com PV April', 458, 2, 4, 130),
(18, 0.633826564982, 0.686303603187, 70, 80, 3, 'Lumira Cloud', 0, 3, 0, 130),
(19, 0.683733248198, 0.651966454074, 70, 90, 1, 'Lumira Desktop', 10.821, 3, 1, 130),
(20, 0.739592445386, 0.711138007369, 50, 50, 2, 'HANA Apps', 69, 3, 2, 130),
(21, 0.742915547792, 0.821929340997, 70, 10, 1, 'Lumira eStudio', 392, 3, 3, 130),
(22, 0.613924485832, 0.785004761521, 70, 50, 3, 'Design Studio', 458, 3, 4, 130),
(23, 0.703905679698, 0.885653975254, 50, 10, 5, 'Neo', 39, 3, 5, 130),
(24, 0.639223491101, 0.866598230948, 50, 130, 2, 'My Runway', 2, 3, 6, 130);
