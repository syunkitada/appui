import locationData from "../../data/locationData";

const regex = /[/ :=,]/g;
function escapeKey(str: string): string {
    const result = str.replace(regex, "-");
    return result;
}

function formatText(str: string): string {
    const splitedVar = str.split("#{");
    if (splitedVar.length === 1) {
        return str;
    }
    const location = locationData.getLocationData();
    const texts: string[] = [splitedVar[0]];
    for (let i = 1, len = splitedVar.length; i < len; i++) {
        const svar = splitedVar[i];
        const indexVarEnd = svar.indexOf("}");
        if (indexVarEnd === -1) {
            texts.push(svar);
            continue;
        }
        const key = svar.slice(0, indexVarEnd);
        const splitedKey = key.split(".");
        if (splitedKey.length !== 2) {
            texts.push(key);
        } else {
            switch (splitedKey[0]) {
                case "Params": {
                    texts.push(location.Params[splitedKey[1]]);
                    break;
                }
                default: {
                    texts.push(key);
                    break;
                }
            }
        }
        if (indexVarEnd + 1 === svar.length) {
            continue;
        }
        texts.push(svar.slice(indexVarEnd + 1, svar.length));
    }
    return texts.join("");
}

const index = {
    escapeKey,
    formatText
};
export default index;
