INSERT INTO trapit.role VALUES
    (1, "admin"),
    (2, "reviewer"),
    (3, "viewer"); 

INSERT INTO trapit.project VALUES
    (1, "project1"),
    (2, "project2"),
    (3, "project3");  

INSERT INTO trapit.user
    (user_id, username, password, role_id)
VALUES
    (1, "admin", "$2b$10$AP4xtsOur0knwrq1ObleYekiJ52Z482DxXTmEXKRA7DFfSuGSFnu2", 1),
    (2, "reviewer", "$2b$10$AP4xtsOur0knwrq1ObleYekiJ52Z482DxXTmEXKRA7DFfSuGSFnu2", 2),
    (3, "viewer", "$2b$10$AP4xtsOur0knwrq1ObleYekiJ52Z482DxXTmEXKRA7DFfSuGSFnu2", 3),
    (4, "Dejan Bordjan", "$2b$10$AP4xtsOur0knwrq1ObleYekiJ52Z482DxXTmEXKRA7DFfSuGSFnu2", 3),
    (5, "Urša Fležar", "$2b$10$AP4xtsOur0knwrq1ObleYekiJ52Z482DxXTmEXKRA7DFfSuGSFnu2", 1),
    (6, "Jernej Javornik", "$2b$10$AP4xtsOur0knwrq1ObleYekiJ52Z482DxXTmEXKRA7DFfSuGSFnu2", 3),
    (7, "Lovro Stopar", "$2b$10$AP4xtsOur0knwrq1ObleYekiJ52Z482DxXTmEXKRA7DFfSuGSFnu2", 3),
    (8, "Tadej Murn", "$2b$10$AP4xtsOur0knwrq1ObleYekiJ52Z482DxXTmEXKRA7DFfSuGSFnu2", 3),
    (9, "Frowin Feurstein", "$2b$10$AP4xtsOur0knwrq1ObleYekiJ52Z482DxXTmEXKRA7DFfSuGSFnu2", 3),
    (10, "Gregor Marolt", "$2b$10$AP4xtsOur0knwrq1ObleYekiJ52Z482DxXTmEXKRA7DFfSuGSFnu2", 3),
    (11, "Miha Predalič", "$2b$10$AP4xtsOur0knwrq1ObleYekiJ52Z482DxXTmEXKRA7DFfSuGSFnu2", 3),
    (12, "Lan Hočevar", "$2b$10$AP4xtsOur0knwrq1ObleYekiJ52Z482DxXTmEXKRA7DFfSuGSFnu2", 3);