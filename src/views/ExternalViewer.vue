<script lang="ts" setup>
import { computed } from 'vue';
import { Directory } from '../resources/fs/Directory';
import { useRouter } from 'vue-router';
import { FileElement } from '../resources/fs/FileElement';
import { fs } from '../assets/fs';
import { ImageFile } from '../resources/fs/ImageFile';
import { RichTextFile } from '../resources/fs/RichTextFile';

const router = useRouter();
const booted = localStorage.getItem('booted') === 'true';

if (!booted) {
  router.push('/');
}

const currentFile = computed<FileElement | null>(() => fs.get(router.currentRoute.value.params.path as string ?? ''));
</script>

<template>
  <div class="external-viewer">
    <nav class="external-viewer__navbar">
      <RouterLink
        v-if="currentFile?.parent"
        :to="`/ext/${currentFile.parent.toPath()}`"
        class="external-viewer__navbar__up"
      >←</RouterLink>
      <div class="external-viewer__navbar__path">
        {{ currentFile?.toPath() }}
      </div>
      <div style="flex-grow: 1;"/>
      <RouterLink :to="currentFile ? `/explorer/${currentFile.toPath()}` : '/explorer'" class="external-viewer__navbar__explorer">
        Zum Terminal
      </RouterLink>
    </nav>
    <main>
      <div v-if="currentFile?.type === 'directory'" class="external-viewer__list">
        <RouterLink
          v-if="currentFile?.parent"
          :to="`/ext/${currentFile.parent.toPath()}`"
          class="external-viewer__item"
        >
          <div class="external-viewer__item__name">
            /..
          </div>
        </RouterLink>
        <template v-for="file in (currentFile as Directory).children" :key="file.name">
          <RouterLink :to="`/ext/${file.toPath()}`" class="external-viewer__item">
            <div class="external-viewer__item__icon">
              <template v-if="(file instanceof Directory)">📁</template>
              <template v-else-if="(file instanceof ImageFile)">🖼️</template>
              <template v-else>📄</template>
            </div>
            <div class="external-viewer__item__name">
              {{ file.name }}
            </div>
          </RouterLink>
        </template>
      </div>
      <template v-else-if="currentFile?.type === 'file'">
        <div v-if="(currentFile instanceof RichTextFile)" class="external-viewer__text-display">
          <currentFile.content />
        </div>
        <div v-if="(currentFile instanceof ImageFile)" class="external-viewer__image-display">
          <img :src="currentFile.src">
        </div>
      </template>
      <template v-else>
        Datei oder Verzeichnis nicht gefunden
        <br><br>
        <RouterLink to="/ext">
          ← Zurück zu "~"
        </RouterLink>
      </template>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.external-viewer {
  background: white;
  color: black;
  display: flex;
  flex-direction: column;
  min-height: 100%;

  main {
    flex-grow: 1;
  }

  &__navbar {
    padding: 1rem 1rem 0;
    z-index: 1;
    position: sticky;
    top: 0;
    display: flex;
    background: white;

    &__up {
      position: relative;
      margin-right: 1rem;

      &::before {
        content: '';
        position: absolute;
        inset: -.5125rem -.75rem;
      }
    }
  }

  &__list {
    padding: 1rem;
    display: flex;
    flex-direction: column;
  }

  &__item {
    padding: .2rem 0;
    display: flex;
    flex-direction: row;
    text-decoration: none;

    &__icon {
      margin-right: .5rem;
      width: 1.5rem;
    }

    &__name {
      text-decoration: underline;
    }
  }

  &__text-display {
    padding: 1rem;
  }

  &__image-display {
    padding: 1rem;

    img {
      max-width: 100%;
    }
  }
}
</style>