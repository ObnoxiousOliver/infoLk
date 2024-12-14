<template>
  <div class="terminal">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.terminal {
  &::before {
    content: '';
    z-index: 9998;
    display: block;
    position: fixed;
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
    position: fixed;
    inset: 0;
    pointer-events: none;

    box-shadow: 0 0 10rem rgba(0, 0, 0, 0.6) inset;
    background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 0) 80%, rgba(0, 0, 0, 0.6)), linear-gradient(90deg, #ff00001a 33%, #00ff001a 33%, #00ff001a 67%, #0000ff1a 67%);
    background-size: 100% 0.125rem, 0.125rem 100%;
    filter: blur(.01rem);
  }
}
</style>