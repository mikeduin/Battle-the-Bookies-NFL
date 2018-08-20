var moment = require('moment');

// Change these to "Week 01" etc

module.exports = {
  weekSetter: function (MatchTime) {
    if (moment(MatchTime).isBetween('2018-06-23', '2018-09-01')) {
      return "Preseason"
    } else if (moment(MatchTime).isBetween('2018-09-02', '2018-09-12')) {
      return "Week 1"
    } else if (moment(MatchTime).isBetween('2018-09-12', '2018-09-19')) {
      return "Week 2"
    } else if (moment(MatchTime).isBetween('2018-09-19', '2018-09-26')) {
      return "Week 3"
    } else if (moment(MatchTime).isBetween('2018-09-26', '2018-10-03')) {
      return "Week 4"
    } else if (moment(MatchTime).isBetween('2018-10-03', '2018-10-10')) {
      return "Week 5"
    } else if (moment(MatchTime).isBetween('2018-10-10', '2018-10-17')) {
      return "Week 6"
    } else if (moment(MatchTime).isBetween('2018-10-17', '2018-10-24')) {
      return "Week 7"
    } else if (moment(MatchTime).isBetween('2018-10-24', '2018-10-31')) {
      return "Week 8"
    } else if (moment(MatchTime).isBetween('2018-10-31', '2018-11-07')) {
      return "Week 9"
    } else if (moment(MatchTime).isBetween('2018-11-07', '2018-11-14')) {
      return "Week 10"
    } else if (moment(MatchTime).isBetween('2018-11-14', '2018-11-21')) {
      return "Week 11"
    } else if (moment(MatchTime).isBetween('2018-11-21', '2018-11-28')) {
      return "Week 12"
    } else if (moment(MatchTime).isBetween('2018-11-28', '2018-12-05')) {
      return "Week 13"
    } else if (moment(MatchTime).isBetween('2018-12-05', '2018-12-12')) {
      return "Week 14"
    } else if (moment(MatchTime).isBetween('2018-12-12', '2018-12-19')) {
      return "Week 15"
    } else if (moment(MatchTime).isBetween('2018-12-19', '2018-12-26')) {
      return "Week 16"
    } else if (moment(MatchTime).isBetween('2018-12-26', '2019-01-02')) {
      return "Week 17"
    } else {
      return "Postseason"
    }
  }
}
