import oneUpUrl from './assets/1up.wav'
import clearBetterUrl from './assets/clear_better.wav'
import clearWorseUrl from './assets/clear_worse.wav'
import coinUrl from './assets/coin.wav'
import matchCorrectUrl from './assets/match_correct.wav'
import matchIncorrectUrl from './assets/match_incorrect.wav'
import selectUrl from './assets/select.wav'

type Sfx = {
  url: string,
  promise: Promise<ArrayBuffer>
}

const soundUrls = [
  oneUpUrl,
  clearBetterUrl,
  clearWorseUrl,
  coinUrl,
  matchCorrectUrl,
  matchIncorrectUrl,
  selectUrl
]

const sfxMap = new Map<string, Sfx>()

for (let url of soundUrls) {
  sfxMap.set(url, {
    url,
    promise: fetch(url).then(res => res.arrayBuffer())
  })
}

let audioContext: AudioContext | null = null

async function ensureSoundLoaded(url: string) {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  const sfx = sfxMap.get(url)
  if (!sfx) return null
  const source = audioContext.createBufferSource()
  source.buffer = await sfx.promise.then(bytes => {
    if (audioContext) {
      source.connect(audioContext.destination)
      return audioContext.decodeAudioData(bytes.slice(0))
    }
    return null
  })
  return source
}

/**
 * Due to the AudioContext, this function must run in the context of a user gesture
 */
async function playSound(url: string) {
  ensureSoundLoaded(url).then(source => {
    console.log('TODO: Something here', source)
    if (source) {
      source.start()
    } else {
      console.error(`Could not play sound effect: ${url}`)
    }
  })
}

export function playClearBetterSound() {
  playSound(clearBetterUrl)
}

export function playClearWorseSound() {
  playSound(clearWorseUrl)
}

export function playOneUpSound() {
  playSound(oneUpUrl)
}

export function playCoinSound() {
  playSound(coinUrl)
}

export function playMatchCorrectSound() {
  playSound(matchCorrectUrl)
}

export function playMatchIncorrectSound() {
 playSound(matchIncorrectUrl)
}

export function playSelectSound() {
  playSound(selectUrl)
}
