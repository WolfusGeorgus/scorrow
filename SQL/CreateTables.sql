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

create table parkour
(
	parkour_id int unsigned not null auto_increment,
    primary key (parkour_id),
    name varchar(20) not null unique,
    location varchar(30),
    difficulty int
);

-- obstacle_nr is used for restoring a session, so we know where we stopped

create table parkour_obstacle
(
	parkour_id int unsigned not null,
    obstacle_id int unsigned not null,
    obstacle_nr int not null,
    constraint parkour_obstacle_pk primary key (parkour_id, obstacle_id),
    constraint parkour_obstacle_fk1 foreign key (parkour_id) references parkour (parkour_id),
    constraint parkour_obstacle_fk2 foreign key (obstacle_id) references obstacle (obstacle_id)
);

-- current_player and current_obstacle is used for restoring a session,
-- so we know where we stopped

create table session
(
	session_id varchar(8),
    primary key (session_id),
	parkour_id int unsigned not null,
    player_count int,
    obstacle_count int,
    current_player int,
    current_obstacle int,
    constraint session_fk foreign key (parkour_id) references parkour (parkour_id)
);

-- player_nr is used for restoring a session, so we know where we stopped

create table player
(
	player_id int unsigned not null auto_increment,
    primary key (player_id),
    firstname varchar(30),
    lastname varchar(30),
    nickname varchar(30),
    player_nr int, 
    session_id varchar(8),
    constraint playerfk foreign key (session_id) references session (session_id)
);

create table score
(
	score_id int unsigned not null auto_increment,
    primary key (score_id),
    points int unsigned not null,
    attempt int unsigned not null,
    circle int unsigned not null,
    count_type int unsigned not null,
    constraint score_attempts check (attempt < 4 AND attempt > 0),
    constraint score_circle check (circle < 4 AND circle >= 0)
);

create table shot
(
	session_id varchar(8),
    player_id int unsigned not null,
    obstacle_id int unsigned not null,
    score_id int unsigned not null,
    constraint shotpk primary key (session_id, player_id, obstacle_id, score_id),
    constraint shotfk1 foreign key (player_id) references player (player_id),
    constraint shotfk2 foreign key (obstacle_id) references obstacle (obstacle_id),
    constraint shotfk3 foreign key (score_id) references score (score_id),
	constraint shotfk4 foreign key (session_id) references session (session_id)
);
    
create table user
(
	user_id int unsigned not null auto_increment,
    primary key (user_id),
    firstname varchar(30),
    lastname varchar(30),
    nickname varchar(30) unique,
    password varchar(100)
);

create table user_parkour
(
	user_id int unsigned not null,
    parkour_id int unsigned not null,
    primary key (user_id, parkour_id),
    foreign key (user_id) references user (user_id),
    foreign key (parkour_id) references parkour (parkour_id)
);

