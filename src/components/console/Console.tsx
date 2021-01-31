import data from "../../data";
import locationData from "../../data/locationData";

// xterm: https://github.com/xtermjs/xterm.js
// xterm addons: https://github.com/xtermjs/xterm.js/tree/4.4.0/addons
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

export function Render(input: any) {
    const { id, View } = input;
    const location = locationData.getLocationData();

    const keyPrefix = `${id}-Console-`;
    const consoleId = `${keyPrefix}Console`;
    $(`#${id}`).html(`<div id="${consoleId}"></div>`);
    if (!data.service.websocketMap) {
        $(`#${consoleId}`).html("WebSocket is null");
        return;
    }

    const pathKey = location.Path.join(".");
    const websocket = data.service.websocketMap[pathKey];
    if (!websocket) {
        $(`#${consoleId}`).html("WebSocket is null");
        return;
    }

    const xterm = new Terminal();
    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);

    const element = document.getElementById(consoleId);
    if (!element) {
        return;
    }
    xterm.open(element);
    fitAddon.fit();
    websocket.onmessage = function (event: any) {
        const data = JSON.parse(event.data);
        xterm.write(atob(data.Bytes));
    };

    xterm.onData(function (data: any) {
        const body = JSON.stringify({
            Bytes: btoa(data)
        });
        websocket.send(body);
        console.log(body);
    });
}

const index = {
    Render
};
export default index;
