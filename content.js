browser.storage.sync.get(['focusSites'], (data) => {
    let bannedSites = data.focusSites;

    bannedSites['blank.org'] = {
        banned: true,
        allowed: false,
        timeLeft: 15,
        timeDefault: 15,
    };

    browser.storage.sync.set({ focusSites: bannedSites });
    console.log(document.visibilityState === 'visible');

    let tabURL = determineTabURL(window.location);
    determineBlockingStrategy(tabURL, bannedSites);
});

const determineBlockingStrategy = (tabURL, bannedSites) => {
    let siteData = bannedSites[tabURL];
    if (siteData.timeLeft <= 0) {
        unfocusPage();
    } else {
        let interval;
        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'visible') {
                interval = setInterval(
                    (siteData) => updateTime(siteData.timeLeft - 0.5, tabURL),
                    30000
                );
            } else {
                clearInterval(interval);
            }
        });
    }
};

const unfocusPage = async () => {
    window.location.href = await browser.runtime.getURL('focus.html');
};
