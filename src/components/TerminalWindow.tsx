import { createSignal } from "solid-js"
import { TerminalRenderer } from "../resources/TerminalRenderer"
import ContentRenderer from "./ContentRenderer"

import './TerminalWindow.css'
import { OS } from "../resources/OS"

function TerminalWindow () {
  const terminalRenderer = new TerminalRenderer()
  const [content, setContent] = createSignal(terminalRenderer.stream.read())

  terminalRenderer.stream.on('data', (data) => {
    setContent(data)
  })

  const os = new OS(terminalRenderer.stream)
  os.boot()

  return <div class="terminalWindow" id="terminalWindow">
    <pre>{
      content().map((content) => (
        <ContentRenderer content={content} />
      ))
    }</pre>
  </div>
}

export default TerminalWindow