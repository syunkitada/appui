import utils from "./utils";

import components_text from "./components_text";

function getIndex() {
    const noteView = {
        Kind: "Tabs",
        Name: "Note",
        DataQueries: ["GetNote"],
        ViewDataKey: "Note"
    };

    const view = {
        Name: "Root",
        Kind: "Tabs",
        Children: [components_text.View]
    };

    const index = {
        DefaultRoute: {
            Path: ["Text", "Readme"]
        },
        View: view
    };

    return index;
}

const index = {
    getServiceIndex: function (input: any): void {
        const { location, onSuccess, onError } = input;
        const index = getIndex();

        const data = Object.assign({}, components_text.Data);
        onSuccess({
            index: index,
            data: data
        });
    }
};

export default index;
