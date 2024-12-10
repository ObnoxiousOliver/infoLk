<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { TerminalRenderer } from "../resources/TerminalRenderer"
import { Content } from "../resources/Content";
import { OS } from "../resources/OS";
import ContentRenderer from "./ContentRenderer.vue";

const terminalRenderer = new TerminalRenderer()

const data = ref<Content[][]>([])

terminalRenderer.stream.on('data', (content) => {
  data.value = content
})

const terminalWindow = ref<HTMLElement | null>(null)
watch(data, () => {
  scrollToBottom()
})

function scrollToBottom() {
  terminalWindow.value?.scrollTo({
    top: terminalWindow.value.scrollHeight,
    behavior: 'instant',
  })
}

onMounted(async () => {
  const os = new OS(terminalRenderer.stream)

  while(true) {
    await os.run()
  }
})
</script>

<template>
  <div
    class="terminalWindow"
    id="terminalWindow"
    ref="terminalWindow"
  >
    <div class="spacer" />
    <pre><span v-for="(line, index) in data" :key="(index)"><ContentRenderer
      v-for="content in line"
      :key="content.toString()"
      :content="content"
    /><br></span><label class="screenLabel" for="input" @click="scrollToBottom" /></pre>
  </div>
</template>

<style lang="css" scoped>
.terminalWindow {
  color: white;
  height: 100%;
  line-height: 1.3;

  overflow-y: auto;

  &::before {
    content: '';
    z-index: 9998;
    display: block;
    position: absolute;
    inset: 0;
    pointer-events: none;
    -webkit-backdrop-filter: blur(0.03rem)contrast(.9)brightness(1.1);
    backdrop-filter: blur(0.03rem)contrast(.9)brightness(1.1);
    will-change: filter;
  }

  &::after {
    content: '';
    z-index: 9999;
    display: block;
    position: absolute;
    inset: 0;
    box-shadow: 0 0 10rem rgba(0, 0, 0, 0.5) inset;
    background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 0) 80%, rgba(0, 0, 0, 0.6)), linear-gradient(90deg, #ff00001a 33%, #00ff001a 33%, #00ff001a 67%, #0000ff1a 67%);
    background-size: 100% 0.125rem, 0.125rem 100%;
    pointer-events: none;
    filter: blur(.01rem);
    /* mix-blend-mode: multiply; */
    /* will-change: mix-blend-mode; */
  }

  .screenLabel {
    position: absolute;
    inset: 0;
    min-height: 100svh;
  }

  pre span {
    text-shadow:
      -.05rem 0 0 rgb(var(--text-color-r, 255), 0, 0),
      .05rem 0 0 rgb(0, var(--text-color-g, 255), var(--text-color-b, 255))
    ;
    mix-blend-mode: difference;
  }

  pre {
    padding: .75rem;
    display: block;
    font-family: inherit;
    overflow: visible;
    position: relative;
    white-space: pre-wrap;
    word-wrap: break-word;
    /* min-height: 100%; */
  }

  .spacer {
    flex-grow: 1;
  }
}
</style>