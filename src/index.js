import "core-js/stable"
import "regenerator-runtime/runtime"

import "index.sass"
import { html, render } from "lit-html"
import config from "config.yaml"

const template = text =>
  html`
    <div>${text}</div>
  `
render(template(config.text), document.body)
