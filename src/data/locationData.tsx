import provider from "../provider";
import logger from "../lib/logger";

const locationDataKey = "d";

const dataPathKey = "p";

function getSubPathKey(path: any) {
    if (path.length > 1) {
        return path.slice(0, path.length - 1).join(".");
    }
    return path[0];
}

function setServiceParams(params: any) {
    const { projectName, serviceName } = params;
    let pathname = "";
    if (projectName) {
        pathname = "/Project/" + projectName + "/" + serviceName + "/";
    } else {
        pathname = "/Service/" + serviceName + "/";
    }
    window.history.pushState(null, "", pathname);
}

function getServiceParams() {
    const splitedPath = window.location.pathname.split("/");
    if (splitedPath.length < 3) {
        return {
            serviceName: provider.getDefaultServiceName()
        };
    }

    switch (splitedPath[1]) {
        case "Service":
            return {
                serviceName: splitedPath[2]
            };
        case "Project":
            if (splitedPath.length < 4) {
                return {
                    projectName: splitedPath[2],
                    serviceName: provider.getDefaultProjectServiceName()
                };
            }
            return {
                projectName: splitedPath[2],
                serviceName: splitedPath[3]
            };
    }
    return {
        serviceName: provider.getDefaultServiceName()
    };
}

function getServiceState(state: any) {
    let service: any = null;
    let serviceState = state.service;
    if (serviceState.projectName) {
        service =
            serviceState.projectServiceMap[serviceState.projectName][
                serviceState.serviceName
            ];
    } else {
        service = serviceState.serviceMap[serviceState.serviceName];
    }
    return service;
}

function getDataFromState(state: any) {
    let service: any = null;
    let serviceState = state.service;
    if (serviceState.projectName) {
        service =
            serviceState.projectServiceMap[serviceState.projectName][
                serviceState.serviceName
            ];
    } else {
        service = serviceState.serviceMap[serviceState.serviceName];
    }
    return service.Data;
}

function getIndexDataFromState(state: any, index: any) {
    let service: any = null;
    let serviceState = state.service;
    if (serviceState.projectName) {
        service =
            serviceState.projectServiceMap[serviceState.projectName][
                serviceState.serviceName
            ];
    } else {
        service = serviceState.serviceMap[serviceState.serviceName];
    }
    return service.Data[index.DataKey];
}

function getLocationData() {
    return getLocationJson(locationDataKey);
}

function getLocationJson(key: string) {
    const searchParams = new URLSearchParams(window.location.search);
    let data: any = {};
    if (searchParams.has(key)) {
        const value = searchParams.get(key);
        try {
            data = JSON.parse(String(value));
        } catch {
            logger.warning("Ignored failed parse", value);
        }
    }

    return data;
}

function setLocationData(obj: any) {
    setLocationJson(locationDataKey, obj, true);
}

function setLocationJson(key: any, obj: any, isPush: any) {
    return new Promise(() => {
        const str = JSON.stringify(obj);
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set(key, str);
        const paramsStr = searchParams.toString();
        const link = window.location.pathname + "?" + paramsStr;
        if (isPush) {
            window.history.pushState(null, "", link);
        } else {
            window.history.replaceState(null, "", link);
        }
    });
}

function getIndex(index: any, path: any): any {
    if (index.Children) {
        for (let i = 0, len = index.Children.length; i < len; i++) {
            const child = index.Children[i];
            if (child.Name !== path[0]) {
                continue;
            }
            path = path.slice(1);
            return getIndex(child, path);
        }
    }

    return index;
}

function setFilterParamsSearch(text: any) {
    const data = getLocationData();
    if (data.FilterParams) {
        data.FilterParams.Search = text;
    } else {
        data.FilterParams = { Search: text };
    }
    setLocationData(data);
}

function getFilterParamsSearch() {
    const data = getLocationData();
    if (data.FilterParams && data.FilterParams.Search) {
        return data.FilterParams.Search;
    }
    return "";
}

function setSearchParams(obj: any) {
    const data = getLocationData();
    data.SearchParams = obj;
    setLocationData(data);
}

function getSearchParams(): any {
    const data = getLocationData();
    return data.SearchParams;
}

const index = {
    getDataFromState,
    getFilterParamsSearch,
    getIndex,
    getIndexDataFromState,
    getLocationData,
    getSearchParams,
    getServiceParams,
    getServiceState,
    getSubPathKey,
    dataPathKey,
    setFilterParamsSearch,
    setLocationData,
    setSearchParams,
    setServiceParams
};
export default index;
