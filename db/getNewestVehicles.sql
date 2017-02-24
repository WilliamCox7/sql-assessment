SELECT vehicles.year, users.firstname, users.lastname FROM Vehicles INNER JOIN Users
ON vehicles.ownerid = users.id
WHERE vehicles.year > 2000
ORDER BY vehicles.year DESC;
