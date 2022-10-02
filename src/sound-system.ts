import oneUpUrl from './assets/1up.wav'
import clearUrl from './assets/clear.wav'
import coinUrl from './assets/coin.wav'
import gameOverUrl from './assets/game_over.wav'
import matchCorrectUrl from './assets/match_correct.wav'
import matchIncorrectUrl from './assets/match_incorrect.wav'
import selectUrl from './assets/select.wav'
import { CardType } from './domain/CardType'

type Sfx = {
  url: string,
  promise: Promise<ArrayBuffer>,
  source: AudioBufferSourceNode | null
}

const soundPriorityUrls = [
  oneUpUrl,
  coinUrl,
  matchCorrectUrl,
  matchIncorrectUrl,
  selectUrl
]

const soundSecondaryUrls = [
  clearUrl,
  gameOverUrl
]

const sfxMap = new Map<string, Sfx>()
;

(() => {
  // Load the smaller sounds first
  const prioritySoundPromises: Array<Promise<ArrayBuffer>> = []
  for (let url of soundPriorityUrls) {
    const promise = fetch(url).then(res => res.arrayBuffer())
    prioritySoundPromises.push(promise)
    sfxMap.set(url, {
      url,
      promise,
      source: null
    })
  }
  // Load the longer sounds second
  Promise.all(prioritySoundPromises).then(() => {
    for (let url of soundSecondaryUrls) {
      const promise = fetch(url).then(res => res.arrayBuffer())
      sfxMap.set(url, {
        url,
        promise,
        source: null
      })
    }
  })
})()

let audioContext: AudioContext | null = null
;

/**
 * iOS locking and unlocking for a few seconds disables sound
 * This workaround is ridiculous: https://stackoverflow.com/a/69546084
 */
(() => {
  const el = document.createElement('audio') as HTMLAudioElement
  el.preload = 'none'
  el.src = selectUrl
  document.body.appendChild(el)
})()

async function ensureSoundLoaded(url: string) {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume() // Does this really do anything? https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API#controlling_sound
  }
  const sfx = sfxMap.get(url)
  if (!sfx) return null
  if (sfx.source) sfx.source.stop() // Prevent amplifying by allowing only one at a time
  sfx.source = audioContext.createBufferSource()
  sfx.source.buffer = await sfx.promise.then(bytes => {
    if (audioContext && sfx.source) {
      sfx.source.connect(audioContext.destination)
      return audioContext.decodeAudioData(bytes.slice(0))
    }
    return null
  })
  return sfx.source
}

/**
 * Due to the AudioContext, this function must run in the context of a user gesture
 */
async function playSound(url: string) {
  ensureSoundLoaded(url).then(source => {
    if (source) {
      source.start()
    } else {
      console.error(`Could not play sound effect: ${url}`)
    }
  })
}

export function playClearSound() {
  playSound(clearUrl)
}

export function stopClearSound() {
  const sfx = sfxMap.get(clearUrl)
  if (!sfx) return
  if (sfx.source) sfx.source.stop()
}

export function playMatchCorrectSound(cardType: CardType) {
  if (cardType === CardType.Coins10 || cardType === CardType.Coins20) {
    playSound(coinUrl)
  } else if (cardType === CardType.OneUp) {
    playSound(oneUpUrl)
  } else {
    playSound(matchCorrectUrl)
  }
}

export function playMatchIncorrectSound() {
  playSound(matchIncorrectUrl)
}

export function playSelectSound() {
  playSound(selectUrl)
}
