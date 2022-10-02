const STORAGE_KEY = 'matching_a5b2de657a650b527eabf78d6f85bdaebc2635e1b2020a67bc614bf3b8362352_index'

export function persistPatternIndex(index: number) {
  try {
    localStorage.setItem(STORAGE_KEY, `${index}`)
  } catch (e) {
    console.log('Could not persist the given pattern index', e)
  }
}

export function retrievePatternIndex() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return parseInt(raw, 10)
    }
  } catch (e) {
    console.log('Could not retrieve persisted pattern index', e)
    return 0
  }
  return 0
}
