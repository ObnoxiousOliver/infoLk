import { createEffect } from "solid-js"
import { TerminalRenderer } from "../resources/TerminalRenderer"
import ContentRenderer from "./ContentRenderer"

import './TerminalWindow.css'
import { OS } from "../resources/OS"

function TerminalWindow () {
  const terminalRenderer = new TerminalRenderer()

  const os = new OS(terminalRenderer.stream)
  ;(async () => {
    while(true) {
      await os.run()
    }
  })()
  
  createEffect(() => {
    terminalRenderer.stream.read()
    const terminalWindow = document.getElementById('terminalWindow')

    if (terminalWindow === null) return

    terminalWindow.scrollTop = terminalWindow.scrollHeight
  })

  return <div class="terminalWindow" id="terminalWindow">
    <div class="spacer"></div>
    <pre>{
      terminalRenderer.stream.read().map((content) => (
        <ContentRenderer content={content} />
      ))
    }
      <label class="screenLabel" for="input"></label>
    </pre>
  </div>
}

export default TerminalWindow