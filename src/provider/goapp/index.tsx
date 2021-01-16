import logger from "../../lib/logger";
import data from "../../data";
import { IProvider } from "../../provider/IProvider";

function query(input: any) {
    const { projectName, serviceName, queries, onSuccess, onError } = input;

    const body = JSON.stringify({
        Project: projectName,
        Queries: queries,
        Service: serviceName
    });
    logger.info("goapp.query", body);

    return fetch(process.env.REACT_APP_AUTHPROXY_URL + "/q", {
        body,
        credentials: "include",
        method: "POST",
        mode: "cors"
    })
        .then(res => {
            if (res.status !== 200) {
                console.log("Failed", res);
            }
            return res.json();
        })
        .then(payload => {
            console.log("DEBUG payload", payload);
            onSuccess(payload.ResultMap);
        })
        .catch(error => {
            console.log("DEBUG error", error);
            onError({ error });
        });
}

class Provider implements IProvider {
    getLoginView(input: any): any {
        return {};
    }

    loginWithToken(input: any): void {
        const serviceName = "Auth";
        const queries = [
            {
                Data: JSON.stringify({}),
                Name: "LoginWithToken"
            }
        ];

        query({
            queries,
            serviceName,
            onSuccess: function (_input: any) {
                const result = _input.LoginWithToken;
                if (result.Error && result.Error !== "") {
                    input.onError(result.Error);
                } else {
                    data.auth = result.Data;
                    input.onSuccess();
                }
            },
            onError: function (_input: any) {
                input.onError(_input);
            }
        });
    }

    login(input: any): void {
        const { userName, password } = input;

        const serviceName = "Auth";
        const queries = [
            {
                Data: JSON.stringify({ User: userName, Password: password }),
                Name: "Login"
            }
        ];

        query({
            queries,
            serviceName,
            onSuccess: function (_input: any) {
                const result = _input.Login;
                if (result.Error && result.Error !== "") {
                    input.onError(result.Error);
                } else {
                    data.auth = result.Data;
                    input.onSuccess();
                }
            },
            onError: function (_input: any) {
                input.onError(_input);
            }
        });
    }

    logout(input: any): void {
        const serviceName = "Auth";
        const queries = [
            {
                Data: JSON.stringify({}),
                Name: "Logout"
            }
        ];

        query({
            queries,
            serviceName,
            onSuccess: function (_input: any) {
                const result = _input.Logout;
                if (result.Error && result.Error !== "") {
                    input.onError(result.Error);
                } else {
                    input.onSuccess();
                }
            },
            onError: function (_input: any) {
                input.onError(_input);
            }
        });
    }

    getServiceIndex(input: any): void {
        const { serviceName, projectName, location, initLocation } = input;
        let queries: any = null;

        if (projectName) {
            queries = [
                {
                    Data: JSON.stringify({
                        Name: serviceName
                    }),
                    Name: "GetProjectServiceDashboardIndex"
                }
            ];
        } else {
            queries = [
                {
                    Data: JSON.stringify({
                        Name: serviceName
                    }),
                    Name: "GetServiceDashboardIndex"
                }
            ];
        }

        if (initLocation && location && location.DataQueries) {
            const tmpQueries: any[] = [];
            const tmpData = Object.assign(
                {},
                location.Params,
                location.ViewParams,
                location.SearchQueries
            );
            const data = JSON.stringify(tmpData);
            for (let i = 0, len = location.DataQueries.length; i < len; i++) {
                tmpQueries.push({
                    Data: data,
                    Name: location.DataQueries[i]
                });
            }
            queries = queries.concat(tmpQueries);
        }

        query({
            queries,
            serviceName,
            projectName,
            onSuccess: function (_input: any) {
                let index: any;
                const data: any = {};
                const errors: any = [];
                for (let i = 0, len = queries.length; i < len; i++) {
                    const query = queries[i];
                    const result = _input[query.Name];
                    if (result.Error && result.Error !== "") {
                        errors.push({ Error: result.Error });
                        continue;
                    }
                    if (result.Code >= 100) {
                        errors.push({
                            Error: `UnexpectedCode: ${result.Code}`
                        });
                        continue;
                    }
                    if (
                        query.Name === "GetProjectServiceDashboardIndex" ||
                        query.Name === "GetServiceDashboardIndex"
                    ) {
                        index = result.Data.Index;
                        Object.assign(data, result.Data.Data);
                    } else {
                        Object.assign(data, result.Data);
                    }
                }
                if (errors.length > 0) {
                    input.onError({
                        errors
                    });
                    return;
                }
                input.onSuccess({
                    Data: data,
                    Index: index
                });
            },
            onError: function (_input: any) {
                console.log("error", _input);
            }
        });
    }

    getQueries(input: any): void {
        const { serviceName, projectName, location } = input;

        const queryData = Object.assign(
            {},
            location.Params,
            location.ViewParams,
            location.SearchQueries
        );
        const data = JSON.stringify(queryData);

        const queries: any = [];
        for (let i = 0, len = location.DataQueries.length; i < len; i++) {
            queries.push({
                Data: data,
                Name: location.DataQueries[i]
            });
        }

        query({
            queries,
            serviceName,
            projectName,
            onSuccess: function (_input: any) {
                const data: any = {};
                const errors: any = [];
                for (let i = 0, len = queries.length; i < len; i++) {
                    const query = queries[i];
                    const result = _input[query.Name];
                    if (result.Error && result.Error !== "") {
                        errors.push({ Error: result.Error });
                        continue;
                    }
                    if (result.Code >= 100) {
                        errors.push({
                            Error: `UnexpectedCode: ${result.Code}`
                        });
                        continue;
                    }
                    Object.assign(data, result.Data);
                }
                if (errors.length > 0) {
                    input.onError({
                        errors
                    });
                    return;
                }
                input.onSuccess({
                    data
                });
            },
            onError: function (_input: any) {
                input.onError(_input);
            }
        });
    }

    submitQueries(input: any): void {
        console.log("DEBUG submit_queries");
    }
}

const index = {
    query,
    Provider
};
export default index;
