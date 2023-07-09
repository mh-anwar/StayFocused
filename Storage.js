function addSite(site, siteType, timeLeft = 15, timeDefault = 15) {
    browser.storage.sync.get('focusSites', (data) => {
        data = data.focusSites;
        data[site] = {
            banned: siteType == 'banned' ? true : false,
            allowed: siteType == 'allowed' ? true : false,
            timeLeft: timeLeft,
            timeDefault: timeDefault,
        };
        browser.storage.sync.set({ focusSites: data });
    });
}

function removeSite(site) {
    browser.storage.sync.get('focusSites', (data) => {
        data = data.focusSites;
        delete data[site];
        browser.storage.sync.set({ focusSites: data });
    });
}

export { addSite, removeSite };
