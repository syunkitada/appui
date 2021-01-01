import data from "../../data";
import locationData from "../../data/locationData";
import Index from "../../components/Index";

export function Render(input: any) {
    const { id, View } = input;

    const tmpLocationData = locationData.getLocationData();

    const location = data.service.location;
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

    let locationParams: any = {};
    if (tmpLocationData.Params) {
        locationParams = tmpLocationData.Params;
    }

    const panelsHtmls: any[] = [];
    for (let i = 0, len = View.Children.length; i < len; i++) {
        const panel = View.Children[i];
        const panelId = `${id}-Panels-${i}`;
        let subName = "";
        if (
            panel.SubNameParamKeys != null &&
            panel.SubNameParamKeys.length > 0
        ) {
            for (
                let j = 0, lenj = panel.SubNameParamKeys.length;
                j < lenj;
                j++
            ) {
                const paramKey = panel.SubNameParamKeys[j];
                const paramData = locationParams[paramKey];
                if (paramData) {
                    if (j === 0) {
                        subName += ":";
                    }
                    subName += " " + paramKey + "=" + paramData;
                }
            }
        }

        let expanded = false;
        if (panel.Name === indexPath) {
            expanded = true;
        }

        panelsHtmls.push(`
<div class="card">
  <div class="card-header">
    <h2 class="mb-0">
      <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="${panelId}" aria-expanded="${expanded}">
        ${panel.Name} ${subName}
      </button>
    </h2>
  </div>

  <div id="${panelId}" class="collapse show" aria-labelledby="headingOne" data-parent="#${panelId}">
    <div class="card-body">
    </div>
  </div>
</div>
        `);
    }

    $(`#${id}`).html(`
                     <div>
${panelsHtmls.join("")}
    </div>
    `);

    for (let i = 0, len = View.Children.length; i < len; i++) {
        const panel = View.Children[i];
        const panelId = `${id}-Panels-${i}`;
        console.log("DEBUG panel", panel, panelId);

        Index.Render({
            id: panelId,
            View: panel
        });
    }
}

const index = {
    Render
};
export default index;
