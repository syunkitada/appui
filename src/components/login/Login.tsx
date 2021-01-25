import form from "../form/Form";

function Render(input: any) {
    const { id, onSubmit, View } = input;

    $(`#${id}`).html(`
    <div class="container" style="margin-top: 100px; max-width: 500px;">
      <div id="login-form"></div>
    </div>
    `);

    function onSubmitInternal(input: any) {
        const { params } = input;
        onSubmit({
            params
        });
    }

    form.Render({
        id: "login-form",
        View: View,
        onSubmit: onSubmitInternal
    });

    return;
}

const index = {
    Render
};
export default index;
