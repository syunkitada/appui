function Render(input: any) {
  const { id, onSubmit } = input;
  $(`#${id}`).html(`
<div class="container" style="margin-top: 100px; max-width: 500px;">
  <form class="form-login" id="login-Login-form">
    <h1 class="h3 mb-3 font-weight-normal">Please log in</h1>
    <label for="inputUserName" class="sr-only">User Name</label>
    <input type="text" id="login-Login-userName" class="form-control" placeholder="User Name" required autofocus>
    <label for="inputPassword" class="sr-only">Password</label>
    <input type="password" id="login-Login-password" class="form-control" placeholder="Password" required>
    <div class="checkbox mb-3">
      <label>
        <input type="checkbox" value="remember-me"> Remember me
      </label>
    </div>
    <button id="login-Login-submit-button" class="btn btn-lg btn-primary btn-block" type="submit">Log in</button>
  </form>
</div>
  `);

  function onError(input: any) {
    console.log("onError", input);
    $("#login-Login-submit-button").html(`
    <button id="login-Login-submit-button" class="btn btn-lg btn-primary btn-block" type="submit">Log in</button>
    `);
  }

  $("#login-Login-form").on("submit", function (e: any) {
    e.preventDefault();

    $("#login-Login-submit-button").html(`
    <div class="spinner-border" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    `);

    const userName = $("#login-Login-userName").val();
    const password = $("#login-Login-password").val();

    onSubmit({
      userName: userName,
      password: password,
      onError: onError,
    });
  });
  return;
}

const index = {
  Render,
};
export default index;
