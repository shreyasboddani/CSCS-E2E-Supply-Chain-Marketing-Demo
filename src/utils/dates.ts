export const formatScenarioDate = (
  value: string,
  options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" },
): string => {
  const normalized = value.length === 10 ? value + "T12:00:00Z" : value;
  return new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" }).format(new Date(normalized));
};

export const formatCompactDate = (value: string): string =>
  formatScenarioDate(value, { month: "short", day: "numeric" }).toUpperCase();
