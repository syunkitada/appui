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

    loginWithToken(input: any): void {
        const { onSuccess, onError } = input;

        const token = localStorage.getItem("token");
        if (token) {
            const auth = JSON.parse(token);
            data.auth = auth;
            const localData = utils.getLocalData({ isInit: true });
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
                    Home: {},
                    Note: {},
                    Graph: {}
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
        const { serviceName, location, onSuccess, onError } = input;

        let index: any;
        switch (serviceName) {
            case "Home":
                index = home_service.getServiceIndex(input);
                break;
            case "Note":
                index = note_service.getServiceIndex(input);
                break;
            case "Graph":
                index = note_service.getServiceIndex(input);
                break;
        }

        if (
            location &&
            location.DataQueries &&
            location.DataQueries.length > 0
        ) {
            this.getQueries({
                location,
                onSuccess: function (_input: any) {
                    const localData = utils.getLocalData({});
                    const data = {
                        Notes: localData.Notes
                    };
                    onSuccess({
                        data: Object.assign({}, data, _input.data),
                        index: index
                    });
                }
            });
        } else {
            const localData = utils.getLocalData({});
            const data = {
                Notes: localData.Notes
            };
            onSuccess({
                data: data,
                index: index
            });
        }
    }

    getQueries(input: any): void {
        const { onSuccess, onError } = input;
        const data = {};
        const newData: any = {};

        for (let i = 0, len = input.location.DataQueries.length; i < len; i++) {
            const query = input.location.DataQueries[i];
            switch (query) {
                case "GetNote": {
                    const id = input.location.Params.Id.toString();
                    const localData = utils.getLocalData({});
                    const note = localData.NoteMap[id];
                    console.log("TODO GetNote", note);
                    newData.Note = {
                        Actions: [{}],
                        Children: [
                            {
                                Name: "New",
                                Kind: "Tabs",
                                ViewDataKey: "NoteTexts",
                                Placement: "Right"
                            }
                        ]
                    };
                    newData.NoteTexts = {
                        Actions: [{}],
                        Children: [
                            {
                                Name: "New",
                                Kind: "Editor",
                                DataKey: "NoteText"
                            }
                        ]
                    };
                    newData.NoteText = `
# HOGE

test
                    `;
                    break;
                }
            }
        }

        onSuccess({ data: newData });
    }

    submitQueries(input: any): void {
        const { queries, location, params, onSuccess, onError } = input;
        const that = this;
        const newData: any = {};
        for (let i = 0, len = queries.length; i < len; i++) {
            const query = queries[i];
            switch (query) {
                case "CreateNote": {
                    const localData = utils.getLocalData({});
                    localData.Notes.push({
                        Id: Date.now(),
                        Name: params.Name
                    });
                    utils.setLocalData(localData);
                    newData.Notes = localData.Notes;
                    break;
                }
            }
        }

        onSuccess({ data: newData });
    }
}

const index = {
    Provider
};
export default index;
