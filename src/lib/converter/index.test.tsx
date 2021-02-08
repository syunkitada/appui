import index from "./index";

test("escapeKey", () => {
    expect(index.escapeKey("hoge:test")).toBe("hoge-test");
});
