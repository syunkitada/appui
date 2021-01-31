type TSuccess = {
    msg: any;
};

function Success(input: TSuccess) {
    M.toast({
        html: input.msg,
        classes: "green lighten-1",
        displayLength: 10000
    });
}

type TError = {
    error: any;
};

function Error(input: TError) {
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
