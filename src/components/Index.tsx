import Pane from "./pane/Pane";
import Panes from "./panes/Panes";
import Tabs from "./tabs/Tabs";
import Panels from "./panels/Panels";
import Table from "./table/Table";
import Box from "./box/Box";
import Notfound from "./core/Notfound";

function Render(input: any) {
    const { View } = input;
    console.log("IndexRender", input);
    switch (View.Kind) {
        case "Tabs":
            return Tabs.Render(input);
        case "Pane":
            return Pane.Render(input);
        case "Panes":
            return Panes.Render(input);
        case "Panels":
            return Panels.Render(input);
        case "Table":
            return Table.Render(input);
        case "View":
            return Box.Render(input);
        case "Box":
            return Box.Render(input);
        default:
            return Notfound.Render(input);
    }
}

const index = {
    Render
};
export default index;
