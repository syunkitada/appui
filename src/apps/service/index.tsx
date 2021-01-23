import Dashboard from "../../components/core/Dashboard";
import auth from "../../apps/auth";
import provider from "../../provider";
import data from "../../data";
import locationData from "../../data/locationData";
import Index from "../../components/Index";
import logger from "../../lib/logger";

function init() {
    const { serviceName, projectName } = locationData.getServiceParams();

    let location = { Path: ["Root"] };
    const tmpLocationData = locationData.getLocationData();
    let initLocation = true;
    if (tmpLocationData.Path) {
        location = tmpLocationData;
        initLocation = false;
    }

    function getServiceIndexOnSuccess(input: any) {
        if (initLocation && input.Index.DefaultRoute.Path) {
            location.Path = input.Index.DefaultRoute.Path;
            locationData.setLocationData(location);
        }

        data.service = {
            data: input.Data,
            rootView: input.Index.View
        };

        Dashboard.NavPath.Render({
            location
        });

        Index.Render({
            id: "root-content",
            View: input.Index.View
        });

        Dashboard.RootContentProgress.StopProgress();
    }

    Dashboard.Render({
        id: "root",
        logout: auth.logout,
        onClickService: function (input: any) {
            const { serviceName, projectName } = input;
            initLocation = true;
            const location = { Path: ["Root"] };

            locationData.setServiceParams(input);

            Dashboard.RootContentProgress.StartProgress();
            provider.getServiceIndex({
                serviceName,
                projectName,
                location,
                onSuccess: getServiceIndexOnSuccess,
                onError: function (input: any) {
                    logger.error("service.init.onClickService.onError", input);
                }
            });
        }
    });

    Dashboard.RootContentProgress.StartProgress();
    provider.getServiceIndex({
        serviceName,
        projectName,
        location,
        onSuccess: getServiceIndexOnSuccess,
        onError: function (input: any) {
            logger.error("service.init.getServiceIndex.onError", input);
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

    location.DataQueries = nextView.DataQueries;
    if (view && view.View.ViewParams) {
        location.ViewParams = view.View.ViewParams;
    } else {
        location.ViewParams = {};
    }

    logger.info("service.getQueries", location, view);

    locationData.setLocationData(location);
    Dashboard.RootContentProgress.StartProgress();

    provider.getQueries({
        serviceName,
        projectName,
        location,
        onSuccess: function (input: any) {
            Dashboard.RootContentProgress.StopProgress();

            data.service.data = Object.assign(data.service.data, input.data);

            Dashboard.NavPath.Render({
                location
            });

            if (view) {
                Index.Render(view);
            } else {
                Index.Render({
                    id: "root-content",
                    View: data.service.rootView
                });
            }
            logger.info("getQueries.onSuccess", input);
        },
        onError: function (input: any) {
            logger.error("getQueries.onError", input);
        }
    });
}

function submitQueries(input: any) {
    const { queries, location, params, onSuccess } = input;
    const { serviceName, projectName } = locationData.getServiceParams();

    Dashboard.RootContentProgress.StartProgress();

    provider.submitQueries({
        serviceName,
        projectName,
        queries,
        location,
        params,
        onSuccess: function (_input: any) {
            logger.info("submitQueries.onInfo", input, _input);

            Dashboard.RootContentProgress.StopProgress();

            data.service.data = Object.assign(data.service.data, _input.data);
            onSuccess();
        },
        onError: function (_input: any) {
            logger.error("submitQueries.onError", input, _input);
        }
    });
}

const index = {
    init,
    getViewFromPath,
    getQueries,
    submitQueries
};
export default index;
