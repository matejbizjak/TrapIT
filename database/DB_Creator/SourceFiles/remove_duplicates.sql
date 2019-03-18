SET SQL_SAFE_UPDATES = 0;
DELETE FROM media USING media, (SELECT media.media_id AS media_id FROM media, (SELECT * FROM media) AS temp 
								WHERE media.media_id < temp.media_id
                                AND media.name = temp.name 
								AND media.path_id = temp.path_id 
								AND media.media_id != temp.media_id) AS tempTable
								WHERE media.media_id = tempTable.media_id;
SET SQL_SAFE_UPDATES = 1;