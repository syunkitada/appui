function Render(input: any) {
    const { id, error } = input;
    $(`#${id}`).html(`<div>${error}</div>`);
}

const index = {
    Render
};
export default index;
