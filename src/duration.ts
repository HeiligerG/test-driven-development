export function formatDuration(seconds: number): string {
  if (seconds < 0) {
    throw new Error("Duration must be positive");
  }

  const totalSeconds = Math.round(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  let result = "";
  if (hours) result += `${hours}h`;
  if (minutes) result += `${minutes}m`;
  if (secs || result === "") result += `${secs}s`;

  return result;
}
