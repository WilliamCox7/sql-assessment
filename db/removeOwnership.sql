UPDATE Vehicles SET ownerid = null WHERE id = $2 AND ownerid = $1
RETURNING *;
