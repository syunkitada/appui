import data from "../../data";
import locationData from "../../data/locationData";
import service from "../../apps/service";

export function Render(input: any) {
    const { id, View } = input;
    let { tableData } = input;
    const keyPrefix = `${id}-Table-`;
    const location = locationData.getLocationData();
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

    const tableDataLen = tableData.length;

    $(`#${id}`).html(`
    <div class="row table-wrapper">
      <div id="${toolBarId}">
      </div>

      <div class="col s12" style="overflow: auto;">
        <table class="table">
          <thead><tr id="${theadId}"></tr></thead>
          <tbody id="${tbodyId}"></tbody>
        </table>
      </div>
    </div>
    `);

    let isSelectActions = true;
    if (View.DisableToolbar) {
        isSelectActions = false;
    } else {
        $(`#${toolBarId}`).html(`
          <div class="col s3">
            <div class="input-field">
              <input id="${searchInputId}" placeholder="Search" type="text">
            </div>
          </div>
          <div class="col s3">
          </div>
          <div id="${pagenationId}" class="col s6 pagenation-wrapper"></div>
        `);
    }

    const columns = View.Columns;
    const thHtmls: any = [];
    if (isSelectActions) {
        thHtmls.push(
            `<th class="checkbox-wrapper"><label><input type="checkbox" /><span></span></label></th>`
        );
    }

    const searchColumns: any[] = [];
    for (let i = 0, len = columns.length; i < len; i++) {
        const column = columns[i];

        if (column.IsSearch) {
            searchColumns.push(column.Name);
        }

        let alignClass = "right-align";
        if (i === 0) {
            alignClass = "left-align";
        }
        if (column.Align) {
            alignClass = "left-align";
        }
        thHtmls.push(`<th class="${alignClass}">${column.Name}</th>`);
    }
    $(`#${theadId}`).html(thHtmls.join(""));

    const rowsPerPageOptions = [10, 20, 30];
    let page = 1;
    let rowsPerPage = 10;
    let searchRegExp: any = null;
    let filteredTableData = tableData;
    let fromIndex = 0;
    let toIndex = rowsPerPage;
    let tmpTableDataLen = 0;

    function filterTableData() {
        let tmpTableData: any = [];
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
            tmpTableData = tableData;
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

    function renderTbody() {
        const linkClass = `${keyPrefix}tableLink`;
        const bodyTrHtmls: any = [];

        for (let i = 0, len = filteredTableData.length; i < len; i++) {
            const rdata = filteredTableData[i];

            const tdHtmls: any = ["<tr>"];
            if (isSelectActions) {
                tdHtmls.push(
                    `<td class="checkbox-wrapper"><label><input type="checkbox" /><span></span></label></td>`
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

                if (column.LinkPath) {
                    tdHtmls.push(
                        `<td class="link ${alignClass} ${linkClass}" id="${keyPrefix}${i}-${j}">
                ${rdata[column.Name]}
                </td>`
                    );
                } else {
                    tdHtmls.push(
                        `<td class="${alignClass}" id="${keyPrefix}${i}-${j}">${
                            rdata[column.Name]
                        }</td>`
                    );
                }
            }

            tdHtmls.push("</tr>");
            $.merge(bodyTrHtmls, tdHtmls);
        }

        $(`#${tbodyId}`).html(bodyTrHtmls.join(""));

        $(`.${linkClass}`)
            .off("click")
            .on("click", function () {
                const id = $(this).attr("id");
                if (id) {
                    const splitedId = id.split("-");
                    const column = columns[splitedId[splitedId.length - 1]];
                    const rdata = tableData[splitedId[splitedId.length - 2]];
                    const params = Object.assign({}, location.Params);
                    params[column.LinkKey] = rdata[column.Name];
                    const newLocation = {
                        Path: column.LinkPath,
                        Params: params,
                        SearchQueries: {}
                    };
                    service.getQueries({ View, location: newLocation });
                }
            });
    }

    function renderPagenation() {
        const rowsPerPageOptionsHtmls = [];
        for (let i = 0, len = rowsPerPageOptions.length; i < len; i++) {
            const option = rowsPerPageOptions[i];
            let selected = "";
            if (option === rowsPerPage) {
                selected = "selected";
            }
            rowsPerPageOptionsHtmls.push(
                `<option ${selected} value="${option}">${option}</option>`
            );
        }

        const pageHtmls = [];
        const pageLen = Math.floor(tmpTableDataLen / rowsPerPage) + 2;
        for (let i = 1; i < pageLen; i++) {
            let active = "";
            if (i === page) {
                active = "active";
            }
            pageHtmls.push(
                `<li class="waves-effect ${active}"><a class="${pagenationPageClass}" href="${i}">${i}</a></li>`
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
        <ul class="pagination right">
          <li>
            Rows per page:
            <div class="input-field inline">
             <select id="${pagenationRowsPerPageId}" class="browser-default">
                ${rowsPerPageOptionsHtmls.join("")}
             </select>
            </div>
            ${fromIndex + 1}-${toIndex + 1} of ${tmpTableDataLen}
          </li>
          <li class="waves-effect ${disabledLeft}"><a class="${pagenationPageClass}" href="first"><i class="material-icons">first_page</i></a></li>
          <li class="waves-effect ${disabledLeft}"><a class="${pagenationPageClass}" href="prev"><i class="material-icons">chevron_left</i></a></li>
          ${pageHtmls.join("")}
          <li class="waves-effect ${disabledRight}"><a class="${pagenationPageClass}" href="next"><i class="material-icons">chevron_right</i></a></li>
          <li class="waves-effect ${disabledRight}"><a class="${pagenationPageClass}" href="last"><i class="material-icons">last_page</i></a></li>
        </ul>
        `);

        $(`#${pagenationRowsPerPageId}`)
            .off("change")
            .on("change", function () {
                const val = $(this).val();
                if (typeof val === "string") {
                    rowsPerPage = parseInt(val);
                    render();
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
}

const index = {
    Render
};
export default index;
