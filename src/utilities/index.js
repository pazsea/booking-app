export const isEmpty = obj => {
  if (obj === null) {
    return true;
  }
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};

export const calculateDistance = (position1, position2) => {
  const { latitude: lat1, longitude: lon1 } = position1;
  const { latitude: lat2, longitude: lon2 } = position2;

  var R = 6371; // km (change this constant to get miles)
  var dLat = ((lat2 - lat1) * Math.PI) / 180;
  var dLon = ((lon2 - lon1) * Math.PI) / 180;
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  return Math.round(d * 1000);
};

export const roundMilliseconds = time => {
  var unit;
  time = time / 1000;

  if (time < 60) {
    unit = "sec";
  } else {
    time = time / 60;
    if (time < 60) {
      unit = "min";
    } else {
      time = time / 60;
      if (time < 60) {
        unit = "h";
      } else {
        time = time / 24;
        unit = "d";
      }
    }
  }

  return Math.round(time) + " " + unit;
};

export const calculateETA = (origin, current, destination) => {
  var distanceTraveled = calculateDistance(origin, current);
  var distanceRemaining = calculateDistance(current, destination);

  var passedTime = current.timestamp - origin.timestamp;
  var speed = distanceTraveled / passedTime;
  var timeLeft = distanceRemaining / speed;

  return roundMilliseconds(timeLeft); //milliseconds left to arrival
};
