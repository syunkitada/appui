import data from "../../data";

export function Render(input: any) {
    const { id, View } = input;
    const prefixKey = `${id}-`;

    let { textData } = input;
    if (!textData) {
        textData = data.service.data[View.DataKey];
    }

    $(`#${id}`).html(`
    <div class="row" style="padding: 0 5px">
      <div class="col s12">
      ${textData}
      </div>
    </div>
    `);
}

const index = {
    Render
};
export default index;
