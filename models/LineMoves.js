var mongoose = require ('mongoose');

var LineMoveSchema = new mongoose.Schema({
  EventID: {
    type: String,
    required: true,
    unique: true
  },
  AwayAbbrev: String,
  HomeAbbrev: String,
  HomeSpreads: Array,
  HomeSpreadJuices: Array,
  AwaySpreads: Array,
  AwaySpreadJuices: Array,
  HomeMLs: Array,
  AwayMLs: Array,
  Totals: Array,
  TotalOverJuices: Array,
  TotalUnderJuices: Array,
  TimeLogged: Array
});

mongoose.model('LineMove', LineMoveSchema)
