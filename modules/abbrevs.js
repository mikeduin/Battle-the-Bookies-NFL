module.exports = {

  teamAbbrev: function(team) {
    var abbreviations = {
      "Arizona Cardinals": "ARI",
      "Atlanta Falcons": "ATL",
      "Baltimore Ravens": "BAL",
      "Buffalo Bills": "BUF",
      "Carolina Panthers": "CAR",
      "Chicago Bears": "CHI",
      "Cincinnati Bengals": "CIN",
      "Cleveland Browns": "CLE",
      "Dallas Cowboys": "DAL",
      "Denver Broncos": "DEN",
      "Detroit Lions": "DET",
      "Green Bay Packers": "GB",
      "Houston Texans": "HOU",
      "Indianapolis Colts": "IND",
      "Jacksonville Jaguars": "JAX",
      "Kansas City Chiefs": "KC",
      "Los Angeles Rams": "LA",
      "Miami Dolphins": "MIA",
      "Minnesota Vikings": "MIN",
      "New England Patriots": "NE",
      "New Orleans Saints": "NO",
      "New York Giants": "NYG",
      "New York Jets": "NYJ",
      "Oakland Raiders": "OAK",
      "Philadelphia Eagles": "PHI",
      "Pittsburgh Steelers": "PIT",
      "San Diego Chargers": "SD",
      "San Francisco 49ers": "SF",
      "Seattle Seahawks": "SEA",
      "Tampa Bay Buccaneers": "TB",
      "Tennessee Titans": "TEN",
      "Washington Redskins": "WAS",
      "Baltimore Orioles": "BAL",
      "Boston Red Sox": "BOS",
      "Chicago White Sox": "CHW",
      "Cleveland Indians": "CLE",
      "Detroit Tigers": "DET",
      "Houston Astros": "HOU",
      "Kansas City Royals": "KC",
      "Los Angeles Angels": "LAA",
      "Minnesota Twins": "MIN",
      "New York Yankees": "NYY",
      "Oakland Athletics": "OAK",
      "Seattle Mariners": "SEA",
      "Tampa Bay Rays": "TB",
      "Toronto Blue Jays": "TOR",
      "Arizona Diamondbacks": "ARI",
      "Atlanta Braves": "ATL",
      "Chicago Cubs": "CHC",
      "Cincinnati Reds": "CIN",
      "Colorado Rockies": "COL",
      "Los Angeles Dodgers": "LAD",
      "Miami Marlins": "MIA",
      "Milwaukee Brewers": "MIL",
      "New York Mets": "NYM",
      "Philadelphia Phillies": "PHI",
      "Pittsburgh Pirates": "PIT",
      "San Francisco Giants": "SF",
      "St. Louis Cardinals": "STL",
      "Washington Nationals": "WAS"
    };

    return abbreviations[team]
  }
}
