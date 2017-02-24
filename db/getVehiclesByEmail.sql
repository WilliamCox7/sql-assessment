SELECT users.email, vehicles.id, vehicles.make, vehicles.model, vehicles.year, vehicles.ownerid FROM vehicles INNER JOIN users
ON vehicles.ownerid = users.id
WHERE email = $1;
