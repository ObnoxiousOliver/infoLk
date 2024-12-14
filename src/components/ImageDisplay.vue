<script lang="ts" setup>
import { ImageFile } from '../resources/fs/ImageFile';

defineProps<{
  file: ImageFile
}>()
</script>

<template>
  <div class="image-display">
    <img :src="file.src" :alt="file.name">
  </div>
</template>

<style lang="scss" scoped>
.image-display {
  padding: 1rem;
  height: 100%;

  img {
    display: block;
    max-width: 100%;
    max-height: 100%;
    margin: auto;
    object-fit: contain;
  }
}
</style>