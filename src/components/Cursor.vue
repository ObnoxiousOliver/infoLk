<template>
  <span class="cursor">
    <span>
      &nbsp;
    </span>
  </span>
</template>

<style lang="scss" scoped>
.cursor {
  display: inline-block;
  width: 0;

  span {
    display: inline-block;
    background: white;
    mix-blend-mode: difference;
    width: fit-content;
    animation: blink 1s infinite;
  }
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}
</style>