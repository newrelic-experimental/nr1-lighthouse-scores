const getMainColor = (value) => {
  if (value >= mainThresholds.good) {
    return "green";
  } else if (value >= mainThresholds.moderate) {
    return "orange";
  } else {
    return "red";
  }
};