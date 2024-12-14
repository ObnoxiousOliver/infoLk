<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { bootLog, BootLogType } from '../assets/bootLog'
import Mono from './Mono.vue'
import { sleep } from '../utils/sleep'
import { Display } from '../resources/Display'
import Cursor from './Cursor.vue'

const emit = defineEmits<{
  authenticated: []
}>()

const bootStatus = ref<'bootLog' | 'logo' | 'login'>('bootLog')
const bootLogDisplay = ref<[BootLogType, string][]>([])

async function printBootLog() {
  bootStatus.value = 'bootLog'

  for (const line of bootLog) {
    const log = line()

    bootLogDisplay.value.push(log)

    switch(log[0]) {
      case BootLogType.WARN:
        await sleep(Math.random() * 1000)
        break
      case BootLogType.OK:
        await sleep(Math.random() * 100)
        break
      default:
        await sleep(20)
        break
    }
  }
}

const logo = `   _       _   _             ___  ___ 
  /_\\  ___| |_| |_  ___ _ _ / _ \\/ __|
 / _ \\/ -_|  _| ' \\/ -_| '_| (_) \\__ \\
/_/ \\_\\___|\\__|_||_\\___|_|  \\___/|___/`
const logoSmall = 'AetherOS'

const displayLogo = ref('')
const displayProgress = ref('')

async function printLogo () {
  bootStatus.value = 'logo'
  
  await new Promise<void>((resolve) => {
  let progress = 0

  let progressSpeed = 0.005
  let animationFrame: number | null = null
    function draw() {
      animationFrame = requestAnimationFrame(draw)

      if (Math.random() < 0.05) {
        progressSpeed += Math.random() * 0.001 - 0.0005
        progressSpeed = Math.min(Math.max(progressSpeed, 0.00001), 0.005)
      }

      progress += progressSpeed

      if (progress >= 1) {
        progress = 1
      }

      const w = Display.width()
      const h = Display.height()

      const logoHeight = logo.split('\n').length
      const logoWidth = logo.split('\n').reduce((max, line) => Math.max(max, line.length), 0)

      if (w > logoWidth && h > logoHeight) {
        displayLogo.value = '\n'.repeat(Math.max(0, Math.round((h - logoHeight) / 2))) + logo
          .split('\n')
          .map(line => ' '.repeat(Math.max(0, Math.round(w / 2 - logoWidth / 2))) + line)
          .join('\n')
      } else {
        displayLogo.value = '\n'.repeat(Math.round(h / 2 - 1)) + 
          ' '.repeat(Math.max(0, Math.round((w - logoSmall.length) / 2))) + logoSmall
      }

      let progressMaxLen = 30
      let progressLength = Math.min(progressMaxLen, w - 2)
      let progressLoadingBar = '[' + '='.repeat(Math.round(progress * progressLength)) + ' '.repeat(progressLength - Math.round(progress * progressLength)) + ']'
      let progressPercent = `${Math.round(progress * 100).toString().padStart(3, ' ')}% `
      let progressString = progressLoadingBar.slice(0, Math.max(2, Math.ceil((progressLength - progressPercent.length) / 2 ))) + progressPercent + progressLoadingBar.slice(Math.min(progressLoadingBar.length - 2, Math.floor((progressLength + progressPercent.length) / 2)))

      let progressText = [
        'Initializing system...',
        'Loading modules...',
        'Starting services...',
        'Booting up...'
      ][Math.min(3, Math.floor(progress * 4))]

      displayProgress.value = ' '.repeat(Math.max(0, Math.round(w / 2 - progressText.length / 2))) + progressText +
        '\n' + ' '.repeat(Math.max(0, Math.round(w / 2 - progressString.length / 2))) + progressString

      if (progress >= 1) {
        cancelAnimationFrame(animationFrame)
        resolve()
      }
    }
    draw()
  })
}

const password = ref('')
const cursorPosition = ref(0)
const inputEl = ref<HTMLInputElement | null>(null)

function updateCursor () {
  if (!inputEl.value) return

  cursorPosition.value = (inputEl.value.selectionDirection === 'backward' ? inputEl.value.selectionStart : inputEl.value.selectionEnd) ?? password.value.length
}

const failedAttempts = ref<number[]>([])

function login () {
  if (password.value === '0000') {
    emit('authenticated')
  } else {
    failedAttempts.value.push(password.value.length)
    password.value = ''
  }
}

onMounted(async () => {
  document.getElementById('app')?.classList.add('anchor-bottom')

  await printBootLog()
  await printLogo()

  bootStatus.value = 'login'
})

onBeforeUnmount(() => {
  document.getElementById('app')?.classList.remove('anchor-bottom')
})
</script>

<template>
  <div class="boot-log">
    <template v-if="bootStatus === 'bootLog'">
      <template v-for="(line, i) in bootLogDisplay" :key="i">
        <pre class="boot-log-type"><Mono>[</Mono><Mono :class="'boot-log-type-' + line[0].trim().toLowerCase()">{{ line[0] }}</Mono><Mono>]</Mono></pre>
        <Mono>&nbsp;{{ line[1] }}</Mono>
        <br>

      </template>
    </template>
    <template v-else-if="bootStatus === 'logo'">
      <pre class="logo"><Mono>{{ displayLogo }}</Mono></pre>
      <br>
      <pre class="progress"><Mono>{{ displayProgress }}</Mono></pre>
    </template>
    <template v-else>
      <Mono>Willkommen bei AetherOS!</Mono>
      <br>
      <br>

      <Mono>
        Die Anmeldung ist erforderlich, um fortzufahren. <br>
        Anmeldung als </Mono><Mono style="color: #0ff">pc@ASSxLS</Mono> <Mono>mit Passwort.</Mono>
      <br>
      <br>

      <template v-for="attempt in failedAttempts">
        <Mono>Passwort: {{ '*'.repeat(attempt) }}</Mono>
        <br>
        <br>
        <Mono style="color: #f44">Falsches Passwort. Bitte versuchen Sie es erneut.</Mono>
        <br>
      </template>

      <Mono>Passwort: </Mono>
      <div
        class="password-input"
        :data-password="'*'.repeat(password.length)"
      >
        <label for="password"></label>
        <input
          id="password"
          type="password"
          ref="inputEl"
          v-model="password"
          @selectionchange="updateCursor"
          @input="updateCursor"
          @keydown.enter.prevent="login"
          autofocus
        >
        <Mono>
          {{ '*'.repeat(cursorPosition) }}<Cursor />{{ '*'.repeat(Math.max(0, password.length - cursorPosition)) }}
        </Mono>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.boot-log {
  padding: 1rem;
}

.logo {
  color: rgb(255, 143, 244);
}

.password-input {
  position: relative;
  display: inline-block;
  
  input {
    appearance: none;
    background: transparent;
    border: none;
    color: #fff;
    font-family: inherit;
    font-size: 1rem;
    color: transparent;
    position: absolute;
    inset: 0;
  
    &:focus {
      outline: none;
    }
  }
  
  label {
    z-index: 9999;
    position: fixed;
    inset: 0;
  }
  
  & > span {
    content: attr(data-password);
    color: #fff;
    pointer-events: none;
  }
}
</style>