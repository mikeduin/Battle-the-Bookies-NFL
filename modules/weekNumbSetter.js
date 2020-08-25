var moment = require('moment');

module.exports = {
  weekNumbSetter: function (matchTime) {
    if (moment(matchTime).isBefore('2019-08-30')) {
      return "PRE"
    } else if (moment(matchTime).isBetween('2020-09-03', '2020-09-16')) {
      return "01"
    } else if (moment(matchTime).isBetween('2020-09-16', '2020-09-23')) {
      return "02"
    } else if (moment(matchTime).isBetween('2020-09-23', '2020-09-30')) {
      return "03"
    } else if (moment(matchTime).isBetween('2020-09-30', '2020-10-07')) {
      return "04"
    } else if (moment(matchTime).isBetween('2020-10-07', '2020-10-14')) {
      return "05"
    } else if (moment(matchTime).isBetween('2020-10-14', '2020-10-21')) {
      return "06"
    } else if (moment(matchTime).isBetween('2020-10-21', '2020-10-28')) {
      return "07"
    } else if (moment(matchTime).isBetween('2020-10-28', '2020-11-04')) {
      return "08"
    } else if (moment(matchTime).isBetween('2020-11-04', '2020-11-11')) {
      return "09"
    } else if (moment(matchTime).isBetween('2020-11-11', '2020-11-18')) {
      return "10"
    } else if (moment(matchTime).isBetween('2020-11-18', '2020-11-25')) {
      return "11"
    } else if (moment(matchTime).isBetween('2020-11-25', '2020-12-02')) {
      return "12"
    } else if (moment(matchTime).isBetween('2020-12-02', '2020-12-09')) {
      return "13"
    } else if (moment(matchTime).isBetween('2020-12-09', '2020-12-16')) {
      return "14"
    } else if (moment(matchTime).isBetween('2020-12-16', '2020-12-23')) {
      return "15"
    } else if (moment(matchTime).isBetween('2020-12-23', '2020-12-30')) {
      return "16"
    } else if (moment(matchTime).isBetween('2020-12-30', '2021-01-06')) {
      return "17"
    } else {
      return "POST"
    };
  }
}
