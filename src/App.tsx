import React from "react";

import auth from "./apps/auth";
import service from "./apps/service";

function App() {
    return <div />;
}

export default App;

$(function () {
    if ("auth" in window) {
        service.init();
    } else {
        auth.init();
    }
});
