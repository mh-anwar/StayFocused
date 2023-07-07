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

    let hostname = window.location.hostname;
    let href = window.location.href;
    let origin = window.location.origin;
    if (bannedSites[hostname] && bannedSites[hostname].banned) {
        determineBlockingStrategy(bannedSites[hostname]);
    } else if (bannedSites[origin] && bannedSites[origin].banned) {
        determineBlockingStrategy(bannedSites[origin]);
    } else if (bannedSites[href] && bannedSites[href].banned) {
        determineBlockingStrategy(bannedSites[href]);
    }
});

const determineBlockingStrategy = (siteData) => {
    if (siteData.timeLeft <= 0) {
        unfocusPage();
    } else {
        let interval;
        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'visible') {
                interval = setInterval(
                    (siteData) => updateTimer(siteData),
                    30000
                );
            } else {
            }
            clearInterval(interval);
        });
    }
};

const unfocusPage = async () => {
    window.location.href = await browser.runtime.getURL('focus.html');
};

// Update the time in browser storage and on the page, then block page if time is up
const updateTimer = () => {};
