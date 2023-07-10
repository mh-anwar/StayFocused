async function determineTabURL(url) {
    url = new URL(url);
    let data = await browser.storage.sync.get('focusSites');
    data = data.focusSites;
    if (data[url]) {
        return url;
    } else if (data[url.hostname]) {
        return url.hostname;
    } else if (data[url.origin]) {
        return url.origin;
    } else if (data[url.host]) {
        return url.host;
    } else if (data[url.href]) {
        return url.href;
    }
}

let interval;
browser.storage.sync.get(['focusSites'], async (data) => {
    let bannedSites = data.focusSites;
    // Remove
    bannedSites['blank.org'] = {
        banned: true,
        allowed: false,
        timeLeft: 15,
        timeDefault: 15,
    };
    browser.storage.sync.set({ focusSites: bannedSites });
    //Remove

    let tabURL = await determineTabURL(window.location);
    let siteData = bannedSites[tabURL];

    determineBlockingStrategy(tabURL, siteData);
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') {
            determineBlockingStrategy(tabURL, siteData);
        } else {
            clearInterval(interval);
        }
    });
});

const determineBlockingStrategy = (tabURL, siteData) => {
    let interval = setInterval(async () => {
        let data = await browser.storage.sync.get('focusSites');
        data = data.focusSites;
        if (data[tabURL]) {
            data[tabURL].timeLeft = data[tabURL].timeLeft - 0.01;
            await browser.storage.sync.set({ focusSites: data });

            if (data[tabURL].timeLeft <= 0) {
                clearInterval(interval);
                unfocusPage();
            }
        }
    }, 1000);
};

const unfocusPage = async () => {
    window.location.href = await browser.runtime.getURL(
        './refocus/RefocusView.html'
    );
};
