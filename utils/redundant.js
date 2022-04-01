const calculateTotalScore = (data) => {
  const percent = arithmeticMean(data);
  console.log(percent);
  const color = getMainColor(percent);
  console.log({
    percent,
    label: "Lighthouse Score",
    series: [
      { x: "progress", y: percent, color },
      { x: "remainder", y: 100 - percent, color: "transparent" },
    ],
  });
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