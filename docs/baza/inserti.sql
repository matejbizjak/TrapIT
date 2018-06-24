INSERT INTO trapit.role
VALUES 	(1, "admin"),
		(2, "reviewer"),
        (3, "viewer");
        
INSERT INTO trapit.project
VALUES 	(1, "project1"),
		(2, "project2"),
        (3, "project3");
		
        
INSERT INTO `trapit`.`user`
(`user_id`, `username`, `password`, `roleIdRoleId`)
VALUES
(1, "admin", "$2b$10$AP4xtsOur0knwrq1ObleYekiJ52Z482DxXTmEXKRA7DFfSuGSFnu2", 1),
(2, "reviewer", "$2b$10$AP4xtsOur0knwrq1ObleYekiJ52Z482DxXTmEXKRA7DFfSuGSFnu2", 2),
(3, "viewer", "$2b$10$AP4xtsOur0knwrq1ObleYekiJ52Z482DxXTmEXKRA7DFfSuGSFnu2", 3);