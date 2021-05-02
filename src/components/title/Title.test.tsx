import Title from "./Title";

test("Title", () => {
    $(document.body).html('<div id="root"></div>');

    Title.Render({
        id: "root",
        View: {
            Title: "Title"
        }
    });

    expect($("h1").text()).toBe("Title");
});
