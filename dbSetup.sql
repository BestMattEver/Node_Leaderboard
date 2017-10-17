CREATE DATABASE leaderboard;
CREATE TABLE `Players` (
	`id` BIGINT(20) NOT NULL AUTO_INCREMENT,
	`player_name` VARCHAR(50) NOT NULL,
	`score` INT(11) NULL DEFAULT '0',
	`created_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	INDEX `Index 1` (`id`)
) COLLATE='utf8_general_ci' ENGINE=InnoDB AUTO_INCREMENT=5;

INSERT INTO `Players` (`id`, `player_name`, `score`, `created_date`) VALUES (1, 'Bob MrMan', 100, CURRENT_TIMESTAMP);
INSERT INTO `Players` (`id`, `player_name`, `score`, `created_date`) VALUES (2, 'Sally Ladyperson', 120, CURRENT_TIMESTAMP);
INSERT INTO `Players` (`id`, `player_name`, `score`, `created_date`) VALUES (3, 'Jhon Bigspender', 200, CURRENT_TIMESTAMP);

INSERT INTO `Players` (`id`, `player_name`, `score`, `created_date`) VALUES (4, 'Robby Danger', 30, CURRENT_TIMESTAMP);
INSERT INTO `Players` (`id`, `player_name`, `score`, `created_date`) VALUES (5, 'Lady Laquisha', 150, CURRENT_TIMESTAMP);
INSERT INTO `Players` (`id`, `player_name`, `score`, `created_date`) VALUES (6, 'Rex Fido', 210, CURRENT_TIMESTAMP);

INSERT INTO `Players` (`id`, `player_name`, `score`, `created_date`) VALUES (7, 'Kevin GamePlayer', 400, CURRENT_TIMESTAMP);
INSERT INTO `Players` (`id`, `player_name`, `score`, `created_date`) VALUES (8, 'Klaus Jorgenson', 20, CURRENT_TIMESTAMP);
INSERT INTO `Players` (`id`, `player_name`, `score`, `created_date`) VALUES (9, 'Winthrop Fancypants', 300, CURRENT_TIMESTAMP);

INSERT INTO `Players` (`id`, `player_name`, `score`, `created_date`) VALUES (10, 'Janet Boringface', 90, CURRENT_TIMESTAMP);
INSERT INTO `Players` (`id`, `player_name`, `score`, `created_date`) VALUES (11, 'Subrat Samson', 350, CURRENT_TIMESTAMP);
INSERT INTO `Players` (`id`, `player_name`, `score`, `created_date`) VALUES (12, 'Sasha Isaspy', 240, CURRENT_TIMESTAMP);
