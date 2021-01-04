import service from "../../apps/service";
import locationData from "../../data/locationData";
import Dashboard from "../core/Dashboard";

export function Render(input: any) {
    const { View, useRootModal, onSubmit } = input;
    let { id } = input;
    if (useRootModal) {
        id = Dashboard.RootModal.GetContentId();
    }
    const location = locationData.getLocationData();

    const keyPrefix = `${id}-BasicForm-`;
    const formId = `${keyPrefix}form`;
    const submitButtonId = `${keyPrefix}submitButton`;
    const fieldTextClass = `${keyPrefix}fieldText`;
    const inputClass = `${keyPrefix}input`;
    const fieldParams: any = {};

    const fields: any = [];
    for (let i = 0, len = View.Fields.length; i < len; i++) {
        const field = View.Fields[i];
        fieldParams[field.Name] = null;
        let autofocus = "";
        if (i === 0) {
            autofocus = "autofocus";
        }
        switch (field.Kind) {
            case "text":
                fields.push(`
                <div class="row">
                    <div class="input-field col s12">
                        <input type="text" id="field1" class="validate ${fieldTextClass}" data-field-idx="${i}" ${autofocus} />
                        <label for="field1">${field.Name}</label>
                        <span class="helper-text" data-error="wrong" data-success="right"></span>
                    </div>
                </div>
                `);
                break;
            default:
                fields.push(`UnknownField: ${field.Kind}`);
                break;
        }
    }

    function validateField(input: any) {
        const { elem } = input;
        const dataFieldIdx = elem.attr("data-field-idx");
        if (!dataFieldIdx) {
            return;
        }
        const field = View.Fields[parseInt(dataFieldIdx)];
        let val = elem.val();
        if (!val) {
            if (field.Default) {
                val = field.Default;
            } else {
                val = "";
            }
        }
        const len = val.length;
        let error = "";
        if (field.Min && len < field.Min) {
            error += `Please enter ${field.Min} or more charactors. `;
        }
        if (field.Max && len > field.Max) {
            error += `Please enter ${field.Max} or less charactors. `;
        }

        if (field.RegExp) {
            const re = new RegExp(field.RegExp);
            if (val.length > 0 && !re.test(val)) {
                if (field.RegExpMsg) {
                    error += field.RegExpMsg + " ";
                } else {
                    error += "Invalid characters. ";
                }
            }
        }

        elem.parent().find(".helper-text").attr("data-error", error);
        if (error !== "") {
            elem.removeClass("valid").addClass("invalid");
            fieldParams[field.Name] = null;
        } else {
            elem.removeClass("invalid").addClass("valid");
            fieldParams[field.Name] = elem.val();
        }
    }

    $(`#${id}`).html(`
        <h4>${View.Name}</h4>
        <form class="col s12" id="${formId}">
            ${fields.join("")}
            <div class="row">
                <div class="input-field col m2">
                </div>
            </div>
        </form>
    `);

    $(`.${fieldTextClass}`)
        .off("change")
        .on("change", function () {
            validateField({ elem: $(this) });
        })
        .off("keyup")
        .on("keyup", function () {
            validateField({ elem: $(this) });
        });

    function onSubmitInternal(e: any) {
        e.preventDefault();

        const inputs = $(`.${fieldTextClass}`);
        for (let i = 0, len = inputs.length; i < len; i++) {
            validateField({ elem: $(inputs[i]) });
        }

        let isValid = true;
        for (const [key, value] of Object.entries(fieldParams)) {
            if (!value) {
                isValid = false;
            }
        }
        if (!isValid) {
            return;
        }

        service.submitQueries({
            queries: [View.Action],
            location: location,
            params: fieldParams
        });
    }

    $(`#${formId}`).on("submit", onSubmitInternal);

    if (useRootModal) {
        Dashboard.RootModal.Init({ View, onSubmit: onSubmitInternal });
        Dashboard.RootModal.Open();
    }
}

const index = {
    Render
};
export default index;
