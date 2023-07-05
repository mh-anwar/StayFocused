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
