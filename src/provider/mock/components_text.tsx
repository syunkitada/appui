const index = {
    Data: {
        TextReadme: `
# README

- 各種コンポーネントの表示確認用のページです。

`,
        TextRaw: `
<h1>Basic Items</h1>

<h2>Headers</h2>
<div style="background-color: #ccc;">
<h1 style="background-color: #aaa;">Header1</h1>
<h2 style="background-color: #aaa;" class="ignore-nav">Header2</h2>
<h3 style="background-color: #aaa;">Header3</h3>
<h4 style="background-color: #aaa;">Header4</h4>
</div>

<h2>Table</h2>
`,
        TextMd: `
# Header1

Text1

## Header2

Text2

### Header3

Text3
`
    },
    View: {
        Kind: "Tabs",
        Name: "Text",
        Children: [
            {
                Kind: "Pane",
                Name: "Readme",
                Views: [
                    {
                        Kind: "Text",
                        DataKey: "TextReadme"
                    }
                ]
            },
            {
                Kind: "Pane",
                Name: "RawText",
                Views: [
                    {
                        Kind: "Text",
                        DataKey: "TextRaw",
                        DataFormat: "Raw"
                    }
                ]
            },
            {
                Kind: "Pane",
                Name: "MdText",
                Views: [
                    {
                        Kind: "Text",
                        DataKey: "TextMd",
                        DataFormat: "Md"
                    }
                ]
            }
        ]
    }
};

export default index;
