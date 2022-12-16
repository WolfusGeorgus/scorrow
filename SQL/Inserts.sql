-- insert obstacle
insert into obstacle
	(name) values ("sheep");
    
-- insert Parkour
insert into Parkour 
	(name) values ("Easy Parkour");
    
-- insert obstacles into Parkour
insert into parkour_obstacle
	(Parkour_id, obstacle_id, obstacle_nr) values (
    (select Parkour_id from Parkour where name = "Easy Parkour"),
	(select obstacle_id from obstacle where name = "Sheep")
    , 1);

-- insert new session
Insert  into session 
	(Parkour_id) values
    ((select Parkour_id from Parkour where name = "Easy Parkour"));

-- insert players
insert into player (name, session_id, player_nr)
	values ("Georg", 10, 1);