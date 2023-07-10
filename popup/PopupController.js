let globalTabURL = null;

function isBase64(input) {
    try {
        return btoa(atob(input)) === input;
    } catch (e) {
        return false;
    }
}

async function updateTabName() {
    let tabData = await getTabData();
    document.getElementById('tab_title').innerText = tabData.tabUrl;

    try {
        let tabFavIcon = new URL(tabData.tabFavicon);
        document.getElementById('tab_favicon').src = tabData.tabFavicon;
    } catch (error) {
        document.getElementById('tab_favicon').style.display = 'none';
    }
}

function openOptions() {
    browser.runtime.openOptionsPage();
}

async function determineTabURL(url) {
    if (url !== undefined) {
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
        } else {
            return url.hostname;
        }
    } else {
        return 'Browser Page';
    }
}

async function getTabData() {
    let tabs = await browser.tabs.query({ active: true });
    let tabFavicon = tabs[0].favIconUrl;
    let tabUrl = await determineTabURL(tabs[0].url);
    globalTabURL = tabUrl;
    return {
        tabFavicon: tabFavicon,
        tabUrl: tabUrl,
    };
}

function displayAllowedSite() {
    document.getElementById('focus_time').innerText = 'Allowed';
}

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

function reloadTabs(tabUrl) {
    console.log(tabUrl);
    chrome.tabs.query({ url: 'https://' + tabUrl + '/*' }, function (tabs) {
        // Loop through each tab and reload it
        console.log(tabs);
        tabs.forEach(function (tab) {
            chrome.tabs.reload(tab.id);
        });
        window.close();
    });
}

document.getElementById('block_site').addEventListener('click', () => {
    addSite(globalTabURL, 'banned');
    reloadTabs(globalTabURL);
});
document.getElementById('open_options').addEventListener('click', openOptions);
updateTabName();

setInterval(async function () {
    if (globalTabURL == null) {
        globalTabURL = await getTabData().tabdata.tabUrl;
    } else {
        let data = await browser.storage.sync.get('focusSites');
        data = data.focusSites;

        await globalTabURL;

        if (data[globalTabURL]) {
            let siteData = data[globalTabURL];
            if (siteData.banned) {
                let timeLeft = siteData.timeLeft;
                document.getElementById('time_remaining').innerText =
                    Math.floor(timeLeft) +
                    ':' +
                    Math.floor((timeLeft % 1) * 60);
            } else {
                document.getElementById('time_remaining').innerText = 'Allowed';
            }
        } else {
            displayAllowedSite();
        }
    }
}, 1000);
