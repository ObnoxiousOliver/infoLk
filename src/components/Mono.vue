<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';

const textColor = reactive({
  r: 255,
  g: 255,
  b: 255
});

const mono = ref<HTMLElement | null>(null);

onMounted(() => {
  if (!mono.value) return;

  const color = getComputedStyle(mono.value).color;
  const [r, g, b] = color.match(/\d+/g)!.map(Number);

  textColor.r = r;
  textColor.g = g;
  textColor.b = b;
})
</script>

<template>
  <span class="mono" ref="mono" :style="{
    '--text-color-r': textColor.r,
    '--text-color-g': textColor.g,
    '--text-color-b': textColor.b
  }">
    <slot />
  </span>
</template>

<style lang="scss" scoped>
.mono:not(.external-viewer .mono) {
  text-shadow:
      -.05rem 0 0 rgb(var(--text-color-r, 255), 0, 0),
      .05rem 0 0 rgb(0, var(--text-color-g, 255), var(--text-color-b, 255))
    ;
  mix-blend-mode: difference;
}
</style>