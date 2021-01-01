function Render(input: any) {
  const { id } = input;
  $(`#${id}`).html(`
<div class="container" style="margin-top: 100px; max-width: 500px;">
  <div class="spinner-border" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>
  `);

  return;
}

const index = {
  Render,
};
export default index;
