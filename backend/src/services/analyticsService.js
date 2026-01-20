exports.computeAnalytics = (habit, logs) => {
  const totalLogs = logs.length;
  const habitType = habit.type;

  // 1. Calculate Sum and Average
  const totalValue = logs.reduce((sum, log) => sum + (log.value || 0), 0);
  const averageValue = totalLogs > 0 ? (totalValue / totalLogs).toFixed(1) : 0;

  // 2. Calculate Streak (Existing logic)
  const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  if (sortedLogs.length > 0) {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    const mostRecentDate = sortedLogs[0].date;

    if (mostRecentDate === today || mostRecentDate === yesterdayStr) {
      streak = 1;
      for (let i = 0; i < sortedLogs.length - 1; i++) {
        const current = new Date(sortedLogs[i].date);
        const next = new Date(sortedLogs[i + 1].date);
        if (Math.ceil(Math.abs(current - next) / (1000 * 60 * 60 * 24)) === 1) {
          streak++;
        } else {
          break;
        }
      }
    }
  }

  // 3. Heatmap with Normalized Intensity
  const maxVal = Math.max(...logs.map((l) => l.value), 1);
  const heatmap = logs.map((log) => ({
    date: log.date,
    value:
      habitType === "boolean"
        ? log.completed
          ? "Done"
          : "Not Done"
        : log.value,
    intensity:
      habitType === "boolean" ? (log.completed ? 1 : 0) : log.value / maxVal,
  }));

  // 4. Trend Logic (Cumulative)
  let runningTotal = 0;
  const trend = [...logs]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((log) => {
      runningTotal +=
        habitType === "boolean" ? (log.completed ? 1 : 0) : log.value;
      return { date: log.date, cumulative: runningTotal };
    });

  return { habit, streak, totalLogs, totalValue, averageValue, heatmap, trend };
};
