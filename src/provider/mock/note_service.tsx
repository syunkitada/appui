import utils from "./utils";

const localStorage = window.localStorage;

function getIndex() {
    const createNoteAction = {
        Action: "CreateNote",
        Fields: [
            {
                Kind: "Text",
                Max: 200,
                Min: 5,
                Name: "Name",
                RegExp: "^[0-9a-zA-Z]+$",
                RegExpMsg: "Please enter alphanumeric characters.",
                Require: true
            }
        ],
        Icon: "Create",
        Kind: "Form",
        Name: "Create Note",
        SubmitButtonName: "Create"
    };

    const noteView = {
        Kind: "Tabs",
        Name: "Note",
        DataQueries: ["GetNote"],
        ViewDataKey: "Note"
    };

    const view = {
        Name: "Root",
        Kind: "Panes",
        Children: [
            {
                Kind: "Pane",
                Name: "Notes",
                Views: [
                    { Kind: "Title", Title: "Notes" },
                    {
                        Actions: [createNoteAction],
                        Columns: [
                            {
                                Align: "left",
                                BaseUrl: "/Home",
                                IsSearch: true,
                                Key: "Name",
                                LinkPath: ["Notes", "Note", "@0", "@0"],
                                LinkKeyMap: {
                                    Id: "Id",
                                    Name: "Name"
                                },
                                Name: "Name",
                                Sortable: true
                            }
                        ],
                        DataKey: "Notes",
                        FixHeight: true,
                        Kind: "Table",
                        RowsPerPage: 10,
                        RowsPerPageOptions: [10, 20, 30],
                        SelectActions: [
                            {
                                Action: "DeleteNotes",
                                DataKey: "Notes",
                                Icon: "Delete",
                                Kind: "Form",
                                Name: "Delete Notes",
                                SelectKey: "Name",
                                SubmitButtonName: "Delete"
                            }
                        ]
                    }
                ],
                Children: [noteView]
            }
        ]
    };

    const index = {
        DefaultRoute: {
            Path: ["Notes"]
        },
        View: view
    };

    return index;
}

const index = {
    getServiceIndex: function (input: any): void {
        const { location, onSuccess, onError } = input;
        const index = getIndex();

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
    },

    getQueries: function (input: any): void {
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
                        localData.NoteMap[id] = note;
                        utils.setLocalData(localData);
                    }

                    const groupName = location.Params["Group"];
                    let groupIndex = -1;
                    if (groupName && groupName.indexOf("@") === 0) {
                        groupIndex = parseInt(
                            groupName.slice(1, groupName.length)
                        );
                    }
                    const textName = location.Params["Text"];
                    let textIndex = -1;
                    if (textName && textName.indexOf("@") === 0) {
                        textIndex = parseInt(
                            textName.slice(1, textName.length)
                        );
                    }

                    const noteChildren = [];
                    const noteTexts = [];
                    let noteText = "";
                    for (let i = 0, len = note.Groups.length; i < len; i++) {
                        const group = note.Groups[i];
                        noteChildren.push({
                            Name: group.Name,
                            Kind: "Tabs",
                            ViewDataKey: "NoteTexts",
                            Placement: "Right"
                        });
                        if (
                            (groupIndex !== -1 && i === groupIndex) ||
                            (!groupName && i == 0) ||
                            group.Name === groupName
                        ) {
                            for (
                                let j = 0, lenj = group.Texts.length;
                                j < lenj;
                                j++
                            ) {
                                const text = group.Texts[j];
                                noteTexts.push({
                                    Name: text.Name,
                                    Kind: "Editor",
                                    DataKey: "NoteText",
                                    OnChange: function (val: any) {
                                        text.Text = val;
                                        utils.setLocalData(localData);
                                    }
                                });
                                if (
                                    (textIndex !== -1 && j == textIndex) ||
                                    (!textName && j == 0) ||
                                    text.Name === textName
                                ) {
                                    noteText = text.Text;
                                }
                            }
                        }
                        note.Groups[i];
                    }

                    newData.Note = {
                        Title: "Note: #{Params.Name}",
                        Actions: [{ Kind: "AddTab", Action: "AddNoteGroup" }],
                        TabParamKey: "Group",
                        TabCloseAction: "RemoveNoteGroup",
                        TabSwitchAction: "SwitchNoteGroup",
                        TabRenameAction: "RenameNoteGroup",
                        StaticParams: {
                            Text: "@0"
                        },
                        Children: noteChildren
                    };

                    newData.NoteTexts = {
                        Actions: [{ Kind: "AddTab", Action: "AddNoteText" }],
                        TabParamKey: "Text",
                        TabCloseAction: "RemoveNoteText",
                        TabSwitchAction: "SwitchNoteText",
                        TabRenameAction: "RenameNoteText",
                        Children: noteTexts
                    };

                    newData.NoteText = noteText;
                    break;
                }
            }
        }

        onSuccess({ data: newData });
    },
    submitQueries: function (input: any): void {
        const { queries, location, params, onSuccess, onError } = input;
        const that = this;
        const newData: any = {};
        const groupName = location.Params["Group"];
        const textName = location.Params["Text"];
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
                case "AddNoteGroup": {
                    const localData = utils.getLocalData({});
                    const id = location.Params.Id.toString();
                    let note = localData.NoteMap[id];

                    note.Groups.push({
                        Name: "New",
                        Texts: [
                            {
                                Name: "New",
                                Text: "# New"
                            }
                        ]
                    });

                    utils.setLocalData(localData);
                    const tmpLocalData = utils.getLocalData({});

                    break;
                }
                case "RemoveNoteGroup": {
                    const localData = utils.getLocalData({});
                    const id = location.Params.Id.toString();
                    let note = localData.NoteMap[id];

                    note.Groups.splice(params.Idx, 1);

                    utils.setLocalData(localData);
                    const tmpLocalData = utils.getLocalData({});

                    break;
                }
                case "AddNoteText": {
                    const localData = utils.getLocalData({});
                    const id = location.Params.Id.toString();
                    let note = localData.NoteMap[id];

                    const groupName = location.Params["Group"];
                    let groupIndex = -1;
                    if (groupName && groupName.indexOf("@") === 0) {
                        groupIndex = parseInt(
                            groupName.slice(1, groupName.length)
                        );
                    }

                    for (let i = 0, len = note.Groups.length; i < len; i++) {
                        const group = note.Groups[i];
                        if (
                            (groupIndex !== -1 && i === groupIndex) ||
                            (!groupName && i == 0) ||
                            group.Name === groupName
                        ) {
                            group.Texts.push({
                                Name: "New",
                                Text: "# New"
                            });
                        }
                    }

                    utils.setLocalData(localData);
                    const tmpLocalData = utils.getLocalData({});

                    break;
                }
                case "RemoveNoteText": {
                    const localData = utils.getLocalData({});
                    const id = location.Params.Id.toString();
                    let note = localData.NoteMap[id];

                    const groupName = location.Params.Group;
                    let groupIndex = -1;
                    if (groupName && groupName.indexOf("@") === 0) {
                        groupIndex = parseInt(
                            groupName.slice(1, groupName.length)
                        );
                    }

                    for (let i = 0, len = note.Groups.length; i < len; i++) {
                        const group = note.Groups[i];
                        if (
                            (groupIndex !== -1 && i === groupIndex) ||
                            (!groupName && i == 0) ||
                            group.Name === groupName
                        ) {
                            group.Texts.splice(params.Idx, 1);
                        }
                    }

                    utils.setLocalData(localData);
                    const tmpLocalData = utils.getLocalData({});

                    break;
                }
                case "SwitchNoteGroup": {
                    const localData = utils.getLocalData({});
                    const id = location.Params.Id.toString();
                    let note = localData.NoteMap[id];

                    const targetGroup = note.Groups[params.TargetIdx];
                    note.Groups[params.TargetIdx] = note.Groups[params.SrcIdx];
                    note.Groups[params.SrcIdx] = targetGroup;

                    utils.setLocalData(localData);
                    const tmpLocalData = utils.getLocalData({});

                    break;
                }
                case "SwitchNoteText": {
                    const localData = utils.getLocalData({});
                    const id = location.Params.Id.toString();
                    let note = localData.NoteMap[id];

                    const groupName = location.Params.Group;
                    let groupIndex = -1;
                    if (groupName && groupName.indexOf("@") === 0) {
                        groupIndex = parseInt(
                            groupName.slice(1, groupName.length)
                        );
                    }

                    for (let i = 0, len = note.Groups.length; i < len; i++) {
                        const group = note.Groups[i];
                        if (
                            (groupIndex !== -1 && i === groupIndex) ||
                            (!groupName && i == 0) ||
                            group.Name === groupName
                        ) {
                            const targetText = group.Texts[params.TargetIdx];
                            group.Texts[params.TargetIdx] =
                                group.Texts[params.SrcIdx];
                            group.Texts[params.SrcIdx] = targetText;
                            break;
                        }
                    }

                    utils.setLocalData(localData);
                    const tmpLocalData = utils.getLocalData({});

                    break;
                }
                case "RenameNoteGroup": {
                    const localData = utils.getLocalData({});
                    const id = location.Params.Id.toString();
                    let note = localData.NoteMap[id];
                    note.Groups[params.Idx].Name = params.Name;
                    utils.setLocalData(localData);
                    const tmpLocalData = utils.getLocalData({});
                    break;
                }
                case "RenameNoteText": {
                    const localData = utils.getLocalData({});
                    const id = location.Params.Id.toString();
                    let note = localData.NoteMap[id];

                    const groupName = location.Params.Group;
                    let groupIndex = -1;
                    if (groupName && groupName.indexOf("@") === 0) {
                        groupIndex = parseInt(
                            groupName.slice(1, groupName.length)
                        );
                    }

                    for (let i = 0, len = note.Groups.length; i < len; i++) {
                        const group = note.Groups[i];
                        if (
                            (groupIndex !== -1 && i === groupIndex) ||
                            (!groupName && i == 0) ||
                            group.Name === groupName
                        ) {
                            group.Texts[params.Idx].Name = params.Name;
                            break;
                        }
                    }

                    utils.setLocalData(localData);
                    const tmpLocalData = utils.getLocalData({});
                    break;
                }
            }
        }

        onSuccess({ data: newData });
    }
};

export default index;
