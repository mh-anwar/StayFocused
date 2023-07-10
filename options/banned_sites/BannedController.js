let commonSitesView = document.getElementById('common_sites_view');
const bannedSitesView = document.getElementById('banned_sites_view');
const commonBanned = [
    'facebook.com',
    'twitter.com',
    'instagram.com',
    'reddit.com',
    'youtube.com',
    'netflix.com',
    'tiktok.com',
    'tumblr.com',
    'pinterest.com',
    'linkedin.com',
    'whatsapp.com',
    'snapchat.com',
    'quora.com',
    'telegram.com',
    'twitch.tv',
    'amazon.com',
    'ebay.com',
    'wikipedia.org',
    'imdb.com',
    'spotify.com',
    'craigslist.org',
    'yelp.com',
    'etsy.com',
    'bing.com',
    'yahoo.com',
    'duckduckgo.com',
    'baidu.com',
    'aol.com',
    'ask.com',
];

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

async function updateBannedSites() {
    let userSiteInput = document.getElementById('banned_sites_list').value;

    if (userSiteInput == '') return;
    addSite(userSiteInput, 'banned');
}

function updateCommonSites(sites) {
    for (let i = 0; i < commonBanned.length; i++) {
        let site = commonBanned[i];
        if (sites[site]) continue;
        let siteRow = document.createElement('div');
        siteRow.innerText = site;
        siteRow.addEventListener('click', (e) =>
            addBannedSite(e.target.innerText, e)
        );
        commonSitesView.appendChild(siteRow);
    }
}

function addBannedSite(siteName, node = null) {
    addSite(siteName, 'banned');
    if (node) node.target.remove();
}

function removeBannedSite(siteName, node = null) {
    removeSite(siteName);
    if (node) node.target.remove();
}

function displayMyBannedSites(focusSites, generalSettings) {
    let timerPerSite = generalSettings.dailyLimit.timerPerSite;
    let sitesList = Object.entries(focusSites);

    for (let i = 0; i < sitesList.length; i++) {
        let site = sitesList[i][0];
        if (focusSites[site]['allowed']) continue;

        let siteRow = document.createElement('tr');
        let siteText = document.createElement('td');
        siteText.innerText = site;

        siteRow.appendChild(createSiteRemoveInput(site));
        siteRow.appendChild(siteText);
        if (timerPerSite) {
            siteRow.appendChild(
                createTimeInput(
                    generalSettings.dailyLimit,
                    focusSites[site].timeDefault
                )
            );
        } else {
            siteRow.appendChild(createTimeInput(generalSettings.dailyLimit));
        }
        bannedSitesView.appendChild(siteRow);
    }
}

function createUserSiteInput(dailyLimit) {
    let createSiteRow = document.createElement('tr');
    let createSiteText = document.createElement('td');
    createSiteText.innerText = '➕';
    createSiteText.addEventListener('click', updateBannedSites);

    let createSiteInfo = document.createElement('td');
    let createSiteInput = document.createElement('input');
    createSiteInput.type = 'text';
    createSiteInput.id = 'banned_sites_list';
    createSiteInput.placeholder = 'Enter a site per line';
    createSiteInfo.appendChild(createSiteInput);

    createSiteRow.appendChild(createSiteText);
    createSiteRow.appendChild(createSiteInfo);
    createSiteRow.appendChild(createTimeInput(dailyLimit));
    bannedSitesView.prepend(createSiteRow);
}

const createTimeInput = (dailyLimit, timePerSite = false) => {
    let siteTiming = document.createElement('td');
    let siteTime = document.createElement('input');
    siteTime.type = 'number';
    siteTime.name = 'time-value';
    if (dailyLimit.timerPerSite) {
        siteTime.disabled = false;
        siteTime.value = timePerSite;
    } else {
        siteTime.disabled = true;
        siteTime.value = dailyLimit.time;
    }
    siteTiming.appendChild(siteTime);
    return siteTiming;
};

const createSiteRemoveInput = (site) => {
    let siteRemove = document.createElement('td');
    siteRemove.innerText = '❌  '; // yes sometimes we have to use emojis
    siteRemove.addEventListener('click', (e) => removeBannedSite(site, e));
    return siteRemove;
};

browser.storage.sync.get('focusSites', async (data) => {
    let sites = typeof data === 'undefined' ? {} : data.focusSites;
    updateCommonSites(sites);
    let generalSettings = await browser.storage.sync.get('focusGeneral');
    generalSettings = await generalSettings.focusGeneral;
    bannedSitesView.innerHTML = '';
    createUserSiteInput(generalSettings.dailyLimit);
    console.log(generalSettings);
    displayMyBannedSites(sites, generalSettings);
});

browser.storage.onChanged.addListener(async (e) => {
    if (e.focusSites) {
        let sites = e.focusSites.newValue;
        let generalSettings = await browser.storage.sync.get('focusGeneral');
        generalSettings = await generalSettings.focusGeneral;
        bannedSitesView.innerHTML = '';
        createUserSiteInput(generalSettings.dailyLimit);
        displayMyBannedSites(sites, generalSettings);
    }
});
