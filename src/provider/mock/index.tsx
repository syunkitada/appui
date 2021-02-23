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
        const { onSuccess, onError, location } = input;
        const data = {};
        const newData: any = {};

        for (let i = 0, len = location.DataQueries.length; i < len; i++) {
            const query = location.DataQueries[i];
            switch (query) {
                case "GetNote": {
                    const id = location.Params.Id.toString();
                    const localData = utils.getLocalData({});
                    let note = localData.NoteMap[id];
                    if (!note) {
                        note = {
                            Groups: [
                                {
                                    Name: "New",
                                    Texts: [
                                        {
                                            Name: "New",
                                            Text: "# New"
                                        }
                                    ]
                                }
                            ]
                        };
                    }

                    const groupName = location.Params["Group"]
                    const textName = location.Params["Text"]

                    const noteChildren = [];
                    const noteTexts = []
                    let noteText = ""
                    for (let i = 0, len = note.Groups.length; i < len; i++) {
                        const group = note.Groups[i]
                        noteChildren.push({
                            Name: group.Name,
                            Kind: "Tabs",
                            ViewDataKey: "NoteTexts",
                            Placement: "Right"
                        });
                        if (!groupName && i == 0 || group.Name === groupName) {
                            for (let j = 0, lenj = group.Texts.length; j < lenj; j++) {
                                const text = group.Texts[j]
                                noteTexts.push(
                            {
                                Name: text.Name,
                                Kind: "Editor",
                                DataKey: "NoteText"
                            }
                                )
                                if (text.Name === textName) {
                                    noteText = text.Text
                                }
                            }
                        }
                        note.Groups[i]
                    }
                    console.log("TODO GetNote", note);
                    newData.Note = {
                        Actions: [{ Kind: "AddTab" }],
                        TabParamKey: "Group",
                        Children: noteChildren
                    };

                    newData.NoteTexts = {
                        Actions: [{ Kind: "AddTab" }],
                        TabParamKey: "Text",
                        Children: noteTexts,
                    };

                    newData.NoteText = noteText
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
