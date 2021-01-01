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
    console.log("DEBUG projectName", projectName, tmpServiceMap);

    const tmpProjects = Object.keys(ProjectServiceMap);
    tmpProjects.sort();

    const tmpProjectMap: any = {};
    for (const tmpProject of tmpProjects) {
        tmpProjectMap[tmpProject] = null;
    }
    tmpProjectMap["hoge"] = null;
    tmpProjectMap["hoge2"] = null;

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

    const servicesHtmls = [projectHtml];

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
      <a href="#!" class="brand-logo">Home</a>

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
    </div>
    <!-- /#page-content-wrapper -->

  </div>


  `);

    //      <div class="progress">
    //            <div class="indeterminate"></div>
    //      </div>
    // <div class="progress">
    //       <div class="determinate" style="width: 70%"></div>
    //         </div>

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

const index = {
    Render
};
export default index;
