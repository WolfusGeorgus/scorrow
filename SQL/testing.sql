-- insert parkour
insert into parkour 
	(name) values ("Easy parkour"), ("Medium parkour"), ("Hard parkour");

-- get last id which was inserted with mysql (https://stackoverflow.com/questions/897356/php-mysql-insert-row-then-get-id)
-- mysqli_

-- insert obstacles into parkour
insert into obstacle_parkour
	(parkour_id, obstacle_id, obstacle_nr) values 
    (lastInsertedId, obstacleId, 1);
    
select * from obstacle where obstacle_id in (1, 2, 3);

select * from parkour;

commit;

delete from parkour_obstacle where parkour_id != 1;

delete from parkour where name ="Hello";

select * from parkour_obstacle;

SELECT o.obstacle_id, o.name FROM obstacle o, parkour_obstacle po, parkour p WHERE
    o.obstacle_id = po.obstacle_id AND po.parkour_id = p.parkour_id AND p.name = 'Easy Parkour';