function Html(input: any): string {
	const { kind } = input;
	switch (kind) {
		case "Add":
			return `<i class="material-icons left">add_box</i>`;
		case "Check":
			return `<i class="material-icons left">check_circle</i>`;
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
		default:
			return `UnknownIcon`;
	}
	return "";
}

const index = {
	Html
};
export default index;