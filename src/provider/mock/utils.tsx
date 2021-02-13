function sleep(input: any) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(input.callback());
        }, input.ms);
    });
}

function getLocalData(input: any) {
    const dataStr = localStorage.getItem("data");
    if ((input && input.isInit) || !dataStr) {
        const data = {
            Notes: [
                { Id: 1, Name: "test1" },
                { Id: 2, Name: "test2" },
                { Id: 3, Name: "test3" }
            ],
            NoteMap: {}
        };
        return data;
    } else {
        const data = JSON.parse(dataStr);
        return data;
    }
}

function setLocalData(localData: any) {
    const newDataStr = JSON.stringify(localData);
    localStorage.setItem("data", newDataStr);
}

const index = {
    sleep,
    getLocalData,
    setLocalData
};

export default index;
