drop database  if exists scorrow;

create database scorrow;

use scorrow;

create table obstacle
(
	obstacle_id int unsigned not null auto_increment,
    primary key (obstacle_id),
    name varchar(20) not null unique,
    difficulty int
);

create table Parkour
(
	Parkour_id int unsigned not null auto_increment,
    primary key (Parkour_id),
    name varchar(20) not null unique,
    difficulty int
);

-- obstacle_nr is used for restoring a session, so we know where we stopped

create table Parkour_obstacle
(
	Parkour_id int unsigned not null,
    obstacle_id int unsigned not null,
    obstacle_nr int not null,
    constraint Parkour_obstacle_pk primary key (Parkour_id, obstacle_id),
    constraint Parkour_obstacle_fk1 foreign key (Parkour_id) references Parkour (Parkour_id),
    constraint Parkour_obstacle_fk2 foreign key (obstacle_id) references obstacle (obstacle_id)
);

-- current_player and current_obstacle is used for restoring a session,
-- so we know where we stopped

create table session
(
	session_id int unsigned not null auto_increment,
    primary key (session_id),
    Parkour_id int unsigned not null,
    name varchar(100),
    player_count int,
    obstacle_count int,
    current_player int,
    current_obstacle int,
    constraint session_fk foreign key (Parkour_id) references Parkour (Parkour_id)
);

-- player_nr is used for restoring a session, so we know where we stopped

create table player
(
	player_id int unsigned not null auto_increment,
    primary key (player_id),
    name varchar(30),
    player_nr int, 
    session_id int unsigned not null,
    constraint playerfk foreign key (session_id) references session (session_id)
);

create table score
(
	score_id int unsigned not null auto_increment,
    primary key (score_id),
    points int unsigned not null,
    attempt int unsigned not null,
    circle int unsigned not null,
    constraint score_attempts check (attempt < 4 AND attempt > 0),
    constraint score_circle check (circle < 4 AND circle >= 0)
);

create table shot
(
	session_id int unsigned not null,
    player_id int unsigned not null,
    obstacle_id int unsigned not null,
    score_id int unsigned not null,
    constraint shotpk primary key (session_id, player_id, obstacle_id, score_id),
    constraint shotfk1 foreign key (player_id) references player (player_id),
    constraint shotfk2 foreign key (obstacle_id) references obstacle (obstacle_id),
    constraint shotfk3 foreign key (score_id) references score (score_id),
	constraint shotfk4 foreign key (session_id) references session (session_id)
);
    

