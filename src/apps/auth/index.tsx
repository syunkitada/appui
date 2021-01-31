import Toast from "../../components/toast/Toast";
import Login from "../../components/login/Login";
import Loading from "../../components/login/Loading";
import service from "../service";
import provider from "../../provider";
import logger from "../../lib/logger";

function loginWithToken() {
    Loading.Render({ id: "root" });

    provider.loginWithToken({
        onSuccess: function (input: any) {
            logger.info("loginWithToken.onSuccess", input);
            service.init();
        },
        onError: function (input: any) {
            logger.error("loginWithToken.onError", input);
            renderLoginView();
            Toast.Error(input);
        }
    });
}

function login(input: any) {
    const { params } = input;
    provider.login({
        params,
        onSuccess: function (input: any) {
            logger.info("login.onSuccess", input);
            service.init();
        },
        onError: function (input: any) {
            logger.error("login.onError", input);
            renderLoginView();
            Toast.Error(input);
        }
    });
}

function logout() {
    provider.logout({
        onSuccess: function (input: any) {
            logger.info("logout.onSuccess", input);
            renderLoginView();
        },
        onError: function (input: any) {
            logger.error("logout.onError", input);
            Toast.Error(input);
        }
    });
}

function renderLoginView() {
    const view = provider.getLoginView({});
    Login.Render({
        View: view,
        id: "root",
        onSubmit: function (input: any) {
            login(input);
        }
    });
}

function init() {
    loginWithToken();
}

const index = {
    init,
    logout
};
export default index;
