var fetch = require('node-fetch');
var mongoose = require('mongoose');
var Result = mongoose.model('Result');

// This function updates game results.

module.exports = {

  updateResults: function(){
    fetch('https://jsonodds.com/api/results/nfl?oddType=Game', {
      method: 'GET',
      headers: {
        'JsonOdds-API-Key': process.env.API_KEY
      }
    }).then(function(res){
      return res.json()
    }).then(function(results){

      var bulk = Result.collection.initializeOrderedBulkOp();
      var counter = 0;

      for (i = 0; i < results.length; i++) {
        bulk.find({EventID: results[i].EventID}).upsert().updateOne({
          $set: {
            EventID: results[i].EventID,
            HomeScore: results[i].HomeScore,
            AwayScore: results[i].AwayScore,
            OddType: results[i].OddType,
            Final: results[i].Final,
            FinalType: results[i].FinalType
          }
        });
        counter++;

        if (counter % 1000 == 0) {
          bulk.execute(function(err, res){
            bulk = Result.collection.initializeOrderedBulkOp();
          });
        }
      };

      if (counter % 1000 != 0)
          bulk.execute(function(err, res) {
             console.log('results bulk update completed at ' + new Date());
          });
    })
  }

}
