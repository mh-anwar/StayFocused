browser.runtime.onInstalled.addListener((details) => {
    const reason = details.reason;
    switch (reason) {
        case 'install':
            browser.tabs.create({
                url: './install.html',
            });
            break;
    }
    browser.storage.sync.set({ hello: 'world' });
});

// recieve message from content script
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'create-unfocus') {
        browser.tabs.create({
            url: './focus.html',
        });
    }
});
