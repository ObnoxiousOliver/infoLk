<!-- import { Content } from "../resources/Content"
import { textStyleToCss } from "../resources/TextStyle"

function ContentRenderer (props: { content: Content }) {
  return (
    <>{
      typeof props.content === 'string'
        ? (<span>{props.content}</span>)
        : (<span
          id={props.content.style.id}
          style={textStyleToCss(props.content.style)}
        >{
          props.content.text().split('').map((char) => (
            <span style={char === '\n' ? {} : {
              display: 'inline-block',
              width: '.66rem',
            }}>{char}</span>
          ))
        }</span>)
    }</>
  )
}

export default ContentRenderer -->

<script setup lang="ts">
import { Content } from '../resources/Content';
import { textStyleToCss } from '../resources/TextStyle';

defineProps<{
  content: Content
}>()
</script>

<template>
  <span v-if="typeof content === 'string'">{{ content }}</span>
  <span
    v-else
    :id="content.style.id"
    :style="textStyleToCss(content.style)"
  >
    <span
      v-for="char in content.text().split('')"
      :key="char"
      :style="char === '\n' ? {} : {
        display: 'inline-block',
        width: '.66rem',
      }"
    >{{ char }}</span>
  </span>
</template>