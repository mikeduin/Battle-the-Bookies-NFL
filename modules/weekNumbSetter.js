var moment = require('moment');

module.exports = {
  weekNumbSetter: function (MatchTime) {
    if (moment(MatchTime).isBetween('2016-06-23', '2016-07-01')) {
      return "01"
    } else if (moment(MatchTime).isBetween('2016-06-30', '2016-07-08')) {
      return "02"
    } else if (moment(MatchTime).isBetween('2016-07-07', '2016-07-15')) {
      return "03"
    } else if (moment(MatchTime).isBetween('2016-07-14', '2016-07-22')) {
      return "04"
    } else {
      return "05"
    }
  }
}
