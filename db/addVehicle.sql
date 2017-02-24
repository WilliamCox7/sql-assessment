INSERT INTO Vehicles (make, model, year, ownerid)
VALUES ( $1, $2, $3, $4 ) RETURNING *;
