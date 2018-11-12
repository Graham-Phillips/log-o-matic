/**
  manage api requests
**/

const express = require("express");

var MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const router = express.Router();

let mongoDb;


MongoClient.connect('mongodb://localhost:27017', function (err, client) {
  if (err) throw err;

  mongoDb = client.db('logomatic');

  // mongoDb.collection('callLogging').find({}, function (findErr, result) {
  //   if (findErr) console.log("findErr>"+ findErr);
  //   for(let a in result)
  //   console.log("result["+a+"] = " + result[ a ]);
  // });

  var cursor = mongoDb.collection('callLogging').find({});
  function iterateFunc(doc) {
    console.log(JSON.stringify(doc, null, 4));
  }
  
  function errorFunc(error) {
      console.log(error);
  }
  
  cursor.forEach(iterateFunc, errorFunc);

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
  mongoDb.collection('callLogging').find({})
   .forEach( (doc) => console.log(JSON.stringify(doc, null, 4)),
    (error) => console.log("E..."+ error)
   );
   res.send(doc);
});




module.exports = router;
