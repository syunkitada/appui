import converter from "../../lib/converter";

export function Render(input: any) {
    const { id, View } = input;

    $(`#${id}`).html(`<h1>${converter.formatText(View.Title)}</h1>`);
}

const index = {
    Render
};
export default index;
