<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import BootAnimation from '../components/BootAnimation.vue';
import Terminal from '../components/Terminal.vue';
import { computed } from 'vue';
import ShutdownAnimation from '../components/ShutdownAnimation.vue';

const router = useRouter()
const route = useRoute()

const booted = localStorage.getItem('booted') === 'true'
const shutdown = computed(() => route.params.operation === 'shutdown')

if (booted && !shutdown.value) {
  router.push('/explorer')
} else if (shutdown.value) {
  localStorage.setItem('booted', 'false')
}

function authenticated() {
  localStorage.setItem('booted', 'true')
  router.push('/explorer')
}

function shutdownFinished() {
  router.push('/')
}
</script>

<template>
  <div style="flex-grow: 1;" />
  <Terminal>
    <BootAnimation v-if="!shutdown" @authenticated="authenticated" />
    <ShutdownAnimation v-else @finished="shutdownFinished"/>
  </Terminal>
</template>