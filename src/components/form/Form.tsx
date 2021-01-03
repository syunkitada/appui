import locationData from "../../data/locationData";

export function Render(input: any) {
    const { id, View, onSubmit } = input;

    const keyPrefix = `${id}-BasicForm-`;
    const formId = `${keyPrefix}form`;
    const submitButtonId = `${keyPrefix}submitButton`;

    const fields: any = [];
    for (let i = 0, len = View.Fields.length; i < len; i++) {
        const field = View.Fields[i];
        let autofocus = "";
        if (i === 0) {
            autofocus = "autofocus";
        }
        switch (field.Kind) {
            case "text":
                fields.push(`
                <div class="row">
                    <div class="input-field col s12">
                        <input id="first_name" type="text" class="validate" ${autofocus}>
                        <label for="first_name">First Name</label>
                    </div>
                </div>
                `);
                break;
            default:
                fields.push(`UnknownField: ${field.Kind}`);
                break;
        }
    }

    $(`#${id}`).html(`
        <form class="col s12" id="${formId}">
            ${fields.join("")}
            <div class="row">
                <div class="input-field col m2">
                </div>
            </div>
        </form>
    `);
}

const index = {
    Render
};
export default index;
