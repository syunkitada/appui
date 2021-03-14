import data from "../../data";
import utils from "./utils";
import { IProvider } from "../IProvider";

import service_index from "./service_index";
import home_service from "./home_service";
import note_service from "./note_service";

const localStorage = window.localStorage;

const TextUnmarkedCheck = 0;
const TextMarkedCheck = 1;
const TextStatusStudying = 0;
const TextStatusLearning = 1;
const TextStatusLearned = 2;

class Provider implements IProvider {
    constructor() {
        return;
    }

    getInitData(input: any): any {
        return {
            DefaultServiceName: "Home",
            Logo: {
                Kind: "Text",
                Name: "Home"
            },
            LoginView: {
                Name: "Login",
                Fields: [
                    {
                        Name: "User Name",
                        Key: "User",
                        Kind: "Text",
                        Required: true
                    }
                ]
            }
        };
    }

    init(input: any): void {
        const { onSuccess, onError } = input;

        const token = localStorage.getItem("token");
        if (token) {
            const auth = JSON.parse(token);
            data.auth = auth;
            const localData = utils.getLocalData({ isInit: false });
            utils.setLocalData(localData);
            onSuccess({});
        } else {
            onError({});
        }

        return;
    }

    login(input: any): void {
        const { onSuccess, params } = input;
        const auth = {
            Authority: {
                Name: params.User,
                ServiceMap: {
                    // Priorityが低いほうが優先度が高く、左メニューバーの一番上にくる
                    Home: { Priority: 0 },
                    Note: { Priority: 1 },
                    Graph: { Priority: 2 }
                }
            }
        };
        localStorage.setItem("token", JSON.stringify(auth));
        data.auth = auth;
        const localData = utils.getLocalData({ isInit: true });
        utils.setLocalData(localData);
        onSuccess();

        return;
    }

    logout(input: any): void {
        const { onSuccess } = input;
        utils.sleep({
            ms: 1000,
            callback: function () {
                localStorage.removeItem("token");
                onSuccess();
            }
        });
    }

    getServiceIndex(input: any): void {
        const { serviceName } = input;
        switch (serviceName) {
            case "Home":
                home_service.getServiceIndex(input);
                break;
            case "Note":
                note_service.getServiceIndex(input);
                break;
            case "Graph":
                note_service.getServiceIndex(input);
                break;
        }
    }

    getQueries(input: any): void {
        const { serviceName } = input;
        switch (serviceName) {
            case "Note":
                note_service.getQueries(input);
                break;
        }
    }

    submitQueries(input: any): void {
        const { serviceName } = input;
        switch (serviceName) {
            case "Note":
                note_service.submitQueries(input);
                break;
        }
    }
}

const index = {
    Provider
};
export default index;
