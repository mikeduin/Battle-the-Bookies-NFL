const moment = require('moment');


// 2017 NFL Season: began 9/7/17, ended 12/31/17
// 2018 NFL Season: began 9/6/18, ended 12/30/18
// 2019 NFL Season: began 9/5/19, ended 12/29/19
// 2020 NFL Season: begins 9/10/20, ends 1/3/21

// module.exports = {
//   getSeason: function (year = null) {
//     !year ? moment().year() : null;
//     if (moment().isBefore(`${year}.06.01`)) {
//       return year-1;
//     } else {
//       return year;
//     }
//   }
// }


module.exports = {
  2017: {
    start: '2017.09.07',
    end: '2018.01.01'
  },
  2018: {
    start: '2018.09.06',
    end: '2018.12.31'
  },
  2019: {
    start: '2019.09.05',
    end: '2019.12.30'
  },
  2020: {
    start: '2020.09.10',
    end: '2021.01.04'
  }
}
