var mongoose = require ('mongoose');

var PickArraySchema = new mongoose.Schema({
  EventID: {
    type: String,
    required: true,
    unique: true
  },
  OverPickArray: Array,
  UnderPickArray: Array,
  AwaySpreadPickArray: Array,
  HomeSpreadPickArray: Array,
  AwayMLPickArray: Array,
  HomeMLPickArray: Array,
  NoPickArray: Array
});

mongoose.model('PickArray', PickArraySchema);
