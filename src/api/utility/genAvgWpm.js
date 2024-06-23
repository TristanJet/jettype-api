const genAvgWPM = async (userId, allWPMlen, pop, get) => {
  const diff = allWPMlen - 100;
  if (diff > 0) {
    await pop(userId, diff);
  }
  if (allWPMlen % 10 === 0) {
    // Calculate on load from client
    const all = await get(userId);

    const arrayAsFloats = all.map((item) => parseFloat(item));

    const average = (
      arrayAsFloats.reduce((acc, val) => acc + val, 0) / arrayAsFloats.length
    ).toFixed(1);

    return average;
  }
  return 0;
};

module.exports = genAvgWPM;
