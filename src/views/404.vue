<script setup lang="ts">
import Mono from '../components/Mono.vue';
import Terminal from '../components/Terminal.vue';
</script>

<template>
  <Terminal class="terminal">
    <div>
      <Mono>
        404 - Not Found x_x
      </Mono>
      <br>
      <br>
      <RouterLink to="/" class="back">
        <Mono>← Zurück</Mono>
      </RouterLink>
    </div>
  </Terminal>
</template>

<style lang="scss" scoped>
.terminal {
  height: 100%;
  display: grid;
  place-items: center;
  text-align: center;
}

.back {
  color: white;
}
</style>