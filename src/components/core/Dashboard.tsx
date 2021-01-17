import service from "../../apps/service";
import data from "../../data";
import locationData from "../../data/locationData";

function renderServices(input: any) {
    const { id, idPrefix, serviceName, projectName, onClickService } = input;
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

    const servicesHtmls = [];
    const tmpProjectMap: any = {};
    if (ProjectServiceMap) {
        const tmpProjects = Object.keys(ProjectServiceMap);
        tmpProjects.sort();

        for (const tmpProject of tmpProjects) {
            tmpProjectMap[tmpProject] = null;
        }

        const projectHtml = `
        <li class="list-group-item list-group-item-action sidebar-item">
          <div class="input-field col s12 autocomplete-wrapper">
            <input type="text" id="${idPrefix}inputProject" class="autocomplete">
            <label for="autocomplete-input">${projectText}</label>
            <i class="material-icons">input</i>
            <span class="hint">Select Project</span>
          </div>
        </li>
        `;

        servicesHtmls.push(projectHtml);
    }

    const tmpServices = Object.keys(tmpServiceMap);
    tmpServices.sort();

    for (const service of tmpServices) {
        let className = "";
        if (service === serviceName) {
            className = "sidebar-item-active";
        }
        servicesHtmls.push(`
        <li class="sidebar-item">
          <a class="${idPrefix}-Service ${className}" href="#">${service}</a>
        </li>
        `);
    }

    $(`#${id}`).html(servicesHtmls.join(""));

    $(`#${idPrefix}inputProject`).autocomplete({
        data: tmpProjectMap,
        minLength: 0
    });

    $(`.${idPrefix}-Service`).on("click", function (e) {
        const serviceName = $(this).text();
        onClickService({
            projectName: projectName,
            serviceName: serviceName
        });

        renderServices(Object.assign({}, input, { projectName, serviceName }));
    });

    $(`.${idPrefix}-Project`).on("click", function (e) {
        const projectName = $(this).text();
        const serviceName = "HomeProject";
        onClickService({
            projectName,
            serviceName
        });

        renderServices(Object.assign({}, input, { projectName, serviceName }));
    });
}

function Render(input: any) {
    const { id } = input;
    const { Name } = data.auth.Authority;

    const { serviceName, projectName } = locationData.getServiceParams();

    const idPrefix = `${input.id}-Dashboard-`;

    $(`#${id}`).html(`
    <ul id="dropdown1" class="dropdown-content">
      <li><a href="#!" id="DashboardLogout">Log out</a></li>
    </ul>

    <nav id="nav-header">
      <div class="nav-wrapper">
      <ul class="left">
      <a href="#!" id="menu-toggle"><i class="material-icons">menu</i></a>
      </ul>
      <a href="#!" id="nav-logo">Home</a>

      <div id="nav-breadcrumb" class="nav-wrapper">
        <div id="nav-path" class="col s12">
        </div>
      </div>

      <ul class="right">
        <li><a class="dropdown-trigger" href="#!" data-target="dropdown1">${Name} <i class="material-icons right">arrow_drop_down</i></a></li>
      </ul>
      </div>
    </nav>

    <!-- Sidebar -->
    <div class="border-right teal white" id="sidebar-wrapper">
      <ul id="${idPrefix}-Services" class="list-group list-group-flush" style="width: 100%;">
      </ul>
    </div>
    <!-- /#sidebar-wrapper -->

    <div class="bg-white" id="content-wrapper">
      <!-- Page Content -->
      <div id="page-content-wrapper">
        <div id="root-content-progress" class="progress">
          <div class="determinate" style="width: 0%"></div>
        </div>

        <div class="container-fluid">
          <div id="root-content"></div>
        </div>

      <!-- Modal Structure -->
      <div id="root-modal" class="modal">
        <div id="root-modal-content" class="modal-content">
        </div>
        <div class="modal-footer">
          <div id="root-modal-progress" class="progress">
            <div class="determinate" style="width: 0%"></div>
          </div>
          <a href="#!" class="modal-close waves-effect waves-green btn-flat left">Cancel</a>
          <a href="#!" id="root-modal-submit-button" class="waves-effect waves-light btn right">Submit</a>
        </div>
      </div>

      </div>
      <!-- /#page-content-wrapper -->

    </div>
    `);

    $("#root-modal").modal();

    renderServices(
        Object.assign({}, input, {
            id: `${idPrefix}-Services`,
            idPrefix: idPrefix,
            serviceName,
            projectName
        })
    );

    $(".dropdown-trigger").dropdown();

    $("#menu-toggle").on("click", function (e) {
        e.preventDefault();
        $("#sidebar-wrapper").toggleClass("toggled");
    });

    $("#header-menu-toggle").on("click", function (e) {
        e.preventDefault();
        $("#header-menu").toggleClass("toggled");
    });

    $("#DashboardLogout").on("click", function () {
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
                    <a href="#!" class="breadcrumb nav-path-link" data-path="${path.join(
                        "@"
                    )}">${pathName}</a>
                    `);
                    break;
            }
        }
        $("#nav-path").html(navs.join(""));
        $(".nav-path-link")
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

const RootModal = {
    id: "root-modal",
    GetContentId: function () {
        return "root-modal-content";
    },
    StartProgress: function () {
        $("#root-modal-progress").html('<div class="indeterminate"></div>');
    },
    StopProgress: function () {
        $("#root-modal-progress").html(
            '<div class="determinate" style="width: 0%"></div>'
        );
    },
    Init: function (input: any) {
        const { View, onSubmit } = input;
        let buttonText = "Submit";
        if (View.SubmitButtonName) {
            buttonText = View.SubmitButtonName;
        }
        $("#root-modal-submit-button")
            .text(buttonText)
            .off("click")
            .on("click", function (e: any) {
                onSubmit(e);
            });
    },
    Open: function () {
        $("#root-modal").modal("open");
    }
};

const index = {
    Render,
    NavPath,
    RootModal
};
export default index;
