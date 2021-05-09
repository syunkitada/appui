import locationData from "../../data/locationData";
import service from "../../apps/service";

import ErrorText from "../error_text/ErrorText";

export function Render(input: any) {
    const { id, View, onSubmit } = input;

    const location = locationData.getLocationData();

    const keyPrefix = `${id}-SearchForm-`;
    const inputClass = `${keyPrefix}input`;
    const selectClass = `${keyPrefix}select`;
    const datepickerClass = `${keyPrefix}datepicker`;
    const timepickerClass = `${keyPrefix}timepicker`;

    const inputs: any[] = [];
    if (!View.Fields) {
        ErrorText.Render({
            id: id,
            error: "SearchForm: InvaldView: Fields is not found"
        });
        return;
    }

    for (let i = 0, len = View.Fields.length; i < len; i++) {
        const fieldId = `${keyPrefix}field${i}`;
        const input = View.Fields[i];
        let searchQueryValue: any = null;
        if (location.SearchQueries) {
            searchQueryValue = location.SearchQueries[input.Name];
        }
        switch (input.Kind) {
            case "Select":
                let options = [];
                for (let i = 0, len = input.Data.length; i < len; i++) {
                    const option = input.Data[i];
                    options.push(
                        `<option value="${option}">${option}</option>`
                    );
                }
                let currentOption = input.Default;
                if (searchQueryValue) {
                    currentOption = searchQueryValue;
                }
                inputs.push(`
                <div class="input-field col m2">
                    <select class="${selectClass}" name="${input.Name}">
                        <option class="default-value" value="${currentOption}" disabled selected>${currentOption}</option>
                        ${options.join("")}
                    </select>
                    <label>${input.Name}</label>
                </div>
                `);
                break;
            case "Text":
                inputs.push(`
                <div class="input-field col m6">
                    <input id="${fieldId}" class="${inputClass}" type="text" class="validate" name="${input.Name}">
                        <label for="${fieldId}">${input.Name}</label>
                    </input>
                </div>
                `);
                break;
            case "DateTime":
                const now = new Date();
                let defaultDate = `${now.getFullYear()}-${
                    now.getMonth() + 1
                }-${now.getDate()}`;
                let defaultTime = "";

                if (searchQueryValue) {
                    const splitedDateTime = searchQueryValue.split("T");
                    if (splitedDateTime.length === 2) {
                        defaultDate = splitedDateTime[0];
                        defaultTime = splitedDateTime[1];
                    }
                }

                inputs.push(`
                <div class="input-field col m2">
                    <input class="${inputClass} ${datepickerClass}" type="text" placeholder="Date" name="${input.Name}" value="${defaultDate}" />
                </div>
                <div class="input-field col m2">
                    <input class="${timepickerClass}" type="text" placeholder="Time (default is now)" name="${input.Name}" value="${defaultTime}" />
                </div>
                `);
                break;
            default:
                inputs.push(`<span>UnknownInput: ${input.Kind}</span>`);
        }
    }

    const formId = `${keyPrefix}form`;
    const searchButtonId = `${keyPrefix}searchInput`;

    $(`#${id}`).html(`
        <form class="col s12" id="${formId}">
            <div class="row">${inputs.join("")}
                <div class="input-field col m2">
                <a class="waves-effect waves-light btn" id="${searchButtonId}"><i class="material-icons right">search</i>Search</a>
                </div>
            </div>
        </form>
    `);

    $(`.${selectClass}`).formSelect();

    $(`#${searchButtonId}`).on("click", function () {
        const inputs = $(`.${inputClass}`);
        const selects = $(`.${selectClass}`);

        const searchQueries: any = {};
        for (let i = 0, len = inputs.length; i < len; i++) {
            const input = $(inputs[i]);
            const name = input.attr("name");
            const val = input.val();
            if (name && val) {
                if (input.hasClass(datepickerClass)) {
                    const timepickers = $(`.${timepickerClass}`);
                    let timepickerVal: any = "";
                    for (let j = 0, lenj = timepickers.length; j < lenj; j++) {
                        const timepicker = $(timepickers[j]);
                        const timepickerName = timepicker.attr("name");
                        if (timepickerName) {
                            if (timepickerName === name) {
                                timepickerVal = timepicker.val();
                                if (!timepickerVal) {
                                    timepickerVal = "";
                                }
                                break;
                            }
                        }
                    }
                    searchQueries[name] = val + "T" + timepickerVal;
                } else {
                    searchQueries[name] = val;
                }
            }
        }
        for (let i = 0, len = selects.length; i < len; i++) {
            const select = $(selects[i]);
            const name = select.attr("name");
            let val = select.val();
            if (!val) {
                const defaultVal = select.find(".default-value");
                if (defaultVal.length > 0) {
                    val = $(defaultVal[0]).val();
                }
            }
            if (name && val) {
                searchQueries[name] = val;
            }
        }

        if (onSubmit) {
            onSubmit({ searchQueries });
        } else if (View.LinkPath) {
            const newLocation = {
                Path: View.LinkPath,
                Params: searchQueries,
                SearchQueries: {}
            };
            service.getQueries({ location: newLocation });
        }
    });

    $(`.${datepickerClass}`).datepicker({
        autoClose: true,
        format: "yyyy-mm-dd"
    });
    $(`.${timepickerClass}`).timepicker({
        autoClose: true,
        twelveHour: false,
        showClearBtn: true
    });
}

const index = {
    Render
};
export default index;
