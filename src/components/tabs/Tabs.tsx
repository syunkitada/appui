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
    const tabClass = `${prefixKey}tab`;
    const tabNameClass = `${prefixKey}tabName`;
    const tabCloseClass = `${prefixKey}tabClose`;
    const tabContentId = `${prefixKey}tabContent`;

    const location = locationData.getLocationData();
    let pathIndex = 0;
    let indexPath = "";
    if (location.SubPath) {
        indexPath = location.SubPath[View.Name];
    } else if (View.Name === "Root") {
        indexPath = location.Path[0];
    } else {
        for (let i = 0, len = location.Path.length; i < len; i++) {
            const pathName = location.Path[i];
            if (pathName.indexOf("@") === 0) {
                const tabIndex = parseInt(pathName.slice(1, pathName.length));
                if (View._childIndex === tabIndex) {
                    indexPath = location.Path[i + 1];
                    pathIndex = i;
                    break;
                }
            } else if (View.Name === location.Path[i]) {
                indexPath = location.Path[i + 1];
                pathIndex = i;
                break;
            }
        }
    }

    if (View.ViewDataKey) {
        View = data.service.data[View.ViewDataKey];
    }

    let locationParams: any = {};
    if (location.Params) {
        locationParams = location.Params;
    }

    let dynamicIndexPath = 0;
    let isDynamicIndexPath = false;
    if (indexPath.indexOf("@") == 0) {
        isDynamicIndexPath = true;
        dynamicIndexPath = parseInt(indexPath.slice(1, indexPath.length));
    }

    const tabs = [];
    const tabContents = [];
    for (let i = 0, len = View.Children.length; i < len; i++) {
        const tab = View.Children[i];
        const tabId = `${id}-Tabs-${i}`;

        let activeClass = "";
        if (isDynamicIndexPath) {
            if (dynamicIndexPath === i) {
                activeClass = "active";
            }
        } else if (tab.Name === indexPath) {
            activeClass = "active";
        }

        tabs.push(`<div class="appui-tab ${tabClass} ${activeClass}" data-idx="${i}">
          <div>
            <a class="tab-name ${tabNameClass}">
              ${tab.Name}
            </a>
            <a class="tab-btn waves-effect waves-light ${tabCloseClass}"><i class="material-icons">close</i></a>
          </div>
        </div>`);
    }

    let title = "";
    if (View.Title) {
        title = `<h4>${converter.formatText(View.Title)}</h4>`;
    }

    const actions: any = [];
    if (View.Actions && View.Actions.length > 0) {
        for (let i = 0, len = View.Actions.length; i < len; i++) {
            const action = View.Actions[i];
            switch (action.Kind) {
                case "AddTab":
                    actions.push(`
                    <div class="appui-tab">
                      <div>
                        <a class="tab-btn waves-effect waves-light ${actionButtonClass}" data-action-idx="${i}">
                          <i class="material-icons">add</i>
                        </a>
                      </div>
                    </div>
                    `);
                    break;
            }
        }
    }

    $(`#${id}`).html(`
    <div class="row">
      ${title}
      <div class="col s12">
        <div id="${tabsId}" class="appui-tabs">
          ${tabs.join("")}
          ${actions.join("")}
        </div>
      </div>
      <div id="${tabContentId}" class="col s12"></div>
    </div>
    `);

    const tabHtmls = $(`.${tabClass}`);

    let targetPosition: any = null;
    let target: any = null;
    let targetIdx: any = null;
    let dummy: any = null;
    let mouseX: any = null;

    function onMousedown(that: any, e: any) {
        $("#root").off("mouseup").off("mousemove");
        target = $(that).parent().parent();
        const tmpIdx = target.attr("data-idx");
        console.log("DEBUG tmpIdx", tmpIdx);
        if (!tmpIdx) {
            return;
        }
        targetIdx = parseInt(tmpIdx);
        targetPosition = target.position();
        dummy = $(`<div class="appui-tab dragged">${target.html()}</div>`).css({
            position: "absolute",
            top: targetPosition.top,
            left: targetPosition.left
        });
        $(`#${tabsId}`).append(dummy);
        mouseX = e.clientX;
        target.width(dummy.width()).height(dummy.height()).html("<div></div>");

        $(`#root`)
            .on("mouseup", function () {
                if (target && dummy) {
                    target.css("position", "static");
                    target.html(dummy.html());
                    dummy.remove();
                    dummy = null;
                    initTabs();

                    // render tab content
                    $(`.${tabClass}`).removeClass("active");
                    target.addClass("active");
                    target = null;
                    const tabContent = View.Children[targetIdx];
                    tabContent._childIndex = targetIdx;
                    const newLocation = Object.assign({}, location);
                    if (isDynamicIndexPath) {
                        newLocation.Path[pathIndex + 1] = `@${targetIdx}`;
                        for (
                            let i = pathIndex + 2,
                                len = newLocation.Path.length;
                            i < len;
                            i++
                        ) {
                            const path = newLocation.Path[i];
                            if (indexPath.indexOf("@") == 0) {
                                newLocation.Path[i] = "@0";
                            }
                        }
                    } else {
                        newLocation.Path[pathIndex + 1] = tabContent.Name;
                    }
                    $(`#${tabContentId}`).html("");
                    if (View.TabParamKey) {
                        if (isDynamicIndexPath) {
                            location.Params[View.TabParamKey] = `@${targetIdx}`;
                        } else {
                            location.Params[View.TabParamKey] = tabContent.Name;
                        }
                    }
                    if (View.StaticParams) {
                        location.Params = Object.assign(
                            {},
                            location.Params,
                            View.StaticParams
                        );
                    }
                    service.getQueries({
                        location: newLocation,
                        view: { id: tabContentId, View: tabContent }
                    });
                }
            })
            .on("mousemove", function (e: any) {
                e.preventDefault();
                if (dummy && target) {
                    const tmpTargetPosition = target.position();
                    const dummyPosition = dummy.position();
                    const newDummyLeft =
                        dummyPosition.left - (mouseX - e.clientX);
                    const halfWidth = target.width() / 2;
                    if (newDummyLeft < tmpTargetPosition.left - halfWidth - 5) {
                        if (targetIdx != 0) {
                            // Switch left tab
                            const previousTab = $(tabHtmls[targetIdx - 1]);
                            const previousTabHtml = previousTab.html();
                            previousTab.html(target.html());
                            target.html(previousTabHtml).width("auto");
                            previousTab.width(dummy.width());
                            target = previousTab;
                            targetIdx = targetIdx - 1;

                            // TODO Switch by SP
                        }
                    } else if (
                        newDummyLeft >
                        tmpTargetPosition.left + halfWidth + 5
                    ) {
                        if (targetIdx + 1 < View.Children.length) {
                            // switch right tab
                            const nextTab = $(tabHtmls[targetIdx + 1]);
                            const nextTabHtml = nextTab.html();
                            nextTab.html(target.html());
                            target.html(nextTabHtml).width("auto");
                            nextTab.width(dummy.width());
                            target = nextTab;
                            targetIdx = targetIdx + 1;

                            // TODO Switch by SP
                        }
                    }

                    dummy.css({
                        top: targetPosition.top,
                        left: newDummyLeft
                    });
                    mouseX = e.clientX;
                }
            });
    }

    function initTabs() {
        $(`.${tabNameClass}`)
            .off("mousedown")
            .on("mousedown", function (e: any) {
                onMousedown(this, e);
            });

        // Close Tab
        $(`.${tabCloseClass}`)
            .off("click")
            .on("click", function (e: any) {
                e.preventDefault();
                const target = $(this).parent().parent();
                const tmpIdx = target.attr("data-idx");

                const params = {
                    Idx: tmpIdx
                };
                service.submitQueries({
                    queries: [View.TabCloseAction],
                    location: location,
                    params: params,
                    onSuccess: function () {
                        console.log("DEBUG  onSuccess");
                        const newLocation = Object.assign({}, location);
                        newLocation.Path[pathIndex + 1] = `@0`;
                        newLocation.Params[View.TabParamKey] = `@0`;
                        service.getQueries({ location: newLocation });
                    }
                });
            });
    }
    initTabs();

    $(`.${actionButtonClass}`).on("click", function () {
        const dataActionIdx = $(this).attr("data-action-idx");
        if (!dataActionIdx) {
            return;
        }
        const action = View.Actions[parseInt(dataActionIdx)];
        const params = {};

        service.submitQueries({
            queries: [action.Action],
            location: location,
            params: params,
            onSuccess: function () {
                const newLocation = Object.assign({}, location);
                newLocation.Path[pathIndex + 1] = `@${View.Children.length}`;
                newLocation.Params[
                    View.TabParamKey
                ] = `@${View.Children.length}`;
                service.getQueries({ location: newLocation });
            }
        });
    });

    for (let i = 0, len = View.Children.length; i < len; i++) {
        const tab = View.Children[i];

        if (isDynamicIndexPath) {
            if (dynamicIndexPath !== i) {
                continue;
            }
        } else if (tab.Name !== indexPath) {
            continue;
        }

        tab._childIndex = i;

        Index.Render({
            id: tabContentId,
            View: tab
        });
        break;
    }
}

const index = {
    Render
};
export default index;
