import Tabs from "./Tabs";

import locationData from "../../data/locationData";

test("Tabs", () => {
    $(document.body).html('<div id="root"></div>');

    locationData.setLocationData({
        Path: ["Tab1"]
    });

    Tabs.Render({
        id: "root",
        View: {
            Name: "Root",
            Kind: "Tabs",
            Children: [
                {
                    Kind: "Pane",
                    Name: "Tab1",
                    Views: [
                        {
                            Kind: "Title",
                            Title: "Tab1"
                        }
                    ]
                },
                {
                    Kind: "Pane",
                    Name: "Tab2",
                    Views: [
                        {
                            Kind: "Title",
                            Title: "Tab2"
                        }
                    ]
                }
            ]
        }
    });

    const tabs = $(".appui-tab");
    expect(tabs[0].className).toBe("appui-tab root-Tabs-tab active");
    expect($($(tabs[0]).find(".tab-name")[0]).text()).toBe("Tab1");

    expect(tabs[1].className).toBe("appui-tab root-Tabs-tab ");
    expect($($(tabs[1]).find(".tab-name")[0]).text()).toBe("Tab2");
});
