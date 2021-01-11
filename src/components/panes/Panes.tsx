import locationData from "../../data/locationData";
import Index from "../../components/Index";

export function Render(input: any) {
    const { id, View } = input;
    const prefixKey = `${id}-`;
    console.log("DEBUG Panes.Render", View, input);

    const location = locationData.getLocationData();
    let indexPath;
    if (location.SubPath) {
        indexPath = location.SubPath[View.Name];
        console.log("DEBUG SubPath", indexPath);
    } else if (View.Name === "Root") {
        indexPath = location.Path[0];
        console.log("DEBUG Root", indexPath);
    } else {
        for (let i = 0, len = location.Path.length; i < len; i++) {
            if (View.Name === location.Path[i]) {
                indexPath = location.Path[i + 1];
                break;
            }
        }
        console.log("DEBUG location.Path", indexPath);
    }

    let locationParams: any = {};
    if (location.Params) {
        locationParams = location.Params;
    }

    for (let i = 0, len = View.Children.length; i < len; i++) {
        const pane = View.Children[i];
        let subName = "";
        if (pane.SubNameParamKeys != null && pane.SubNameParamKeys.length > 0) {
            for (
                let j = 0, lenj = pane.SubNameParamKeys.length;
                j < lenj;
                j++
            ) {
                const paramKey = pane.SubNameParamKeys[j];
                const paramData = locationParams[paramKey];
                if (paramData) {
                    if (j === 0) {
                        subName += ":";
                    }
                    subName += " " + paramKey + "=" + paramData;
                }
            }
        }

        if (pane.Name !== indexPath) {
            continue;
        }
        console.log("DEBUG pane", pane);

        $(`#${id}`).html(`
        <div class="pane">
          <h1>${pane.Name} ${subName}</h1>
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
