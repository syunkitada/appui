import "./Tabs.css";

import data from "../../data";
import service from "../../apps/service";
import locationData from "../../data/locationData";
import Index from "../../components/Index";
import converter from "../../lib/converter";

export function Render(input: any) {
    const { id } = input;
    const prefixKey = `${id}-`;
    let View = input.View;

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

    if (View.ViewDataKey) {
        View = data.service.data[View.ViewDataKey];
    }
    console.log("DEBUG View", View);

    let locationParams: any = {};
    if (location.Params) {
        locationParams = location.Params;
    }

    const tabs = [];
    const tabContents = [];
    for (let i = 0, len = View.Children.length; i < len; i++) {
        const tab = View.Children[i];
        const tabId = `${id}-Tabs-${i}`;

        let activeClass = "";
        if (tab.Name === indexPath) {
            activeClass = "active";
        }

        tabs.push(`
        <li class="tab col s3"><a class="${activeClass}" href="#${tabId}">${tab.Name}</a></li>
        `);
        tabContents.push(`
        <div id="${tabId}" class="col s12"></div>
        `);
    }

    let title = "";
    if (View.Title) {
        title = `<h4>${converter.formatText(View.Title)}</h4>`;
    }

    console.log("DEBUG Actions", View.Name, View.Actions);
    if (View.Actions && View.Actions.length > 0) {
        tabs.push(`
        <li class="tab-buttons">
        <a class="waves-effect waves-light btn-small">
        <i class="material-icons">add</i></a></li>
        `);
    }

    $(`#${id}`).html(`
    <div class="row" style="padding: 0 5px">
      ${title}
      <div class="col s12">
        <ul id="${prefixKey}tabs" class="tabs">
          ${tabs.join("")}
        </ul>
      </div>
      ${tabContents.join("")}
    </div>
    `);

    $(`#${prefixKey}tabs`).tabs({
        onShow: function (content: any) {
            const splitedId = content.id.split("-");
            const tab = View.Children[splitedId[splitedId.length - 1]];
            const newLocation = Object.assign({}, location);
            newLocation.Path[location.Path.length - 1] = tab.Name;
            service.getQueries({
                location: newLocation,
                view: { id: content.id, View: tab }
            });
        }
    });

    for (let i = 0, len = View.Children.length; i < len; i++) {
        const tab = View.Children[i];
        const tabId = `${id}-Tabs-${i}`;

        if (tab.Name !== indexPath) {
            continue;
        }

        Index.Render({
            id: tabId,
            View: tab
        });
        break;
    }
}

const index = {
    Render
};
export default index;
