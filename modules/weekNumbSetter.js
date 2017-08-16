var moment = require('moment');

module.exports = {
  weekNumbSetter: function (MatchTime) {
    if (moment(MatchTime).isBetween('2017-06-23', '2017-07-07')) {
      return "PRE"
    } else if (moment(MatchTime).isBetween('2017-07-11', '2017-07-19')) {
      return "03"
    } else if (moment(MatchTime).isBetween('2017-07-19', '2017-07-26')) {
      return "04"
    } else if (moment(MatchTime).isBetween('2017-07-26', '2017-08-02')) {
      return "05"
    } else if (moment(MatchTime).isBetween('2017-08-02', '2017-08-09')) {
      return "06"
    } else if (moment(MatchTime).isBetween('2017-08-09', '2017-08-16')) {
      return "07"
    } else if (moment(MatchTime).isBetween('2017-08-16', '2017-08-23')) {
      return "08"
    } else if (moment(MatchTime).isBetween('2017-08-23', '2017-08-30')) {
      return "09"
    } else if (moment(MatchTime).isBetween('2017-10-26', '2017-11-02')) {
      return "10"
    } else if (moment(MatchTime).isBetween('2017-11-02', '2017-11-09')) {
      return "11"
    } else if (moment(MatchTime).isBetween('2017-11-09', '2017-11-16')) {
      return "12"
    } else if (moment(MatchTime).isBetween('2017-11-16', '2017-11-23')) {
      return "13"
    } else if (moment(MatchTime).isBetween('2017-11-23', '2017-11-30')) {
      return "14"
    } else if (moment(MatchTime).isBetween('2017-11-30', '2017-12-07')) {
      return "13"
    } else if (moment(MatchTime).isBetween('2017-12-07', '2017-12-14')) {
      return "15"
    } else if (moment(MatchTime).isBetween('2017-12-14', '2017-12-21')) {
      return "16"
    } else if (moment(MatchTime).isBetween('2017-12-21', '2017-12-28')) {
      return "17"
    } else if (moment(MatchTime).isBetween('2017-12-28', '2017-01-04')) {
      return "18"
    } else {
      return "POST"
    }
  }
}
