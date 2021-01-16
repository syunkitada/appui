import locationData from "../../data/locationData";
import Index from "../Index";

export function Render(input: any) {
    const { id, View } = input;
    const keyPrefix = `${id}-Pane-`;
    const location = locationData.getLocationData();
    if (View.Children) {
        if (location.Path[location.Path.length - 1] !== View.Name) {
            let nextViewName = "";
            for (let i = 0, len = location.Path.length; i < len; i++) {
                if (View.Name === location.Path[i]) {
                    nextViewName = location.Path[i + 1];
                    break;
                }
            }
            for (let i = 0, len = View.Children.length; i < len; i++) {
                const child = View.Children[i];
                if (child.Name === nextViewName) {
                    Index.Render(Object.assign({}, input, { View: child }));
                    break;
                }
            }
            return;
        }
    }

    const htmls = [];
    for (let i = 0, len = View.Views.length; i < len; i++) {
        htmls.push(`<div id="${keyPrefix}${i}"></div>`);
    }
    $(`#${id}`).html(htmls.join(""));

    for (let i = 0, len = View.Views.length; i < len; i++) {
        const view = View.Views[i];
        Index.Render(
            Object.assign({}, input, { id: `${keyPrefix}${i}`, View: view })
        );
    }
}

const index = {
    Render
};
export default index;
