var moment = require('moment');

module.exports = {
  weekNumbSetter: function (matchTime) {
    if (moment(matchTime).isBefore('2019-08-30')) {
      return "PRE"
    } else if (moment(matchTime).isBetween('2019-09-01', '2019-09-10')) {
      return "01"
    } else if (moment(matchTime).isBetween('2019-09-10', '2019-09-17')) {
      return "02"
    } else if (moment(matchTime).isBetween('2019-09-17', '2019-09-24')) {
      return "03"
    } else if (moment(matchTime).isBetween('2019-09-24', '2019-10-01')) {
      return "04"
    } else if (moment(matchTime).isBetween('2019-10-01', '2019-10-08')) {
      return "05"
    } else if (moment(matchTime).isBetween('2019-10-08', '2019-10-15')) {
      return "06"
    } else if (moment(matchTime).isBetween('2019-10-15', '2019-10-22')) {
      return "07"
    } else if (moment(matchTime).isBetween('2019-10-22', '2019-10-29')) {
      return "08"
    } else if (moment(matchTime).isBetween('2019-10-29', '2019-11-05')) {
      return "09"
    } else if (moment(matchTime).isBetween('2019-11-05', '2019-11-12')) {
      return "10"
    } else if (moment(matchTime).isBetween('2019-11-12', '2019-11-19')) {
      return "11"
    } else if (moment(matchTime).isBetween('2019-11-19', '2019-11-26')) {
      return "12"
    } else if (moment(matchTime).isBetween('2019-11-26', '2019-12-03')) {
      return "13"
    } else if (moment(matchTime).isBetween('2019-12-03', '2019-12-10')) {
      return "14"
    } else if (moment(matchTime).isBetween('2019-12-10', '2019-12-17')) {
      return "15"
    } else if (moment(matchTime).isBetween('2019-12-17', '2019-12-24')) {
      return "16"
    } else if (moment(matchTime).isBetween('2019-12-24', '2020-01-02')) {
      return "17"
    } else {
      return "POST"
    };
  }
  // {
  //   if (moment(MatchTime).isBetween('2018-06-23', '2018-09-01')) {
  //     return "PRE"
  //   } else if (moment(MatchTime).isBetween('2018-09-02', '2018-09-12')) {
  //     return "01"
  //   } else if (moment(MatchTime).isBetween('2018-09-12', '2018-09-19')) {
  //     return "02"
  //   } else if (moment(MatchTime).isBetween('2018-09-19', '2018-09-26')) {
  //     return "03"
  //   } else if (moment(MatchTime).isBetween('2018-09-26', '2018-10-03')) {
  //     return "04"
  //   } else if (moment(MatchTime).isBetween('2018-10-03', '2018-10-10')) {
  //     return "05"
  //   } else if (moment(MatchTime).isBetween('2018-10-10', '2018-10-17')) {
  //     return "06"
  //   } else if (moment(MatchTime).isBetween('2018-10-17', '2018-10-24')) {
  //     return "07"
  //   } else if (moment(MatchTime).isBetween('2018-10-24', '2018-10-31')) {
  //     return "08"
  //   } else if (moment(MatchTime).isBetween('2018-10-31', '2018-11-07')) {
  //     return "09"
  //   } else if (moment(MatchTime).isBetween('2018-11-07', '2018-11-14')) {
  //     return "10"
  //   } else if (moment(MatchTime).isBetween('2018-11-14', '2018-11-21')) {
  //     return "11"
  //   } else if (moment(MatchTime).isBetween('2018-11-21', '2018-11-28')) {
  //     return "12"
  //   } else if (moment(MatchTime).isBetween('2018-11-28', '2018-12-05')) {
  //     return "13"
  //   } else if (moment(MatchTime).isBetween('2018-12-05', '2018-12-12')) {
  //     return "14"
  //   } else if (moment(MatchTime).isBetween('2018-12-12', '2018-12-19')) {
  //     return "15"
  //   } else if (moment(MatchTime).isBetween('2018-12-19', '2018-12-26')) {
  //     return "16"
  //   } else if (moment(MatchTime).isBetween('2018-12-26', '2019-01-02')) {
  //     return "17"
  //   } else {
  //     return "POST"
  //   }
  // }
}
