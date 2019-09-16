var moment = require('moment');

module.exports = {
  weekNumbSetter: function (matchTime) {
    if (moment(matchTime).isBefore('2019-08-30')) {
      return "PRE"
    } else if (moment(matchTime).isBetween('2019-09-01', '2019-09-11')) {
      return "01"
    } else if (moment(matchTime).isBetween('2019-09-11', '2019-09-18')) {
      return "02"
    } else if (moment(matchTime).isBetween('2019-09-18', '2019-09-25')) {
      return "03"
    } else if (moment(matchTime).isBetween('2019-09-25', '2019-10-02')) {
      return "04"
    } else if (moment(matchTime).isBetween('2019-10-02', '2019-10-09')) {
      return "05"
    } else if (moment(matchTime).isBetween('2019-10-09', '2019-10-16')) {
      return "06"
    } else if (moment(matchTime).isBetween('2019-10-16', '2019-10-23')) {
      return "07"
    } else if (moment(matchTime).isBetween('2019-10-23', '2019-10-30')) {
      return "08"
    } else if (moment(matchTime).isBetween('2019-10-30', '2019-11-06')) {
      return "09"
    } else if (moment(matchTime).isBetween('2019-11-06', '2019-11-13')) {
      return "10"
    } else if (moment(matchTime).isBetween('2019-11-13', '2019-11-20')) {
      return "11"
    } else if (moment(matchTime).isBetween('2019-11-20', '2019-11-27')) {
      return "12"
    } else if (moment(matchTime).isBetween('2019-11-27', '2019-12-04')) {
      return "13"
    } else if (moment(matchTime).isBetween('2019-12-04', '2019-12-11')) {
      return "14"
    } else if (moment(matchTime).isBetween('2019-12-11', '2019-12-18')) {
      return "15"
    } else if (moment(matchTime).isBetween('2019-12-18', '2019-12-25')) {
      return "16"
    } else if (moment(matchTime).isBetween('2019-12-25', '2020-01-03')) {
      return "17"
    } else {
      return "POST"
    };
  }
}
