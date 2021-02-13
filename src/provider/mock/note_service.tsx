import utils from "./utils";

const localStorage = window.localStorage;

function getEditAction(action: any, dataKey: any) {
    return {
        Action: action,
        Fields: [
            {
                DefaultFunc: (data: any) => {
                    const values: string[] = [];
                    const texts = data[dataKey];
                    for (let i = 0, len = texts.length; i < len; i++) {
                        const text = texts[i];
                        values.push(text.t + "=" + text.m);
                    }
                    return values.join("\n");
                },
                Kind: "Texts",
                Max: 10000,
                Min: 5,
                Name: "Texts",
                Require: true
            }
        ],
        Icon: "Update",
        Kind: "Form",
        Name: "Edit Texts",
        SubmitButtonName: "Edit"
    };
}

function checkTextsAction(action: any, dataKey: any) {
    return {
        Action: action,
        DataKey: dataKey,
        Icon: "Check",
        Kind: "Form",
        Name: "Mark Texts",
        SelectKey: "t",
        SubmitButtonName: "Mark"
    };
}

function uncheckTextsAction(action: any, dataKey: any) {
    return {
        Action: action,
        DataKey: dataKey,
        Icon: "Uncheck",
        Kind: "Form",
        Name: "Unmark Texts",
        SelectKey: "t",
        SubmitButtonName: "Unmark"
    };
}

function deleteTextsAction(action: any, dataKey: any) {
    return {
        Action: action,
        DataKey: dataKey,
        Icon: "Delete",
        Kind: "Form",
        Name: "Delete Texts",
        SelectKey: "t",
        SubmitButtonName: "Delete"
    };
}

function getServiceIndex(input: any) {
    return getIndex();
}

function getIndex() {
    const textsColumns = [
        {
            Align: "left",
            IsSearch: true,
            Key: "t",
            MinWidth: 300,
            Name: "Text",
            Sortable: true
        },
        {
            Align: "left",
            FilterValues: [
                { Value: 1, Icon: "Check", Color: "DarkGray" },
                { Value: 0, Icon: "Uncheck", Color: "Gray" }
            ],
            Key: "c",
            Kind: "Hidden",
            Name: "Mark",
            Padding: "checkbox",
            Width: 1
        },
        {
            Align: "left",
            Key: "m",
            Kind: "HideText",
            Name: "Mean",
            Padding: "checkbox",
            Width: 1
        },
        {
            Key: "u",
            Kind: "Time",
            MinWidth: 210,
            Name: "UpdatedAt",
            Sortable: true
        }
    ];

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

    const createTextsAction = {
        Action: "CreateTexts",
        Fields: [
            {
                Default: "",
                Kind: "Texts",
                Max: 10000,
                Min: 5,
                Name: "Texts",
                Require: true
            }
        ],
        Icon: "Add",
        Kind: "Form",
        Name: "Add Texts",
        SubmitButtonName: "Add"
    };

    const setNoteAction = {
        Action: "SetNote",
        Fields: [],
        Icon: "Save",
        Kind: "Form",
        Name: "Save Note",
        SubmitButtonName: "Save"
    };

    const noteView = {
        Kind: "Tabs",
        Title: "Note: #{Params.Name}",
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
                                LinkPath: ["Notes", "Note", "New", "New"],
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
    getServiceIndex
};
export default index;
