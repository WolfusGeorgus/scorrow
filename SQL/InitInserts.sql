-- Init Inserts

insert into obstacle (name) values
	("Schaf"), ("Ziege"), ("Pferd"), ("Löwe"), ("Tiger"), ("Hahn"), ("Bär"), ("Elefant"), ("Reh"), ("Falke"), ("Nashorn"), ("Zebra"), ("Antilope"), ("Fuchs"), ("Wolf"), ("Dachs"), ("Wildschwein"), ("Fisch");

-- insert Parkour
insert into Parkour 
	(name) values ("Easy Parkour"), ("Medium Parkour");
    
-- insert scorepoints
insert into score (points, attempt, circle) values 
	(20, 1, 1),
	(18, 1, 2),
	(16, 1, 3),
	(14, 2, 1),
	(12, 2, 2),
	(10, 2, 3),
	(8, 3, 1),
	(6, 3, 2),
	(4, 3, 3);


