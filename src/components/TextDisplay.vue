<script lang="ts" setup>
import { RichTextFile } from '../resources/fs/RichTextFile';

defineProps<{
  file: RichTextFile
}>()
</script>

<template>
  <div class="text-display">
    <file.content />
  </div>
</template>

<style lang="scss" scoped>
.text-display {
  height: 100%;
  padding: 0 1rem;
}
</style>