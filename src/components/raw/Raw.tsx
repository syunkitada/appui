import locationData from "../../data/locationData";
import Index from "../Index";

export function Render(input: any) {
    const { id, View } = input;
    $(`#${id}`).html(View.Html);
}

const index = {
    Render
};
export default index;
