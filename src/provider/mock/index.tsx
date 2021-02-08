import data from "../../data";
import { IProvider } from "../IProvider";

import service_index from "./service_index";
import home_service from "./home_service";
import note_service from "./note_service";

const TextUnmarkedCheck = 0;
const TextMarkedCheck = 1;
const TextStatusStudying = 0;
const TextStatusLearning = 1;
const TextStatusLearned = 2;

class Provider implements IProvider {
    cacheNoteMap: any = {};

    constructor() {
        return;
    }

    updateCacheNote(input: any): void {
        const texts = [].concat(
            data.service.data.StudyingTexts,
            data.service.data.LearningTexts,
            data.service.data.LearnedTexts
        );
        this.cacheNoteMap[input.location.Params.Id.toString()] = { texts };
    }

    getInitData(input: any): any {
        return {
            DefaultServiceName: "Home",
            Logo: {
                Kind: "Text",
                Name: "Home"
            }
        };
    }

    loginWithToken(input: any): void {
        const { onSuccess, onError } = input;

        data.auth = {
            Authority: {
                Name: "hoge",
                ServiceMap: {
                    Home: {},
                    Note: {},
                    Graph: {}
                }
            }
        };
        onSuccess();
        return;
    }

    login(input: any): void {
        return;
    }

    logout(input: any): void {
        const { onSuccess } = input;
        onSuccess();
    }

    getServiceIndex(input: any): void {
        const { serviceName, location, onSuccess, onError } = input;

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
        const { onSuccess, onError } = input;
        const data = {};
        onSuccess({ data: data });
    }

    submitQueries(input: any): void {
        const { queries, location, params, onSuccess, onError } = input;
        const that = this;
        const data = {};
        onSuccess({ data: data });
    }
}

console.log("DEBUG hoge");

const index = {
    Provider
};
export default index;
