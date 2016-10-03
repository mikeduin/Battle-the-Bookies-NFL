var mongoose = require ('mongoose');

// Keys in LineSchema are capitalized to be consistent with key names pulled from third-party API

var LineSchema = new mongoose.Schema({
  EventID: {
    type: String,
    required: true,
    unique: true
  },
  HomeTeam: {
    type: String,
    required: true
  },
  AwayTeam: {
    type: String,
    required: true
  },
  MatchTime: {
    type: Date,
    required: true
  },
  OddType: String,
  MatchDay: String,
  DateNumb: Number,
  WeekNumb: String,
  Week: String,
  HomeAbbrev: String,
  AwayAbbrev: String,
  HomeHelmet: String,
  AwayHelmet: String,
  HomeColor: String,
  AwayColor: String,
  MoneyLineHome: Number,
  MoneyLineAway: Number,
  PointSpreadHome: Number,
  PointSpreadAway: Number,
  PointSpreadAwayLine: Number,
  PointSpreadHomeLine: Number,
  TotalNumber: Number,
  OverLine: Number,
  UnderLine: Number,
  GameStatus: String,
  HomeScore: Number,
  AwayScore: Number,
  MLHomePicks: Number,
  MLAwayPicks: Number,
  SpreadHomePicks: Number,
  SpreadAwayPicks: Number,
  OverPicks: Number,
  UnderPicks: Number,
  OverPickArray: Array,
  UnderPickArray: Array,
  FavSpreadPickArray: Array,
  DogSpreadPickArray: Array,
  FavMLPickArray: Array,
  DogMLPickArray: Array,
  NoPickArray: Array
})

mongoose.model('Line', LineSchema);
