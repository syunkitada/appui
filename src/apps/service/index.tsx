import Dashboard from "../../components/core/Dashboard";
import auth from "../../apps/auth";
import provider from "../../provider";
import data from "../../data";
import locationData from "../../data/locationData";
import Index from "../../components/Index";

function init() {
    const { serviceName, projectName } = locationData.getServiceParams();

    let location = { Path: ["Root"] };
    const tmpLocationData = locationData.getLocationData();
    let initLocation = false;
    if (tmpLocationData.Path) {
        location = tmpLocationData;
        initLocation = true;
    }

    Dashboard.Render({
        id: "root",
        logout: auth.logout,
        onClickService: function (input: any) {
            const { serviceName, projectName } = input;
            const initLocation = false;
            const location = { Path: ["Root"] };

            locationData.setServiceParams(input);

            provider.get_service_index({
                serviceName,
                projectName,
                initLocation,
                location,
                onSuccess: function (input: any) {
                    if (input.Index.DefaultRoute.Path) {
                        location.Path = input.Index.DefaultRoute.Path;
                        locationData.setLocationData(location);
                    }

                    data.service = {
                        data: input.Data,
                        rootView: input.Index.View
                    };

                    Index.Render({
                        id: "root-content",
                        View: input.Index.View
                    });
                },
                onError: function (input: any) {
                    console.log("onError", input);
                }
            });
        }
    });

    provider.get_service_index({
        serviceName,
        projectName,
        initLocation,
        location,
        onSuccess: function (input: any) {
            if (!initLocation && input.Index.DefaultRoute.Path) {
                location.Path = input.Index.DefaultRoute.Path;
                locationData.setLocationData(location);
            }
            data.service = {
                data: input.Data,
                rootView: input.Index.View
            };

            Index.Render({
                id: "root-content",
                View: input.Index.View
            });
        },
        onError: function (input: any) {
            console.log("onError", input);
        }
    });
}

function getViewFromPath(View: any, path: any): any {
    if (View.Children) {
        for (let i = 0, len = View.Children.length; i < len; i++) {
            const child = View.Children[i];
            if (child.Name !== path[0]) {
                continue;
            }
            return getViewFromPath(child, path.slice(1));
        }
    }

    return View;
}

function getQueries(input: any) {
    const { location, view } = input;
    const { serviceName, projectName } = locationData.getServiceParams();
    const nextView = getViewFromPath(data.service.rootView, location.Path);
    // const subPathMap = location.SubPathMap
    // location.DataQueries = index.DataQueries
    // location.WebSocketQuery = index.WebSocketQuery
    // const params = Object.assign(
    // )
    location.DataQueries = nextView.DataQueries;
    if (view && view.View.ViewParams) {
        location.ViewParams = view.View.ViewParams;
    } else {
        location.ViewParams = {};
    }

    locationData.setLocationData(location);
    $("#root-content-progress").html('<div class="indeterminate"></div>');

    provider.get_queries({
        serviceName,
        projectName,
        location,
        onSuccess: function (input: any) {
            $("#root-content-progress").html(
                '<div class="determinate" style="width: 0%"></div>'
            );

            data.service.data = Object.assign(data.service.data, input.data);
            if (view) {
                console.log("DEBUG get_queries", view);
                Index.Render(view);
            } else {
                Index.Render({
                    id: "root-content",
                    View: data.service.rootView
                });
            }
            console.log("DEBUG getQueries onSuccess", input);
        },
        onError: function (input: any) {
            console.log("DEBUG getQueries onError", input);
        }
    });
}

const index = {
    init,
    getQueries
};
export default index;
