import "./Tabs.css";

import data from "../../data";
import service from "../../apps/service";
import locationData from "../../data/locationData";
import Index from "../../components/Index";
import converter from "../../lib/converter";

export function Render(input: any) {
    const { id } = input;
    const prefixKey = `${id}-Tabs-`;
    let View = input.View;
    const actionButtonClass = `${prefixKey}-actionButton`;
    const tabsId = `${prefixKey}tabs`;

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
        tabs.push(`
        <li class="tab col s3"><a class="" href="#">Dummy</a></li>
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
        const actions: any = [];
        for (let i = 0, len = View.Actions.length; i < len; i++) {
            actions.push(`
              <a class="waves-effect waves-light btn-small ${actionButtonClass}" data-action-idx="${i}">
                <i class="material-icons">add</i>
              </a>
            `);
        }
        tabs.push(`
        <li class="tab-buttons">
            ${actions}
        </li>
        `);
    }

    $(`#${id}`).html(`
    <div class="row" style="padding: 0 5px">
      ${title}
      <div class="col s12">
        <ul id="${tabsId}" class="tabs">
          ${tabs.join("")}
        </ul>
      </div>
      ${tabContents.join("")}
    </div>
    `);

    let target: any = null;
    let dummy: any = null;
    $(".tab").on("mousedown", function () {
        target = $(this);
        dummy = $(`<li class="tab col s3">${target.html()}</a></li>`);
        $(`#${tabsId}`).append(dummy);
        dummy.css({
            position: "absolute",
            "z-index": 50,
            border: "1px solid black"
        });
        console.log("DEBUG mousedown", $(this));
    });

    $("#root")
        .on("mouseup", function () {
            if (target) {
                target.css("position", "static");
                target = null;
            }
            // if (dummy) {
            //     dummy.remove();
            //     dummy = null;
            // }
            console.log("DEBUG mouseup", $(this));
        })
        .on("mousemove", function (e: any) {
            e.preventDefault();
            if (dummy && target) {
                const position = target.position();
                dummy.css({ top: position.top, left: e.clientX });
                console.log("DEBUG mousemove", e.clientX, e.clientY);
                console.log("target position", target.position());
            }
        });

    $(`.${actionButtonClass}`).on("click", function () {
        const dataActionIdx = $(this).attr("data-action-idx");
        if (!dataActionIdx) {
            return;
        }
        const action = View.Actions[parseInt(dataActionIdx)];
        console.log(action);
    });

    $(`#${tabsId}`).tabs({
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
