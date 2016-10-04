var mongoose = require ('mongoose');

var PickArraySchema = new mongoose.Schema({
  EventID: {
    type: String,
    required: true,
    unique: true
  },
  OverPickArray: Array,
  UnderPickArray: Array,
  FavSpreadPickArray: Array,
  DogSpreadPickArray: Array,
  FavMLPickArray: Array,
  DogMLPickArray: Array,
  NoPickArray: Array
});

mongoose.model('PickArray', PickArraySchema);
