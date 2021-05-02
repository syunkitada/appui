import "./ErrorText.css";

function Render(input: any) {
    const { id, error } = input;
    $(`#${id}`).html(`
    <h2 class="error-text">Error Occured</h2>
    <p class="error-text">${error}</p>
    `);
}

const index = {
    Render
};
export default index;
