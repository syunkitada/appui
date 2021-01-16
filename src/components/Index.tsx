import Pane from "./pane/Pane";
import Panes from "./panes/Panes";
import Tabs from "./tabs/Tabs";
import Panels from "./panels/Panels";
import Table from "./table/Table";
import Title from "./core/Title";
import Box from "./box/Box";
import Notfound from "./core/Notfound";
import logger from "../lib/logger";

function Render(input: any) {
    const { View } = input;
    logger.info("Index.Render", input);

    switch (View.Kind) {
        case "Title":
            return Title.Render(input);
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
