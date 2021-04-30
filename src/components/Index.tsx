import Editor from "./editor/Editor";
import Pane from "./pane/Pane";
import Panes from "./panes/Panes";
import Tabs from "./tabs/Tabs";
import Panels from "./panels/Panels";
import Table from "./table/Table";
import Title from "./core/Title";
import Text from "./text/Text";
import Box from "./box/Box";
import Console from "./console/Console";
import Notfound from "./core/Notfound";
import Raw from "./raw/Raw";
import logger from "../lib/logger";

function Render(input: any) {
    const { View } = input;
    logger.info("Index.Render", input);

    switch (View.Kind) {
        case "Console":
            return Console.Render(input);
        case "Title":
            return Title.Render(input);
        case "Editor":
            return Editor.Render(input);
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
        case "Text":
            return Text.Render(input);
        case "View":
            return Box.Render(input);
        case "Box":
            return Box.Render(input);
        case "Raw":
            return Raw.Render(input);
        default:
            return Notfound.Render(input);
    }
}

const index = {
    Render
};
export default index;
