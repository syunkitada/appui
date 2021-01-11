import data from "../../data";
import locationData from "../../data/locationData";
import service from "../../apps/service";
import Icon from "../icon/Icon";
import Form from "../form/Form";
import color from "../../lib/color";
import Index from "../Index";

export function Render(input: any) {
    const { id, View } = input;
    const location = locationData.getLocationData();
    console.log("DEBUG View", location.Path);
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

    Index.Render(Object.assign({}, input, { View: View.View }));
}

const index = {
    Render
};
export default index;
