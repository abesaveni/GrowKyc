/** Simulate async API load */
export function fetchMock(loader, delayMs = 450) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(loader()), delayMs);
  });
}
