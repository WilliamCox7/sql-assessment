var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var massive = require('massive');
var config = require('./config');
//Need to enter username and password for your database
var connString = "postgres://postgres:" + config.password + "@localhost:4000/assessbox";

var app = express();

app.use(bodyParser.json());
app.use(cors());

//The test doesn't like the Sync version of connecting,
//  Here is a skeleton of the Async, in the callback is also
//  a good place to call your database seeds.
var db = massive.connect({connectionString : connString},
  function(err, localdb){
    db = localdb;
    app.set('db', db);

    db.user_create_seed(function(err, res){
      console.log("User Table Init");
      db.vehicle_create_seed(function(err, res){
        console.log("Vehicle Table Init")
      });
    });

});

app.get('/api/users', (req, res) => {
  db.getUsers((err, users) => {
    res.status(200).send(users);
  });
});

app.get('/api/vehicles', (req, res) => {
  db.getVehicles((err, vehicles) => {
    res.status(200).send(vehicles);
  });
});

app.post('/api/users', (req, res) => {
  let newUser = [
    req.body.firstname,
    req.body.lastname,
    req.body.email
  ];
  db.addUser(newUser, (err, user) => {
    res.status(200).send(user);
  });
});

app.post('/api/vehicles', (req, res) => {
  let newVehicle = [
    req.body.make,
    req.body.model,
    req.body.year,
    req.body.ownerid
  ];
  db.addVehicle(newVehicle, (err, vehicle) => {
    res.status(200).send(vehicle);
  });
});

app.get('/api/user/:userId/vehiclecount', (req, res) => {
  db.getVehicleCount(req.params.userId, (err, count) => {
    res.status(200).send({count:count[0].count});
  });
});

app.get('/api/user/:userId/vehicle', (req, res) => {
  db.getUserVehicles(req.params.userId, (err, vehicles) => {
    res.status(200).send(vehicles);
  });
});

app.get('/api/vehicle', (req, res) => {
  if (req.query.UserEmail) {
    db.getVehiclesByEmail(req.query.UserEmail, (err, vehicles) => {
      res.status(200).send(vehicles);
    });
  } else if (req.query.userFirstStart) {
    let qry = req.query.userFirstStart;
    db.getVehiclesAndFirst((err, userInfo) => {
      let matches = userInfo.filter((info) => {
        return info.firstname.substring(0, qry.length) === qry;
      });
      res.status(200).send(matches);
    });
  }
});

app.get('/api/newervehiclesbyyear', (req, res) => {
  db.getNewestVehicles((err, info) => {
    res.status(200).send(info);
  });
});

app.put('/api/vehicle/:vehicleId/user/:userId', (req, res) => {
  db.changeOwnership(req.params.vehicleId, req.params.userId, (err, vehicle) => {
    res.status(200).send(vehicle);
  });
});

app.delete('/api/user/:userId/vehicle/:vehicleId', (req, res) => {
  db.removeOwnership(req.params.userId, req.params.vehicleId, (err, vehicle) => {
    res.status(200).send(vehicle);
  });
});

app.delete('/api/vehicle/:vehicleId', (req, res) => {
  db.removeVehicle(req.params.vehicleId, (err, vehicle) => {
    res.status(200).send(vehicle);
  });
});

app.listen('3000', function(){
  console.log("Successfully listening on : 3000")
});

module.exports = app;
