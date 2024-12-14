<script lang="ts" setup>
import { computed } from 'vue';
import { Directory } from '../resources/fs/Directory';
import { useRouter } from 'vue-router';
import { FileElement } from '../resources/fs/FileElement';
import { ImageFile } from '../resources/fs/ImageFile';
import { RichTextFile } from '../resources/fs/RichTextFile';
import Mono from '../components/Mono.vue';
import { AssetFile } from '../resources/fs/AssetFile';
import { ComponentFile } from '../resources/fs/ComponentFile';
import ImageDisplay from '../components/ImageDisplay.vue';
import Terminal from '../components/Terminal.vue';
import TextDisplay from '../components/TextDisplay.vue';
import { fs } from '../assets/fs';

const router = useRouter();
const booted = localStorage.getItem('booted') === 'true';

if (!booted) {
  router.push('/');
}

const currentFile = computed<FileElement | null>(() => fs.get(router.currentRoute.value.params.path as string ?? ''));
</script>

<template>
  <Terminal class="terminal">
    <div class="explorer">
      <nav class="explorer__navbar">
        <div>
          <RouterLink
            v-if="currentFile?.parent"
            :to="`/explorer/${currentFile.parent.toPath()}`"
            class="explorer__navbar__up"
          ><Mono>←</Mono></RouterLink>
          <Mono class="explorer__navbar__user">
            pc@ASSxLS
          </Mono>
          <Mono class="explorer__navbar__path">
            {{ currentFile?.toPath() }}
          </Mono>
        </div>
        <div style="flex-grow: 1;"/>
        <RouterLink :to="currentFile ? `/ext/${currentFile.toPath()}` : '/ext'" class="explorer__navbar__external-viewer">
          <Mono>📄</Mono>
        </RouterLink>&nbsp;
        <RouterLink to="/shutdown" class="explorer__navbar__shutdown">
          <Mono>⏻</Mono>
        </RouterLink>
      </nav>
      <main>
        <div v-if="currentFile?.type === 'directory'" class="explorer__grid">
          <RouterLink
            v-if="currentFile?.parent"
            :to="`/explorer/${currentFile.parent.toPath()}`"
            class="explorer__item"
          >
            <div class="explorer__item__icon">
              <pre class="explorer__folder"><Mono><br>  ∆<br>__|</Mono></pre>
            </div>
            <div class="explorer__item__name">
              <Mono>/..</Mono>
            </div>
          </RouterLink>
          <template v-for="file in (currentFile as Directory).children" :key="file.name">
            <RouterLink :to="`/explorer/${file.toPath()}`" class="explorer__item">
              <div class="explorer__item__icon">
                <template v-if="(file instanceof Directory)">
                  <pre class="explorer__folder"><Mono> ___,--.<br>|      |<br>!______!</Mono></pre>
                </template>
                <template v-else>
                  <pre><Mono>,’""|<br>|{{
                    (file instanceof AssetFile || file instanceof ComponentFile)
                      ? (file.extension ?? '').toUpperCase().padStart(3, ' ')
                      : '   '
                  }}|<br>|___|</Mono></pre>
                </template>
              </div>
              <div class="explorer__item__name">
                <Mono>{{ file.name }}</Mono><br><br>
              </div>
            </RouterLink>
          </template>
        </div>
        <template v-else-if="currentFile?.type === 'file'">
          <ImageDisplay v-if="(currentFile instanceof ImageFile)" :file="currentFile" />
          <TextDisplay v-else-if="(currentFile instanceof RichTextFile)" :file="currentFile" />
        </template>
        <template v-else>
          <Mono>Datei oder Verzeichnis nicht gefunden</Mono>
          <br><br>
          <RouterLink to="/explorer">
            <Mono>← Zurück zu ~</Mono>
          </RouterLink>
        </template>
      </main>
    </div>
  </Terminal>
</template>

<style lang="scss" scoped>
.terminal {
  height: 100%;
}

.explorer {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: fit-content;

  main {
    flex-grow: 1;
  }

  &__navbar {
    padding: 1.25rem 1rem;
    z-index: 1;
    background: #000;
    color: #fff;
    position: sticky;
    top: 0;
    display: flex;
    flex-flow: row nowrap;

    &__up {
      position: relative;
      color: white;
      // text-decoration: none;

      &::before {
        content: '';
        position: absolute;
        inset: -.5125rem -.75rem;
      }
    }

    &__path {
      color: #FD91FF;
      overflow: hidden;
    }

    &__user {
      color: #2EEAFF;
    }

    &__external-viewer {
      padding: 0 .5rem;
      position: relative;
      color: #fff;
      text-decoration: none;

      &::before {
        content: '';
        position: absolute;
        inset: -.75rem 0;
      }
    }

    &__shutdown {
      color: #FF6B6B;
      text-decoration: none;
      padding: 0 .5rem;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        inset: -.75rem 0;
      }
    }
  }

  &__folder {
    color: #FFDB70;
  }

  &__grid {
    padding: 0 1rem;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
  }

  &__item {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    color: #fff;
    text-align: center;
    text-decoration: none;

    &__icon {
      padding: 1.25rem 1rem;
    }

    &__name {
      text-decoration: underline;
    }
  }
}
</style>