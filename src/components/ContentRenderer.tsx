import { Content } from "../resources/Content"
import { textStyleToCss } from "../resources/TextStyle"

function ContentRenderer (props: { content: Content }) {
  console.log(props.content)
  return (
    <>{typeof props.content === 'string'
      ? (<span>{props.content}</span>)
      : (<span
        id={props.content.style.id}
        style={textStyleToCss(props.content.style)}
      >{props.content.text()}</span>)}</>
  )
}

export default ContentRenderer