const regex = /[/ :=,]/gi;

function escapeKey(str: string): string {
    str = str.replaceAll(regex, "-");
    return str;
}

const index = {
    escapeKey
};
export default index;
