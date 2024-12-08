<script setup lang="ts">
import TerminalWindow from "./components/TerminalWindow.vue"
</script>

<template>
  <TerminalWindow />
</template>

<style lang="css">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body, html, #root {
  position: fixed;
  inset: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
  background-color: black;
  color: white;
  overflow: hidden;
  font-family: 'JetBrains Mono', 'Fira Code', 'Inconsolata', 'Monaco', monospace;
  font-variant-ligatures: none;
}

:root {
  font-size: clamp(8px, 2vw, 32px);
}

@keyframes blink {
  50% {
    color: black;
    background: white;
  }
}

#suggestions-menu {
  position: fixed;
  background: #222;
  border: .125rem solid #333;
  color: white;
  min-width: min(10rem, 100vw);
  max-width: calc(100vw - 1rem);
  max-height: 50vh;
  overflow-y: auto;

  .suggestion {
    cursor: pointer;
    padding: 0.5rem .75rem;
    display: flex;
    flex-flow: column nowrap;

    &:hover {
      background: #333;
    }
    &.selected {
      background: #fff;
      color: #000;
    }

    .suggestion-description {
      font-size: 0.75rem;
      color: #aaa;
    }
  }
}
</style>
