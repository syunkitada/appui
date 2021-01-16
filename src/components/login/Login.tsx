import logger from "../../lib/logger";

function Render(input: any) {
    const { id, onSubmit, View } = input;

    const keyPrefix = `${id}-Login-`;
    const loginFormId = `${keyPrefix}loginForm`;
    const loginButtonId = `${keyPrefix}loginButton`;

    const inputs: any = [];
    if (View.Fields) {
        inputs.push(
            `
            <label for="inputUserName" class="sr-only">User Name</label>
            <input type="text" id="login-Login-userName" class="form-control" placeholder="User Name" required autofocus>
            `
        );
        inputs.push(`
            <label for="inputPassword" class="sr-only">Password</label>
            <input type="password" id="login-Login-password" class="form-control" placeholder="Password" required>
            `);
        inputs.push(`
            <div class="checkbox mb-3">
              <label>
                <input type="checkbox" value="remember-me"> Remember me
              </label>
            </div>
            `);
    }

    $(`#${id}`).html(`
    <div class="container" style="margin-top: 100px; max-width: 500px;">
      <form class="form-login" id="${loginFormId}">
        <h1 class="h3 mb-3 font-weight-normal">Please Log In</h1>
        ${inputs.join("")}
        <p>
          <a id="${loginButtonId}" class="btn btn-large btn-primary btn-block">Log In</a>
        </p>
      </form>
    </div>
    `);

    function onError(input: any) {
        logger.error("Login", input);
        $(`#${loginButtonId}`).html("Log In");
    }

    function onSubmitInternal() {
        $(`#${loginButtonId}`).html("Loading...");

        const userName = $("#login-Login-userName").val();
        const password = $("#login-Login-password").val();

        onSubmit({
            userName: userName,
            password: password,
            onError: onError
        });
    }

    $(`#${loginButtonId}`).on("click", function (e: any) {
        e.preventDefault();
        onSubmitInternal();
    });
    $("#login-Login-form").on("submit", function (e: any) {
        e.preventDefault();
        onSubmitInternal();
    });

    return;
}

const index = {
    Render
};
export default index;
