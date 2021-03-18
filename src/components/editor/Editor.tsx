import "./Editor.css";

import Text from "../text/Text";
import MarkdownIt from "markdown-it";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.min.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/toolbar/prism-toolbar.min.js";
import "prismjs/plugins/toolbar/prism-toolbar.css";
import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js";

import logger from "../../lib/logger";
import data from "../../data";

export function Render(input: any) {
    const { id, View } = input;
    const prefixKey = `${id}-Editor-`;
    const inputId = `${prefixKey}Input`;
    const textId = `${prefixKey}Text`;

    const md = new MarkdownIt({
        highlight: function (str, lang) {
            let tmpLang = lang.split(":")[0];
            switch (tmpLang) {
                case "css":
                case "html":
                case "js":
                case "javascript":
                    break;
                default:
                    tmpLang = "clike";
                    break;
            }
            return (
                `<pre class="language-${tmpLang}"><code class="language-${tmpLang}">` +
                str +
                "</code></pre>"
            );
        }
    });

    let { textData } = input;
    if (!textData) {
        textData = data.service.data[View.DataKey];
    }
    if (!textData) {
        $(`#${id}`).html("NoData");
        return;
    }

    $(`#${id}`).html(`
    <div class="row">
      <div class="col m6 s12 editor-output" id="${textId}">
      </div>
      <div class="col m6 s12 editor-input">
        <hr class="editor-hr" />
        <div class="row">
          <div class="input-field col s12">
            <textarea id="${inputId}" class="materialize-textarea">${textData}</textarea>
          </div>
        </div>
      </div>
    </div>
    `);

    $(`#${inputId}`)
        .on("keyup", function () {
            View.OnChange($(this).val());
        })
        .on("change", function () {
            View.OnChange($(this).val());
        });

    M.textareaAutoResize($(`#${inputId}`));

    const textarea = $(`#${inputId}`);
    if (!textarea) {
        return;
    }
    function render() {
        Text.Render({
            id: textId,
            textData: textarea.val(),
            View: {}
        });
    }

    $(`#${inputId}`).on("keyup", render).on("change", render);
    render();
}

const index = {
    Render
};
export default index;
