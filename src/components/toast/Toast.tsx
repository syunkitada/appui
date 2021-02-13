function Success(input: any) {
    if (!input || !input.msg) {
        return;
    }
    M.toast({
        html: input.msg,
        classes: "green lighten-1",
        displayLength: 10000
    });
}

function Error(input: any) {
    if (!input || !input.error) {
        return;
    }
    M.toast({
        html: input.error,
        classes: "red lighten-1",
        displayLength: 10000
    });
}

const index = {
    Success,
    Error
};
export default index;
