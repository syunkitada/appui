function Render(input: any) {
    const { id } = input;

    $(`#${id}`).html(`
    Not Found
    `);
}

const index = {
    Render
};
export default index;
