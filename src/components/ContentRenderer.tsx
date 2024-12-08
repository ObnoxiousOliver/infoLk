import { Content } from "../resources/Content"
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

export default ContentRenderer