import auth from "./apps/auth";
import service from "./apps/service";
import provider from "./provider";
import mock from "./provider/mock";

$(function () {
    provider.register(new mock.Provider());

    if ("auth" in window) {
        service.init();
    } else {
        auth.init();
    }
});
