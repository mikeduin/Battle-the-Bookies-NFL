var moment = require('moment');

// Change these to "Week 01" etc

module.exports = {
  weekSetter: function (MatchTime) {
    if (moment(MatchTime).isBetween('2016-06-23', '2016-09-07')) {
      return "Preseason"
    } else if (moment(MatchTime).isBetween('2016-09-07', '2016-09-14')) {
      return "Week 1"
    } else if (moment(MatchTime).isBetween('2016-09-14', '2016-09-21')) {
      return "Week 2"
    } else if (moment(MatchTime).isBetween('2016-09-21', '2016-09-28')) {
      return "Week 3"
    } else if (moment(MatchTime).isBetween('2016-09-28', '2016-10-05')) {
      return "Week 4"
    } else if (moment(MatchTime).isBetween('2016-10-05', '2016-10-12')) {
      return "Week 5"
    } else if (moment(MatchTime).isBetween('2016-10-12', '2016-10-19')) {
      return "Week 6"
    } else if (moment(MatchTime).isBetween('2016-10-19', '2016-10-26')) {
      return "Week 7"
    } else if (moment(MatchTime).isBetween('2016-10-26', '2016-11-02')) {
      return "Week 8"
    } else if (moment(MatchTime).isBetween('2016-11-02', '2016-11-09')) {
      return "Week 9"
    } else if (moment(MatchTime).isBetween('2016-11-09', '2016-11-16')) {
      return "Week 10"
    } else if (moment(MatchTime).isBetween('2016-11-16', '2016-11-23')) {
      return "Week 11"
    } else if (moment(MatchTime).isBetween('2016-11-23', '2016-11-30')) {
      return "Week 12"
    } else if (moment(MatchTime).isBetween('2016-11-30', '2016-12-07')) {
      return "Week 13"
    } else if (moment(MatchTime).isBetween('2016-12-07', '2016-12-14')) {
      return "Week 14"
    } else if (moment(MatchTime).isBetween('2016-12-14', '2016-12-21')) {
      return "Week 15"
    } else if (moment(MatchTime).isBetween('2016-12-21', '2016-12-28')) {
      return "Week 16"
    } else if (moment(MatchTime).isBetween('2016-12-28', '2017-01-04')) {
      return "Week 17"
    } else {
      return "Postseason"
    }
  }
}
