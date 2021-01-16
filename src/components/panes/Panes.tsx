import locationData from "../../data/locationData";
import Index from "../../components/Index";

export function Render(input: any) {
    const { id, View } = input;
    const prefixKey = `${id}-`;

    const location = locationData.getLocationData();
    let indexPath;
    if (location.SubPath) {
        indexPath = location.SubPath[View.Name];
    } else if (View.Name === "Root") {
        indexPath = location.Path[0];
    } else {
        for (let i = 0, len = location.Path.length; i < len; i++) {
            if (View.Name === location.Path[i]) {
                indexPath = location.Path[i + 1];
                break;
            }
        }
    }

    for (let i = 0, len = View.Children.length; i < len; i++) {
        const pane = View.Children[i];
        if (pane.Name !== indexPath) {
            continue;
        }

        $(`#${id}`).html(`
        <div class="pane">
          <div id="${prefixKey}content" class="pane-content">
          </div>
        </div>
        `);

        Index.Render({
            id: `${prefixKey}content`,
            View: pane
        });
        break;
    }
}

const index = {
    Render
};
export default index;
