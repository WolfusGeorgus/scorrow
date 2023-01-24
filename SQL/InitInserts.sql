-- Init Inserts

insert into obstacle (name) values
	("Schaf"), ("Ziege"), ("Pferd"), ("Löwe"), ("Tiger"), ("Hahn"), ("Bär"), ("Elefant"), ("Reh"), ("Falke"), ("Nashorn"), ("Zebra"), ("Antilope"), ("Fuchs"), ("Wolf"), ("Dachs"), ("Wildschwein"), ("Fisch");

-- insert Parkour
insert into parkour 
	(name) values ("Easy Parkour"), ("Medium Parkour");
    
insert into parkour_obstacle (parkour_id, obstacle_id, obstacle_nr) values
	(1, 1, 1), (1, 2, 2), (1, 3, 3), (2, 5, 1), (2, 7, 2), (2, 8, 3);
    
-- insert scorepoints
insert into score (points, attempt, circle, count_type) values 
	(20, 1, 1, 3),
	(18, 1, 2, 3),
	(16, 1, 3, 3),
	(14, 2, 1, 3),
	(12, 2, 2, 3),
	(10, 2, 3, 3),
	(8, 3, 1, 3),
	(6, 3, 2, 3),
	(4, 3, 3, 3),
    (0, 3, 0, 3),
    
    (20, 1, 1, 2),
    (16, 1, 2, 2),
    (12, 1, 3, 2),
    (10, 2, 1, 2),
    (6, 2, 2, 2),
    (2, 2, 3, 2);


