import "./Text.css";

import MarkdownIt from "markdown-it";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.min.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/toolbar/prism-toolbar.min.js";
import "prismjs/plugins/toolbar/prism-toolbar.css";
import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js";

import Dashboard from "../core/Dashboard";
import locationData from "../../data/locationData";
import service from "../../apps/service";
import logger from "../../lib/logger";
import data from "../../data";
import converter from "../../lib/converter";

export function Render(input: any) {
    const { id, View } = input;
    const location = locationData.getLocationData();
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
            return `<pre class="language-${tmpLang}"><code class="language-${tmpLang}">${converter.escapeHtml(
                str
            )}</code></pre>`;
        }
    });

    let { textData } = input;
    if (!textData) {
        textData = data.service.data[View.DataKey];
    }
    if (!textData || !textData.Text) {
        $(`#${id}`).html("NoData");
        return;
    }

    let tagHeader = "";
    if (textData.UpdatedAt) {
        tagHeader += `
      <div class="col m9 s12 text-tag-header">
        Updated At: ${converter.formatDate(textData.UpdatedAt)}
      </div>
      `;
    }

    $(`#${id}`).hide().html(`
    <div class="row text" style="padding: 0 5px">
      ${tagHeader}
      <div class="col m9 s12 text-content" id="${textId}">
      </div>
      <div id="${navId}" class="col m3 s11 text-nav">
      </div>
    </div>
    `);

    if (View.DataFormat == "Raw") {
        // hide for rerendering
        $(`#${textId}`).html(textData.Text).hide();
    } else {
        // hide for rerendering
        $(`#${textId}`).html(md.render(textData.Text)).hide();
    }

    const navs = [];
    const contents = [];
    let header: any = null;
    let content: any = [];
    const children = $(`#${textId}`).children();
    for (let i = 0, len = children.length; i < len; i++) {
        const child = children[i];
        if (
            child.nodeName === "H2" &&
            !child.className.includes("ignore-nav")
        ) {
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

    const navsHtml = `<ul class="section table-of-contents text-right-menu">${navs.join(
        ""
    )}</ul>`;
    $(`#${navId}`).html(navsHtml);
    Dashboard.RightBottomMenu.Render({ html: navsHtml });
    $(`.${scrollSpyClass}`).scrollSpy();

    if (View.OnRenderLast) {
        View.OnRenderLast({
            textId
        });
    }

    $(`#${id}`).show();
}

const index = {
    Render
};
export default index;
