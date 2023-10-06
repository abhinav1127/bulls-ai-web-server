export const usedGeneratedVersion = (traffic_percentage, randomizer) => {
  console.log("traffic_percentage", traffic_percentage);
  console.log("randomizer", randomizer);
  return randomizer > traffic_percentage;
};
