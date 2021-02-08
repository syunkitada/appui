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
    const { onSuccess } = input;
    setTimeout(function () {
        const data = {
            Notes: [
                { Id: 1, Name: "test1" },
                { Id: 2, Name: "test2" },
                { Id: 3, Name: "test3" }
            ]
        };
        onSuccess({
            data: data,
            index: getIndex()
        });
    }, 1000);
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
        SubName: "Id",
        TabParam: "Kind",
        Children: [
            {
                // StudyingTab
                Actions: [
                    createTextsAction,
                    getEditAction("UpdateStudyingTexts", "StudyingTexts"),
                    setNoteAction
                ],
                Columns: textsColumns,
                DataQueries: ["GetNote"],
                DataKey: "StudyingTexts",
                DisablePaging: false,
                FixHeight: false,
                Kind: "Table",
                Name: "Studying",
                Route: "/Studying",
                RowsPerPage: 100,
                RowsPerPageOptions: [100, 200, 300],
                SelectActions: [
                    checkTextsAction("CheckStudyingTexts", "StudyingTexts"),
                    uncheckTextsAction("UncheckStudyingTexts", "StudyingTexts"),
                    {
                        Action: "MarkLearningTexts",
                        DataKey: "StudyingTexts",
                        Icon: "Bookmarks",
                        Kind: "Form",
                        Name: "Move To Learning Texts",
                        SelectKey: "t",
                        SubmitButtonName: "Move"
                    },
                    deleteTextsAction("DeleteStudyingTexts", "StudyingTexts")
                ]
            },
            {
                // LearningTab
                Actions: [
                    getEditAction("UpdateLearningTexts", "LearningTexts"),
                    setNoteAction
                ],
                Columns: textsColumns,
                DataQueries: ["GetNote"],
                DataKey: "LearningTexts",
                DisablePaging: false,
                Kind: "Table",
                Name: "Learning",
                Route: "/Learning",
                RowsPerPage: 100,
                RowsPerPageOptions: [100, 200, 300],
                SelectActions: [
                    checkTextsAction("CheckLearningTexts", "LearningTexts"),
                    uncheckTextsAction("UncheckLearningTexts", "LearningTexts"),
                    {
                        Action: "MarkStudyingTexts",
                        DataKey: "LearningTexts",
                        Icon: "BookmarkBorder",
                        Kind: "Form",
                        Name: "Restore To Studying Texts",
                        SelectKey: "t",
                        SubmitButtonName: "Restore"
                    },
                    {
                        Action: "MarkLearnedTexts",
                        DataKey: "LearningTexts",
                        Icon: "Bookmarks",
                        Kind: "Form",
                        Name: "Move To Learned Texts",
                        SelectKey: "t",
                        SubmitButtonName: "Move Next"
                    },
                    deleteTextsAction("DeleteLearningTexts", "LearningTexts")
                ]
            },
            {
                // LearnedTab
                Actions: [
                    getEditAction("UpdateLearnedTexts", "LearnedTexts"),
                    setNoteAction
                ],
                Columns: textsColumns,
                DataQueries: ["GetNote"],
                DataKey: "LearnedTexts",
                DisablePaging: false,
                Kind: "Table",
                Name: "Learned",
                Route: "/Learned",
                RowsPerPage: 100,
                RowsPerPageOptions: [100, 200, 300],
                SelectActions: [
                    checkTextsAction("CheckLearnedTexts", "LearnedTexts"),
                    uncheckTextsAction("UncheckLearnedTexts", "LearnedTexts"),
                    {
                        Action: "MarkLearningTextsFromLearnedTexts",
                        DataKey: "LearnedTexts",
                        Icon: "BookmarkBorder",
                        Kind: "Form",
                        Name: "Restore To Learning Texts",
                        SelectKey: "t",
                        SubmitButtonName: "Restore"
                    },
                    deleteTextsAction("DeleteLearnedTexts", "LearnedTexts")
                ]
            }
        ]
    };

    const view = {
        Name: "Root",
        Kind: "Panes",
        Children: [
            {
                Kind: "Pane",
                Name: "Notes",
                DataQueries: ["GetUser"],
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
                                LinkPath: ["Notes", "Note", "Studying"],
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

function getSettingsServiceIndex() {
    const view = {
        Name: "Root",
        Kind: "Panes",
        Children: [
            {
                Kind: "Pane",
                Name: "Settings",
                Views: [{ Kind: "Title", Title: "Settings" }]
            }
        ]
    };
    const index = {
        DefaultRoute: {
            Path: ["Settings"]
        },
        View: view
    };

    return index;
}

const index = {
    getServiceIndex
};
export default index;
