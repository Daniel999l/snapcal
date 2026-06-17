const windows = new Map();

function getWindowKey(category, id) {
  const hour = new Date().getHours();
  const date = new Date().toDateString();
  return `${category}:${id}:${date}:${hour}`;
}

export function checkAndIncrement(category, id, max) {
  const key = getWindowKey(category, id);
  const now = Date.now();
  const entry = windows.get(key);

  if (!entry || (now - entry.start) > 3600000) {
    windows.set(key, { count: 1, start: now });
    return { allowed: true, remaining: max - 1 };
  }

  entry.count++;

  if (entry.count > max) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: max - entry.count };
}