import "./Table.css";

import data from "../../data";
import locationData from "../../data/locationData";
import service from "../../apps/service";
import Icon from "../icon/Icon";
import Form from "../form/Form";
import color from "../../lib/color";

export function Render(input: any) {
    const { id, View } = input;
    const location = locationData.getLocationData();

    let { tableData } = input;
    const keyPrefix = `${id}-Table-`;
    if (!tableData) {
        tableData = data.service.data[View.DataKey];
    }

    const toolBarId = `${keyPrefix}toolBar`;
    const pagenationId = `${keyPrefix}pagenation`;
    const pagenationRowsPerPageId = `${keyPrefix}pagenationRowsPerPage`;
    const pagenationPageClass = `${keyPrefix}pagenationPage`;
    const theadId = `${keyPrefix}thead`;
    const tbodyId = `${keyPrefix}tbody`;
    const searchInputId = `${keyPrefix}searchInput`;
    const actionButtonClass = `${keyPrefix}actionButton`;
    const selectActionButtonClass = `${keyPrefix}actionButton`;
    const actionButtonsId = `${keyPrefix}actionButtonsId`;
    const exButtonsId = `${keyPrefix}exButtonsId`;
    const filterButtonClass = `${keyPrefix}filterButton`;
    const tooltipClass = `${keyPrefix}tooltip`;
    const allCheckboxId = `${keyPrefix}allCheckbox`;
    const checkboxClass = `${keyPrefix}checkbox`;
    const filterMap: any = {};

    if (!tableData) {
        $(`#${id}`).html(`<div>NoData</div>`);
        return;
    }

    const tableDataLen = tableData.length;

    $(`#${id}`).html(`
    <div class="row table-wrapper">
      <div id="${toolBarId}">
      </div>

      <div class="row" style="overflow-x:auto; padding: 0 5px;">
        <table class="table" style="width:100%;">
          <thead><tr id="${theadId}"></tr></thead>
          <tbody id="${tbodyId}"></tbody>
        </table>
      </div>
    </div>
    `);

    const columns = View.Columns;
    const thHtmls: any = [];

    const searchColumns: any[] = [];
    let searchRegExp: any = null;

    const filterColumns: any[] = [];

    const rowsPerPageOptions = View.RowsPerPageOptions;
    let page = 1;
    let rowsPerPage = View.RowsPerPage;
    let filteredTableData = tableData;
    let fromIndex = 0;
    let toIndex = rowsPerPage;
    let tmpTableDataLen = 0;
    let tmpTableData: any = [];
    const selectedChecks: any[] = [];

    for (let i = 0, len = columns.length; i < len; i++) {
        const column = columns[i];

        if (column.IsSearch) {
            if (column.Key) {
                searchColumns.push(column.Key);
            } else {
                searchColumns.push(column.Name);
            }
        }

        let alignClass = "right-align";
        if (i === 0) {
            alignClass = "left-align";
        }
        if (column.Align) {
            alignClass = "left-align";
        }
        switch (column.Kind) {
            case "Time":
                thHtmls.push(`<th class="${alignClass}">${column.Name}</th>`);
                break;
            default:
                thHtmls.push(
                    `<th class="${alignClass} table-time">${column.Name}</th>`
                );
                break;
        }

        if (column.FilterValues) {
            const counterMap: any = {};
            for (let j = 0, lenj = column.FilterValues.length; j < lenj; j++) {
                const filterValue = column.FilterValues[j];
                filterValue._colorClass = color.getTextDarkenColorClass(
                    filterValue.Color
                );
                counterMap[filterValue.Value] = 0;
            }
            let key: any;
            if (column.Key) {
                key = column.Key;
            } else {
                key = column.Name;
            }
            filterColumns.push({
                counterMap,
                key: key,
                values: column.FilterValues,
                currentValue: null
            });
        }
    }

    function renderActionButtons() {
        const buttons: any = [];
        if (View.Actions) {
            for (let i = 0, len = View.Actions.length; i < len; i++) {
                const action = View.Actions[i];
                buttons.push(`
                  <a class="modal-trigger waves-effect waves-light btn-floating btn-small ${actionButtonClass}" data-action-idx="${i}" data-position="bottom" data-tooltip="${
                    action.Name
                }" href="#root-modal">${Icon.Html({ kind: action.Icon })}</a>
                `);
            }
        }
        $(`#${actionButtonsId}`).html(buttons);

        $(`.${actionButtonClass}`)
            .tooltip()
            .on("click", function () {
                const dataActionIdx = $(this).attr("data-action-idx");
                if (!dataActionIdx) {
                    return;
                }
                const action = View.Actions[parseInt(dataActionIdx)];
                Form.Render({
                    useRootModal: true,
                    View: action,
                    onSuccess: function () {
                        Render(input);
                        M.toast({ html: "Success" });
                    }
                });
            });
    }

    function renderSelectActionButtons() {
        const buttons: any = [];
        if (View.SelectActions) {
            for (let i = 0, len = View.SelectActions.length; i < len; i++) {
                const action = View.SelectActions[i];
                buttons.push(`
                  <a class="modal-trigger waves-effect waves-light btn-floating btn-small red lighten-2 ${selectActionButtonClass}" data-action-idx="${i}" data-position="bottom" data-tooltip="${
                    action.Name
                }" href="#root-modal">${Icon.Html({ kind: action.Icon })}</a>
                `);
            }
        }
        $(`#${actionButtonsId}`).html(buttons);

        $(`.${selectActionButtonClass}`)
            .tooltip()
            .on("click", function () {
                const selectedData: any[] = [];
                for (let i = 0, len = tmpTableData.length; i < len; i++) {
                    if (selectedChecks[tmpTableData[i]._idx]) {
                        selectedData.push(tmpTableData[i]);
                    }
                }

                const dataActionIdx = $(this).attr("data-action-idx");
                if (!dataActionIdx) {
                    return;
                }
                const action = View.SelectActions[parseInt(dataActionIdx)];
                Form.Render({
                    selectedData,
                    useRootModal: true,
                    View: action,
                    onSuccess: function () {
                        Render(input);
                        M.toast({ html: "Success" });
                    }
                });
            });
    }

    let isSelectActions = true;
    if (View.DisableToolbar) {
        isSelectActions = false;
    } else {
        if (filterColumns) {
            for (let i = 0; i < tableDataLen; i++) {
                tableData[i]._idx = i;
                selectedChecks.push(false);
                const rdata = tableData[i];
                for (let j = 0, lenj = filterColumns.length; j < lenj; j++) {
                    const filterColumn = filterColumns[j];
                    for (
                        let k = 0, lenk = filterColumn.values.length;
                        k < lenk;
                        k++
                    ) {
                        if (
                            rdata[filterColumn.key] ===
                            filterColumn.values[k].Value
                        ) {
                            filterColumns[j].counterMap[
                                filterColumn.values[k].Value
                            ] += 1;
                        }
                    }
                }
            }
        }

        $(`#${toolBarId}`).html(`
        <div class="row" style="margin-bottom: 3px;">
          <div class="col m2">
            <div class="input-field">
              <input id="${searchInputId}" placeholder="Search" type="text" autocomplete="off">
            </div>
          </div>
          <div class="col m4">
            <div class="input-field">
              <div id="${actionButtonsId}" class="table-action-buttons right"></div>
            </div>
          </div>
          <div id="${pagenationId}" class="col m6 table-pagenation-wrapper right"></div>
        </div>
        <div class="row" style="margin-bottom: 5px;">
          <div class="col m4">
            <div id="${exButtonsId}"></div>
          </div>
        </div>
        `);

        renderActionButtons();
    }

    if (isSelectActions) {
        thHtmls.unshift(
            `<th class="checkbox-wrapper"><label><input id="${allCheckboxId}" type="checkbox" /><span></span></label></th>`
        );
    }
    $(`#${theadId}`).html(thHtmls.join(""));

    $(`#${allCheckboxId}`)
        .off("change")
        .on("change", function () {
            const checked = $(this).prop("checked");
            $(`.${checkboxClass}`).prop("checked", checked);
            for (let i = 0, len = selectedChecks.length; i < len; i++) {
                selectedChecks[i] = checked;
            }
            if (checked) {
                renderSelectActionButtons();
            } else {
                renderActionButtons();
            }
        });

    function filterTableData() {
        tmpTableData = [];
        let isSkip = true;
        if (searchRegExp) {
            for (let i = 0; i < tableDataLen; i++) {
                const rdata = tableData[i];
                for (const c of searchColumns) {
                    if (searchRegExp.exec(rdata[c])) {
                        isSkip = false;
                        break;
                    }
                }
                if (isSkip) {
                    continue;
                }
                isSkip = true;

                tmpTableData.push(rdata);
            }
        } else {
            if (filterColumns) {
                for (let i = 0; i < tableDataLen; i++) {
                    const rdata = tableData[i];
                    isSkip = false;
                    for (
                        let j = 0, lenj = filterColumns.length;
                        j < lenj;
                        j++
                    ) {
                        const column = filterColumns[j];
                        if (!column.currentValue) {
                            continue;
                        }
                        if (
                            rdata[column.key].toString() !== column.currentValue
                        ) {
                            isSkip = true;
                            break;
                        }
                    }
                    if (isSkip) {
                        continue;
                    }
                    tmpTableData.push(rdata);
                }
            } else {
                tmpTableData = tableData;
            }
        }

        fromIndex = rowsPerPage * (page - 1);
        toIndex = rowsPerPage * page - 1;
        tmpTableDataLen = tmpTableData.length;
        if (toIndex >= tmpTableDataLen) {
            toIndex = tmpTableDataLen - 1;
        }

        const tmpFilteredTableData = [];
        for (let i = fromIndex; i <= toIndex; i++) {
            const rdata = tmpTableData[i];
            tmpFilteredTableData.push(rdata);
        }
        filteredTableData = tmpFilteredTableData;
    }

    function renderExButtons() {
        const exButtons: any[] = [];
        for (let i = 0, len = filterColumns.length; i < len; i++) {
            const column = filterColumns[i];
            for (let j = 0, lenj = column.values.length; j < lenj; j++) {
                const value = column.values[j];
                let filtered = "";
                if (
                    column.currentValue &&
                    column.currentValue === value.Value.toString()
                ) {
                    filtered = "filtered";
                }

                exButtons.push(`
                <a class="${filterButtonClass} waves-effect waves-light btn white ${
                    value._colorClass
                }" data-position="bottom" data-idx="${i}" data-val="${
                    value.Value
                }">
                ${Icon.Html({
                    kind: value.Icon
                })} ${column.counterMap[value.Value]} ${filtered}</span>
                </a>
                `);
            }
        }
        $(`#${exButtonsId}`).html(`${exButtons.join("")}`);

        $(`.${filterButtonClass}`)
            .off("click")
            .on("click", function () {
                const columnIndex = $(this).attr("data-idx");
                if (!columnIndex) {
                    return;
                }
                const columnValue = $(this).attr("data-val");
                if (!columnValue) {
                    return;
                }
                if (
                    filterColumns[parseInt(columnIndex)].currentValue ===
                    columnValue
                ) {
                    filterColumns[parseInt(columnIndex)].currentValue = null;
                } else {
                    filterColumns[
                        parseInt(columnIndex)
                    ].currentValue = columnValue;
                }
                render();
            });
    }

    function renderTbody() {
        const linkClass = `${keyPrefix}tableLink`;
        const bodyTrHtmls: any = [];

        for (let i = 0, len = filteredTableData.length; i < len; i++) {
            const rdata = filteredTableData[i];

            const tdHtmls: any = ["<tr>"];
            if (isSelectActions) {
                tdHtmls.push(
                    `<td class="checkbox-wrapper"><label><input class="${checkboxClass}" type="checkbox" data-idx="${rdata._idx}" /><span></span></label></td>`
                );
            }

            for (let j = 0, lenj = columns.length; j < lenj; j++) {
                const column = columns[j];
                let alignClass = "right-align";
                if (j === 0) {
                    alignClass = "left-align";
                }
                if (column.Align) {
                    alignClass = "left-align";
                }

                let columnData: any;
                if (column.Key) {
                    columnData = rdata[column.Key];
                } else {
                    columnData = rdata[column.Name];
                }
                if (column.FilterValues) {
                    let filterButton: any = null;
                    const currentValue = filterMap[column.Name];
                    let isShowCells = true;
                    if (currentValue !== undefined) {
                        isShowCells = false;
                    }
                    for (
                        let j = 0, lenj = column.FilterValues.length;
                        j < lenj;
                        j++
                    ) {
                        const filterValue = column.FilterValues[j];
                        if (filterValue.Value === columnData) {
                            if (
                                currentValue !== undefined &&
                                currentValue === filterValue.Value
                            ) {
                                isShowCells = true;
                            }

                            filterButton = `
                            <a class="${filterValue._colorClass}">${Icon.Html({
                                kind: filterValue.Icon
                            })}</a>`;
                        }
                    }
                    if (!isShowCells) {
                        continue;
                    }
                    tdHtmls.push(
                        `<td class="${alignClass}" id="${keyPrefix}${i}-${j}">${filterButton}</td>`
                    );
                } else {
                    let columnClass = "";
                    switch (column.Kind) {
                        case "Time":
                            columnClass = "table-time";
                            const time: any = new Date(columnData);
                            if (!isNaN(time.getTime())) {
                                columnData = time.toISOString();
                            } else {
                                columnData = time.toString();
                            }
                            break;
                        case "Hidden":
                            columnData = "";
                            break;
                        case "HideText":
                            columnData = `
                            <a class="${tooltipClass} tooltipped teal-text text-lighten-1" data-position="bottom" data-tooltip="${columnData}">${Icon.Html(
                                { kind: "Info" }
                            )}</a>
                            `;
                            break;
                    }
                    if (column.LinkPath) {
                        tdHtmls.push(`
                        <td class="link ${alignClass} ${columnClass} ${linkClass}" id="${keyPrefix}${i}-${j}">
                          ${columnData}
                        </td>`);
                    } else {
                        tdHtmls.push(
                            `<td class="${alignClass} ${columnClass}" id="${keyPrefix}${i}-${j}">${columnData}</td>`
                        );
                    }
                }
            }

            tdHtmls.push("</tr>");
            $.merge(bodyTrHtmls, tdHtmls);
        }

        $(`#${tbodyId}`).html(bodyTrHtmls.join(""));

        $(`.${checkboxClass}`)
            .off("change")
            .on("change", function () {
                const dataIdx = $(this).attr("data-idx");
                if (dataIdx) {
                    if (selectedChecks[parseInt(dataIdx)] === false) {
                        selectedChecks[parseInt(dataIdx)] = true;
                    } else {
                        selectedChecks[parseInt(dataIdx)] = false;
                    }
                    let selected = false;
                    for (let i = 0, len = selectedChecks.length; i < len; i++) {
                        if (selectedChecks[i]) {
                            selected = true;
                            break;
                        }
                    }
                    if (selected) {
                        renderSelectActionButtons();
                    } else {
                        renderActionButtons();
                    }
                }
            });

        $(`.${linkClass}`)
            .off("click")
            .on("click", function () {
                const id = $(this).attr("id");
                if (id) {
                    const splitedId = id.split("-");
                    const column = columns[splitedId[splitedId.length - 1]];
                    const rdata = tableData[splitedId[splitedId.length - 2]];
                    const params = Object.assign({}, location.Params);
                    if (column.LinkKeys) {
                        for (
                            let i = 0, len = column.LinkKeys.length;
                            i < len;
                            i++
                        ) {
                            params[column.LinkKeys[i]] =
                                rdata[column.LinkKeys[i]];
                        }
                    } else {
                        params[column.Name] = rdata[column.Name];
                    }
                    const newLocation = {
                        Path: column.LinkPath,
                        Params: params,
                        SearchQueries: {}
                    };
                    service.getQueries({ location: newLocation });
                }
            });
    }

    function renderPagenation() {
        const val = `${fromIndex + 1}-${toIndex + 1} of ${tmpTableDataLen}`;
        const rowsPerPageOptionsData: any = {};
        for (let i = 0, len = rowsPerPageOptions.length; i < len; i++) {
            const option = rowsPerPageOptions[i];
            rowsPerPageOptionsData[option] = null;
        }

        const pageHtmls = [];
        const pageLen = Math.floor(tmpTableDataLen / rowsPerPage) + 2;
        for (let i = 1; i < pageLen; i++) {
            let active = "";
            if (i === page) {
                active = "active";
            }
            pageHtmls.push(
                `<li class="waves-effect table-pagenation-page ${active}"><a class="${pagenationPageClass}" href="${i}">${i}</a></li>`
            );
        }

        let disabledLeft = "";
        if (page === 1) {
            disabledLeft = "disabled";
        }
        let disabledRight = "";
        const lastPage = pageLen - 1;
        if (page === lastPage) {
            disabledRight = "disabled";
        }

        $(`#${pagenationId}`).html(`
        <div class="col m12 right-align">
            <div style="display: inline-block;">
              <div class="input-field col s12 autocomplete-wrapper">
                <input type="text" id="select-page" class="autocomplete" autocomplete="off">
                <label for="select-page">${rowsPerPage}</label>
                <i class="material-icons">arrow_drop_down</i>
                <span class="hint">Rows per page</span>
              </div>
            </div>
            <div style="display: inline-block;">
                <div class="input-field col s12">
                    <input disabled value="${val}" id="disabled" type="text" class="validate">
                    <label class="active" for="disabled">Rows</label>
                </div>
            </div>
            <ul class="pagination right table-pagenation" style="display: inline-block;">
              <li class="waves-effect ${disabledLeft}"><a class="${pagenationPageClass}" href="first"><i class="material-icons">first_page</i></a></li>
              <li class="waves-effect ${disabledLeft}"><a class="${pagenationPageClass}" href="prev"><i class="material-icons">chevron_left</i></a></li>
              ${pageHtmls.join("")}
              <li class="waves-effect ${disabledRight}"><a class="${pagenationPageClass}" href="next"><i class="material-icons">chevron_right</i></a></li>
              <li class="waves-effect ${disabledRight}"><a class="${pagenationPageClass}" href="last"><i class="material-icons">last_page</i></a></li>
            </ul>
        </div>
        `);

        $(`#${pagenationRowsPerPageId}`).formSelect();
        $("#debugtexta").text("bbb");

        $(`#select-page`)
            .autocomplete({
                data: rowsPerPageOptionsData,
                minLength: 0
            })
            .on("change", function (e: any) {
                const val = $(this).val();
                if (typeof val === "string") {
                    rowsPerPage = parseInt(val);
                    render();
                }
            });

        $(`#${pagenationRowsPerPageId}`)
            .off("change")
            .on("change", function (e: any) {
                const val = $(this).val();
                $("#debugtexta").text("ccccc");
                if (typeof val === "string") {
                    console.log("DEBUG test1");
                    $("#debugtexta").text("testhoge");
                    rowsPerPage = parseInt(val);
                    render();
                } else {
                    console.log("DEBUG test2");
                }
            });

        $(`.${pagenationPageClass}`)
            .off("click")
            .on("click", function (e: any) {
                e.preventDefault();
                const href = $(this).attr("href");
                if (typeof href === "string") {
                    switch (href) {
                        case "first":
                            page = 1;
                            break;
                        case "prev":
                            if (page === 1) {
                                return;
                            }
                            page -= 1;
                            break;
                        case "next":
                            if (page === lastPage) {
                                return;
                            }
                            page += 1;
                            break;
                        case "last":
                            page = lastPage;
                            break;
                        default:
                            page = parseInt(href);
                            break;
                    }

                    render();
                }
            });
    }

    function render() {
        if (!View.DisableToolbar) {
            filterTableData();
        }
        renderTbody();
        renderExButtons();
        renderPagenation();
    }
    render();

    $(`#${searchInputId}`).on("keyup", function (e: any) {
        const val = $(this).val();
        if (typeof val === "string") {
            searchRegExp = new RegExp(val, "i");
            page = 1;
            render();
        }
    });

    $(`.${tooltipClass}`).tooltip();
}

const index = {
    Render
};
export default index;
