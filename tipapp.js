'use strict';

let express = require('express');
let moment = require('moment');
let bodyParser = require('body-parser');
let MongoClient = require('mongodb').MongoClient;
let ObjectID = require('mongodb').ObjectID;
let assert = require('assert');

let app = express();
app.use(bodyParser.json());

var db;

app.use(express.static('static'));

let url = 'mongodb://localhost:27017/tipapp';

var categoryCollection;
var categoryList = [];

MongoClient.connect(url, function(err, db) {
  if(err){
    console.log(`error connecting: ${err}`)
  }else{
    console.log(`connected to ${url}`)

    categoryCollection = db.collection('category');

    // Insert some users
    categoryCollection.find().toArray(function (err, result) {
      if (err) {
        console.log(err);
      } else if (result.length) {
        categoryList = result;
      } else {
        console.log('No document(s) found with defined "find" criteria!');
      }
      //Close connection
      db.close();
    });

    let server = app.listen(3000, function () {
      let port = server.address().port;
      console.log(`app listening on ${port}!`);
    });

  }

});

app.route('/api/category')
  .get(function(q,s){
    if(categoryList){
      s.status(200).json(categoryList);
    }else{
      s.status(400).json('no categories found');
    }
  });

app.route('/api/tips')
  .get(function(q,s){
    MongoClient.connect(url, function(err, db) {
      if(err){
        console.log(`error connecting: ${err}`)
      }else{
        console.log(`connected to ${url}`)
      }
      db.collection('tips').find().toArray(function(err, docs){
        let tipList = {};
        tipList['tips'] = docs;
        s.status(200).json(tipList);
      })
    });
  })
  .post(function(q,s){
    if(q.body && q.body.tipText && (q.body.category !== 'placeholder')){
      var tipCat;

      MongoClient.connect(url, function(err, db) {
        if(err){
          console.log(`error connecting: ${err}`)
        }else{
          console.log(`connected to ${url}`)
        }

          categoryCollection = db.collection('category');
          let objId = new ObjectID(q.body.category);

          categoryCollection.findOne({"_id": objId}, function(err, docs){
            tipCat = docs.name;
            console.log('gotTip');
            insertDocument(db, dosomethingelse);

          });

          let insertDocument = function(db, callback){
            console.log('inserting');
            console.log(tipCat);
            db.collection('tips').insertOne({
              tipText:q.body.tipText,
              author:'Tester',
              category:tipCat,
              score:0,
              date:new Date()
            }, function(err, result){
              assert.equal(err, null);
              console.log(`Inserted ${result}`);
              callback(result);
            });
          };
          function dosomethingelse(result){
            db.collection('tips').find().toArray(function(err, docs){
              s.status(200).json(docs);
            });
          }
      });

    }else{
      s.status(400).send('something went wrong with request body')
    }

  });
app.route('/api/tips/:id')
  .get(function(q,s){
    let lookup = q.params.id;
    lookup = parseFloat(lookup) - 1;
    s.status(200).json(tipList.tips[lookup]);
  })
  .patch(function(q,s){
    const val = q.body.value

    if(q.body && q.params.id && (q.body.value <=1 || q.body.value >= -1)){
      var tipCat;

      MongoClient.connect(url, function(err, db) {
        if(err){
          console.log(`error connecting: ${err}`)
        }else{
          console.log(`connected to ${url}`)
        }
          let coll = db.collection('tips');
          let objId = new ObjectID(q.params.id);
          coll.update(
            {_id:objId},
            {$inc:{score:val}}
          );

          coll.findOne({"_id": objId}, function(err, doc){
            if(err){
              console.error('error:', err);
              s.status(400).send(err);
            }else{
              if(doc._id.toString()===objId.toString()){
                s.status(200).json(doc);
              }else{
                s.status(400).send('Sorry, something went wrong');
              }
            }
          });

      });

    }else{
      s.status(400).send('something went wrong with request body')
    }

  });
