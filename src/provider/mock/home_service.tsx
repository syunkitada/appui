import logger from "../../lib/logger";

function getIndex() {
    const view = {
        Name: "Root",
        Kind: "Panes",
        Children: [
            {
                Kind: "Pane",
                Name: "Home",
                Views: [
                    {
                        Kind: "Text",
                        DataKey: "Text"
                    }
                ]
            }
        ]
    };

    const index = {
        DefaultRoute: {
            Path: ["Home"]
        },
        View: view
    };

    return index;
}

const index = {
    getServiceIndex: function (input: any): void {
        const { location, onSuccess, onError } = input;
        const index = getIndex();

        fetch(
            "https://raw.githubusercontent.com/syunkitada/appui/master/README.md",
            // "https://raw.githubusercontent.com/syunkitada/appui/master/docs/README.md",
            {
                method: "GET",
                mode: "cors"
            }
        )
            .then(res => {
                if (res.status !== 200) {
                    onError({ error: `UnexpectedStatus: ${res.status}` });
                }

                return res.text();
            })
            .then(payload => {
                logger.info("getServiceIndex.onSuccess", payload);
                const data = {
                    Text: payload
                };
                onSuccess({
                    data: data,
                    index: index
                });
            })
            .catch(error => {
                logger.error("getServiceIndex.onError", error);
            });
    }
};
export default index;
