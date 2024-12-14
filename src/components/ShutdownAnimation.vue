<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { BootLogType, shutdownLog } from '../assets/bootLog'
import Mono from './Mono.vue'
import { sleep } from '../utils/sleep'
import Cursor from './Cursor.vue'

const emit = defineEmits<{
  finished: []
}>()

const shutdownStatus = ref<'log' | 'idle' | 'none'>('log')
const shutdownLogDisplay = ref<[BootLogType, string][]>([])

async function printShutdownLog() {
  shutdownStatus.value = 'log'

  for (const line of shutdownLog) {
    const log = line()

    shutdownLogDisplay.value.push(log)

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

const pressed = ref(false)
async function finish() {
  pressed.value = true
  await sleep(300)
  shutdownStatus.value = 'none'
  await sleep(1200)
  emit('finished')
}

onMounted(async () => {
  document.getElementById('app')?.classList.add('anchor-bottom')

  await printShutdownLog()
  for (let i = 0; i < 3; i++) {
    shutdownLogDisplay.value[shutdownLogDisplay.value.length - 1][1] += ` ${3 - i}.`
    await sleep(1000/3)
    shutdownLogDisplay.value[shutdownLogDisplay.value.length - 1][1] += '.'
    await sleep(1000/3)
    shutdownLogDisplay.value[shutdownLogDisplay.value.length - 1][1] += '.'
    await sleep(1000/3)
  }

  await sleep(500)

  window.addEventListener('keydown', finish)
  window.addEventListener('touchend', finish)

  shutdownStatus.value = 'idle'
})

onBeforeUnmount(() => {
  document.getElementById('app')?.classList.remove('anchor-bottom')
  window.removeEventListener('keydown', finish)
  window.removeEventListener('touchend', finish)
})
</script>

<template>
  <div class="shutdown-log">
    <template v-if="shutdownStatus === 'log'">
      <template v-for="(line, i) in shutdownLogDisplay" :key="i">
        <pre class="boot-log-type"><Mono>[</Mono><Mono :class="'boot-log-type-' + line[0].trim().toLowerCase()">{{ line[0] }}</Mono><Mono>]</Mono></pre>
        <Mono>&nbsp;{{ line[1] }}</Mono>
        <br>

      </template>
    </template>
    <template v-else-if="shutdownStatus === 'idle'">
      <Mono>Press any key to boot from Disk...</Mono>
      <br v-if="pressed">
      <Cursor />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.shutdown-log {
  padding: 1rem;
}
</style>