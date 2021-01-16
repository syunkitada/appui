import converter from "../../lib/converter";

export function Render(input: any) {
    const { id, View } = input;

    $(`#${id}`).html(`<h4>${converter.formatText(View.Title)}</h4>`);
}

const index = {
    Render
};
export default index;
