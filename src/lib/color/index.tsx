function getTextDarkenColorClass(color: any): string {
    switch (color) {
        case "Red":
            return "red-text text-darken-1";
        case "Orange":
            return "orange-text text-darken-1";
        case "Green":
            return "green-text text-darken-1";
        case "Gray":
            return "grey-text text-darken-1";
        case "DarkGray":
            return "grey-text text-darken-4";
    }
    return "";
}

const index = {
    getTextDarkenColorClass
};
export default index;
