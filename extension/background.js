chrome.action.onClicked.addListener((tab) => {
    // Chỉ gửi lệnh nếu đang ở tab web hợp lệ và không phải là trang setting của Chrome
    if (tab.url && !tab.url.startsWith("chrome://")) {
        chrome.tabs.sendMessage(tab.id, { action: "toggle-menu" }).catch(err => {
            console.log("Tab chưa load xong content_script, hãy F5 lại trang!");
        });
    }
});