import "./Text.css";

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
    const prefixKey = `${id}-`;
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

    $(`#${id}`).html(`
    <div class="row text" style="padding: 0 5px">
      <div class="col s12" id="${textId}">
      </div>
    </div>
    `);

    $(`#${textId}`).html(md.render(textData));
    Prism.highlightAll();
}

const index = {
    Render
};
export default index;
