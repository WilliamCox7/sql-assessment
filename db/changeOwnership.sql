UPDATE Vehicles SET ownerid = $2 WHERE id = $1
RETURNING *;
