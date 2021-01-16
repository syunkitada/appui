function Render(input: any) {
    const { id } = input;
    $(`#${id}`).html(`
    <div class="container" style="margin-top: 100px; max-width: 500px;">
      <div class="spinner-border" role="status">
        <div class="progress">
          <div class="indeterminate"></div>
        </div>
      </div>
    </div>
  `);

    return;
}

const index = {
    Render
};
export default index;
