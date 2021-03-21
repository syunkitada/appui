import "./Autocomplete.css";
import "./Dashboard.css";

import provider from "../../provider";
import service from "../../apps/service";
import data from "../../data";
import locationData from "../../data/locationData";

function renderServices(input: any) {
    const { id, keyPrefix, serviceName, projectName, onClickService } = input;
    const { ServiceMap, ProjectServiceMap } = data.auth.Authority;

    let tmpServiceMap: any = null;
    let projectText: string;
    if (projectName) {
        projectText = projectName;
        tmpServiceMap = ProjectServiceMap[projectName].ServiceMap;
    } else {
        projectText = "Projects";
        tmpServiceMap = ServiceMap;
    }

    const inputProjectId = `${keyPrefix}inputProject`;
    const servicesHtmls = [];
    const tmpProjectMap: any = {};
    if (ProjectServiceMap) {
        const tmpProjects = Object.keys(ProjectServiceMap);
        tmpProjects.sort();

        for (const tmpProject of tmpProjects) {
            tmpProjectMap[tmpProject] = null;
        }

        const projectHtml = `
        <li class="list-group-item list-group-item-action dashboard-sidebar-item">
          <div class="input-field col s12 autocomplete-wrapper">
            <input type="text" id="${inputProjectId}" class="autocomplete">
            <label for="${inputProjectId}">${projectText}</label>
            <i class="material-icons">input</i>
            <span class="hint">Select Project</span>
          </div>
        </li>
        `;

        servicesHtmls.push(projectHtml);
    }

    const tmpServices = [];
    for (const key in tmpServiceMap) {
        const service = tmpServiceMap[key];
        service.Name = key;
        tmpServices.push(service);
    }
    tmpServices.sort(function (a: any, b: any) {
        return a.Priority - b.Priority;
    });

    for (const service of tmpServices) {
        let className = "";
        if (service.Name === serviceName) {
            className = "dashboard-sidebar-item-active";
        }
        servicesHtmls.push(`
        <li class="dashboard-sidebar-item">
          <a class="${keyPrefix}-Service ${className}" href="#">${service.Name}</a>
        </li>
        `);
    }

    $(`#${id}`).html(servicesHtmls.join(""));

    $(`#${inputProjectId}`)
        .autocomplete({
            data: tmpProjectMap,
            minLength: 0
        })
        .on("change", function (e: any) {
            const projectName = $(this).val();
            if (projectName) {
                const serviceName = provider.getDefaultProjectServiceName();
                onClickService({ projectName, serviceName });

                renderServices(
                    Object.assign({}, input, { projectName, serviceName })
                );
            }
        });

    $(`.${keyPrefix}-Service`).on("click", function (e) {
        $("#dashboard-sidebar-wrapper").removeClass("toggled");
        const serviceName = $(this).text();
        onClickService({ projectName, serviceName });

        renderServices(Object.assign({}, input, { projectName, serviceName }));
    });
}

function Render(input: any) {
    const { id, onClickService } = input;
    const { Name } = data.auth.Authority;

    const { serviceName, projectName } = locationData.getServiceParams();

    const keyPrefix = `${input.id}-Dashboard-`;
    const servicesId = `${keyPrefix}Services`;

    const view = provider.getDashboardView({});

    const logo = view.Logo;
    let logoHtml = "";
    switch (logo.Kind) {
        case "Text":
            logoHtml = logo.Name;
            break;
        default:
            logoHtml = "Unknown";
            break;
    }

    const headerNavs: any = [];
    if (view.Logout) {
        headerNavs.push(
            `<li><a href="#!" id="dashboard-logout">Log out</a></li>`
        );
    }

    const rightNavs: any = [];
    if (view.SearchForm) {
        rightNavs.push(`
        <li id="dashboard-search-form">
          <i id="dashboard-search-input-icon" class="material-icons">search</i>
          <input id="dashboard-search-input" type="text" />
          <div id="dashboard-search-card" class="card">
            <a href="">
            <div class="row">
                <div class="col s4"><div class="search-key">text</div></div>
                <div class="col s8"><div class="search-value">detail</div></div>
            </div></a>
            <a href="">
            <div class="row">
                <div class="col s4"><div class="search-key">text</div></div>
                <div class="col s8"><div class="search-value">detail</div></div>
            </div>
            </a>
          </div>
        </li>`);
    }

    if (headerNavs.length > 0) {
        rightNavs.push(
            `<li><a class="dropdown-trigger" href="#!" data-target="dashboard-dropdown">${Name} <i class="material-icons right">arrow_drop_down</i></a></li>`
        );
    } else {
        rightNavs.push(`<li><a>${Name}</a></li>`);
    }

    $(`#${id}`).html(`
    <ul id="dashboard-dropdown" class="dropdown-content">
      ${headerNavs.join("")}
    </ul>

    <nav id="dashboard-nav-header">
      <div class="nav-wrapper row">
        <div class="col s12">
            <ul>
              <li><a href="#!" id="dashboard-menu-toggle"><i class="material-icons">menu</i></a></li>
              <li><a href="#!" id="dashboard-nav-logo">${logoHtml}</a></li>
            </ul>

            <div id="dashboard-nav-breadcrumb" class="nav-wrapper" style="display: inline-block;">
              <div id="dashboard-nav-path">
              </div>
            </div>

            <ul class="right" style="display: inline-flex;">
                ${rightNavs.join("")}
            </ul>
        </div>
        <div id="dashboard-root-content-progress" class="progress" style="display: none;">
          <div class="determinate" style="width: 0%"></div>
        </div>
      </div>
    </nav>

    <div class="border-right teal white" id="dashboard-sidebar-wrapper">
      <ul id="${servicesId}" class="list-group list-group-flush" style="width: 100%;"></ul>
    </div>

    <div id="dashboard-content-wrapper">
      <div class="container-fluid">
        <div id="root-content"></div>
      </div>

      <div id="dashboard-root-modal" class="modal">
        <div id="dashboard-root-modal-content" class="modal-content">
        </div>
        <div class="modal-footer">
          <a href="#!" class="modal-close waves-effect waves-green btn-flat left">Cancel</a>
          <a href="#!" id="dashboard-root-modal-submit-button" class="waves-effect waves-light btn right">Submit</a>
        </div>
      </div>
    </div>
    `);

    $("#dashboard-root-modal").modal();

    // $("#dashboard-search-card").hide();
    function onInput(val: any) {
        $("#dashboard-search-card").show();
        console.log("DEBUG");
    }
    $("#dashboard-search-input")
        .on("blur", function () {
            $("#dashboard-search-card").hide();
        })
        .on("keydown", function () {
            $("#dashboard-search-card").show();
            const val = $(this).val();
            onInput($(this).val());
        });

    renderServices(
        Object.assign({}, input, {
            id: servicesId,
            keyPrefix: keyPrefix,
            serviceName,
            projectName
        })
    );

    $("#dashboard-nav-logo").on("click", function (e) {
        const serviceName = provider.getDefaultServiceName();
        onClickService({ serviceName });

        renderServices(
            Object.assign({}, input, { id: servicesId, serviceName })
        );
    });

    $(".dropdown-trigger").dropdown();

    $("#dashboard-menu-toggle").on("click", function (e) {
        e.preventDefault();
        $("#dashboard-sidebar-wrapper").toggleClass("toggled");
        $("#dashboard-content-wrapper").toggleClass("toggled");
    });

    $("#dashboard-logout").on("click", function () {
        input.logout();
    });

    return;
}

const NavPath = {
    Render: function (input: any) {
        const { location } = input;
        const navs: any[] = [];
        let parents: any[] = [];
        for (let i = 0, len = location.Path.length; i < len; i++) {
            let pathName = location.Path[i];
            const path = location.Path.slice(0, i + 1);
            const view = service.getViewFromPath(data.service.rootView, path);
            switch (view.Kind) {
                case "Tabs":
                case "Panes":
                    parents.push(pathName);
                    break;
                default:
                    if (parents.length > 0) {
                        pathName = parents.join(".") + "." + pathName;
                        parents = [];
                    }
                    navs.push(`
                    <a href="#!" class="breadcrumb dashboard-nav-path-link" data-path="${path.join(
                        "@"
                    )}">${pathName}</a>
                    `);
                    break;
            }
        }
        $("#dashboard-nav-path").html(navs.join(""));
        $(".dashboard-nav-path-link")
            .off("click")
            .on("click", function (e: any) {
                e.preventDefault();
                const dataPath = $(this).attr("data-path");
                if (dataPath) {
                    const location = locationData.getLocationData();
                    location.Path = dataPath.split("@");
                    service.getQueries({ location });
                }
            });
    }
};

const RootContentProgress = {
    id: "dashboard-root-content-progress",
    StartProgress: function () {
        $("#dashboard-root-content-progress")
            .html('<div class="indeterminate"></div>')
            .show();
    },
    StopProgress: function () {
        $("#dashboard-root-content-progress")
            .html('<div class="determinate" style="width: 0%"></div>')
            .hide(2000);
    }
};

const RootModal = {
    id: "dashboard-root-modal",
    GetId: function () {
        return this.id;
    },
    GetContentId: function () {
        return "dashboard-root-modal-content";
    },
    Init: function (input: any) {
        const { View, onSubmit } = input;
        let buttonText = "Submit";
        if (View.SubmitButtonName) {
            buttonText = View.SubmitButtonName;
        }
        $("#dashboard-root-modal-submit-button")
            .text(buttonText)
            .off("click")
            .on("click", function (e: any) {
                onSubmit(e);
            });
    },
    Open: function () {
        // Modalの発火点(Trigger)は、<a href="#${Dashboard.RootModal.GetId()}"> でないと、以下のエラーが出るので注意
        // Uncaught TypeError: Cannot read property 'M_Modal' of null
        // var i=M.getIdFromTrigger(e[0]),n=document.getElementById(i).M_Modal
        $("#dashboard-root-modal").modal("open");
    },
    Close: function () {
        $("#dashboard-root-modal").modal("close");
    }
};

const index = {
    Render,
    NavPath,
    RootContentProgress,
    RootModal
};
export default index;
