const calculateTotalScore = (data) => {
  const percent = arithmeticMean(data);
  const color = getMainColor(percent);
  return {
    percent,
    color,
    label: "Lighthouse Score",
    series: [
      { x: "progress", y: percent, color },
      { x: "remainder", y: 100 - percent, color: "transparent" },
    ],
  };
};