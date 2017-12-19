var moment = require('moment');

module.exports = {
  weekNumbSetter: function (MatchTime) {
    if (moment(MatchTime).isBetween('2017-06-23', '2017-09-01')) {
      return "PRE"
    } else if (moment(MatchTime).isBetween('2017-09-02', '2017-09-13')) {
      return "01"
    } else if (moment(MatchTime).isBetween('2017-09-13', '2017-09-20')) {
      return "02"
    } else if (moment(MatchTime).isBetween('2017-09-20', '2017-09-27')) {
      return "03"
    } else if (moment(MatchTime).isBetween('2017-09-27', '2017-10-04')) {
      return "04"
    } else if (moment(MatchTime).isBetween('2017-10-04', '2017-10-11')) {
      return "05"
    } else if (moment(MatchTime).isBetween('2017-10-11', '2017-10-18')) {
      return "06"
    } else if (moment(MatchTime).isBetween('2017-10-18', '2017-10-25')) {
      return "07"
    } else if (moment(MatchTime).isBetween('2017-10-25', '2017-11-01')) {
      return "08"
    } else if (moment(MatchTime).isBetween('2017-11-01', '2017-11-08')) {
      return "09"
    } else if (moment(MatchTime).isBetween('2017-11-08', '2017-11-15')) {
      return "10"
    } else if (moment(MatchTime).isBetween('2017-11-15', '2017-11-22')) {
      return "11"
    } else if (moment(MatchTime).isBetween('2017-11-22', '2017-11-29')) {
      return "12"
    } else if (moment(MatchTime).isBetween('2017-11-29', '2017-12-06')) {
      return "13"
    } else if (moment(MatchTime).isBetween('2017-12-06', '2017-12-13')) {
      return "14"
    } else if (moment(MatchTime).isBetween('2017-12-13', '2017-12-20')) {
      return "15"
    } else if (moment(MatchTime).isBetween('2017-12-20', '2017-12-27')) {
      return "16"
    } else if (moment(MatchTime).isBetween('2017-12-27', '2017-01-03')) {
      return "17"
    } else {
      return "POST"
    }
  }
}
