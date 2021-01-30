function Html(input: any): string {
    const { kind } = input;
    switch (kind) {
        case "Add":
            return `<i class="material-icons left">add_box</i>`;
        case "Bookmarks":
            return `<i class="material-icons left">bookmarks</i>`;
        case "BookmarkBorder":
            return `<i class="material-icons left">bookmark_border</i>`;
        case "Check":
            return `<i class="material-icons left">check_circle</i>`;
        case "Critical":
            return `<i class="material-icons left">highlight_off</i>`;
        case "Uncheck":
            return `<i class="material-icons left">check_circle_outline</i>`;
        case "Create":
            return `<i class="material-icons left">add_box</i>`;
        case "Delete":
            return `<i class="material-icons left">delete</i>`;
        case "Detail":
            return `<i class="material-icons left">details</i>`;
        case "Info":
            return `<i class="material-icons left">info</i>`;
        case "Update":
            return `<i class="material-icons left">edit</i>`;
        case "Save":
            return `<i class="material-icons left">save</i>`;
        case "Success":
            return `<i class="material-icons left">check_circle_outline</i>`;
        case "Warning":
            return `<i class="material-icons left">info_outline</i>`;
        case "Unknown":
            return `<i class="material-icons left">help_outline</i>`;
        default:
            return `<span>Unknown: ${kind}</span>`;
    }
}

const index = {
    Html
};
export default index;
