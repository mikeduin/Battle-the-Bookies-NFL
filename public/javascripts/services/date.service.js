angular
  .module('battleBookies')
  .factory('dateService', [dateService])

function dateService () {
    let date = {};

    date.fetchSeasons = () => {
      if (moment().isBefore('2019-07-15')) {
        return [2017, 2018]
      } else if (moment().isBefore('2020-07-15')) {
        return [2017, 2018, 2019]
      } else if (moment().isBefore('2021-07-15')) {
        return [2017, 2018, 2019, 2020]
      } else if (moment().isBefore('2022-07-15')) {
        return [2017, 2018, 2019, 2020, 2021]
      } else if (moment().isBefore('2023-07-15')) {
        return [2017, 2018, 2019, 2020, 2021, 2022]
      } else if (moment().isBefore('2024-07-15')) {
        return [2017, 2018, 2019, 2020, 2021, 2022, 2023]
      } else if (moment().isBefore('2025-07-15')) {
        return [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024]
      } else {
        return [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]
      }
    };

    date.fetchSystemYear = () => {
      if (moment().isBefore('2019-07-15')) {
        return 2018
      } else if (moment().isBefore('2020-07-15')) {
        return 2019
      } else if (moment().isBefore('2021-07-15')) {
        return 2020
      } else if (moment().isBefore('2022-07-15')) {
        return 2021
      } else if (moment().isBefore('2023-07-15')) {
        return 2022
      } else if (moment().isBefore('2024-07-15')) {
        return 2023
      } else if (moment().isBefore('2025-07-15')) {
        return 2024
      } else {
        return 2025
      }
    };

    date.weekSetter = matchTime => {
      if (moment(matchTime).isBefore('2019-08-30')) {
        return "Preseason"
      } else if (moment(matchTime).isBetween('2019-09-01', '2019-09-10')) {
        return "Week 1"
      } else if (moment(matchTime).isBetween('2019-09-10', '2019-09-17')) {
        return "Week 2"
      } else if (moment(matchTime).isBetween('2019-09-17', '2019-09-24')) {
        return "Week 3"
      } else if (moment(matchTime).isBetween('2019-09-24', '2019-10-01')) {
        return "Week 4"
      } else if (moment(matchTime).isBetween('2019-10-01', '2019-10-08')) {
        return "Week 5"
      } else if (moment(matchTime).isBetween('2019-10-08', '2019-10-15')) {
        return "Week 6"
      } else if (moment(matchTime).isBetween('2019-10-15', '2019-10-22')) {
        return "Week 7"
      } else if (moment(matchTime).isBetween('2019-10-22', '2019-10-29')) {
        return "Week 8"
      } else if (moment(matchTime).isBetween('2019-10-29', '2019-11-05')) {
        return "Week 9"
      } else if (moment(matchTime).isBetween('2019-11-05', '2019-11-12')) {
        return "Week 10"
      } else if (moment(matchTime).isBetween('2019-11-12', '2019-11-19')) {
        return "Week 11"
      } else if (moment(matchTime).isBetween('2019-11-19', '2019-11-26')) {
        return "Week 12"
      } else if (moment(matchTime).isBetween('2019-11-26', '2019-12-03')) {
        return "Week 13"
      } else if (moment(matchTime).isBetween('2019-12-03', '2019-12-10')) {
        return "Week 14"
      } else if (moment(matchTime).isBetween('2019-12-10', '2019-12-17')) {
        return "Week 15"
      } else if (moment(matchTime).isBetween('2019-12-17', '2019-12-24')) {
        return "Week 16"
      } else if (moment(matchTime).isBetween('2019-12-24', '2020-01-02')) {
        return "Week 17"
      } else {
        return "Postseason"
      };
    }

    return date;
}
