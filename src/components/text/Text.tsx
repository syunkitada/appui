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
    const navId = `${prefixKey}Nav`;
    const scrollSpyClass = `${prefixKey}ScrollSpy`;

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
    <div class="row text" style="padding: 0 5px">
      <div class="col s9 text-content" id="${textId}">
      </div>
      <div class="col s3 text-nav">
        <ul id="${navId}" class="section table-of-contents">
        </ul>
      </div>
    </div>
    `);

    // hide for rerendering
    $(`#${textId}`).html(md.render(textData)).hide();

    const navs = [];
    const contents = [];
    let header: any = null;
    let content: any = [];
    const children = $(`#${textId}`).children();
    for (let i = 0, len = children.length; i < len; i++) {
        const child = children[i];
        if (child.nodeName === "H2") {
            if (header) {
                const id = encodeURI(header.text());
                contents.push(
                    `<div id="${id}" class="section ${scrollSpyClass}">${content.join(
                        ""
                    )}</div>`
                );
                navs.push(`<li><a href="#${id}">${header.text()}</a></li>`);
                content = [child.outerHTML];
            } else {
                content.push(child.outerHTML);
            }
            header = $(child);
        } else {
            content.push(child.outerHTML);
        }
    }
    if (content.length > 0) {
        if (header) {
            const id = encodeURI(header.text());
            header.attr("id", id);
            contents.push(
                `<div id="${id}" class="section ${scrollSpyClass}">${content.join(
                    ""
                )}</div>`
            );
            navs.push(`<li><a href="#${id}">${header.text()}</a></li>`);
        } else {
            contents.push(`<div class="section">${content.join("")}</div>`);
        }
    }

    $(`#${textId}`).html(contents.join(""));
    Prism.highlightAll();
    $(`#${textId}`).show();

    $(`#${navId}`).html(navs.join(""));
    $(`.${scrollSpyClass}`).scrollSpy();
}

const index = {
    Render
};
export default index;
