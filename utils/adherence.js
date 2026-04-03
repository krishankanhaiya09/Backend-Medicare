export const calculateAdherence = (logs) => {
  const total = logs.length;
  const taken = logs.filter((log) => log.status === "taken").length;
  const missed = logs.filter((log) => log.status === "missed").length;
  const delayed = logs.filter((log) => log.status === "delayed").length;

  const adherenceRate = total === 0 ? 0 : ((taken / total) * 100).toFixed(2);

  return {
    total,
    taken,
    missed,
    delayed,
    adherenceRate
  };
};