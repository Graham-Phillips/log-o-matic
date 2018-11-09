/**
  manage api requests
**/

const express = require("express");

var MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const router = express.Router();

let mongoDb;
MongoClient.connect("mongodb://localhost:27017/test", (err, db) => {
  assert.equal(null, err);
  mongoDb = db;
});

router.post("/add", function(req, res, next) {
  var parentObject = req.body.parentObject;
  var accessor = req.body.accessor;
  var property = req.body.property;
  var propertyValue = req.body.propertyValue;
  var functionName = req.body.functionName;
  var args = req.body.args;
  var returnValue = req.body.returnValue;

  db.collection('callLogging').insertOne({
      parentObject: parentObject,
      accessor: accessor,
      property: property,
      propertyValue: propertyValue,
      functionName: functionName,
      args: args,
      returnValue: returnValue
  });

});

router.get('/get', (req, res) => {
  let logs = {};
  mongoDb.collection('callLogging').find({})
   .each((err, product) => {
     assert.equal(null, err);

     if (!product) { // no more products
       res.send({ logs });
       return;
     }
   });
});



module.exports = router;
