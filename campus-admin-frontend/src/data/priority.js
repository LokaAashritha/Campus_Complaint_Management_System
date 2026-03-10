const PRIORITY_THRESHOLD = 5;

export const applyPriority = (complaints) => {
  const categoryCount = {};

  complaints.forEach((c) => {
    categoryCount[c.category] =
      (categoryCount[c.category] || 0) + 1;
  });

  return complaints.map((c) => ({
    ...c,
    priority:
      categoryCount[c.category] >= PRIORITY_THRESHOLD
        ? "High"
        : "Normal",
  }));
};