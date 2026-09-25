if (process.env.CI !== 'true' && process.env.NODE_ENV !== 'production') {
  const husky = (await import('husky')).default
  husky()
}