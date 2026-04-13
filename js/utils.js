export function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

export function randomPosition(max) {
  return Math.floor(Math.random() * max);
}