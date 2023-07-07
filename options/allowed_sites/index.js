const allowedSitesView = document.getElementById('allowed_sites_view');

async function updateAllowedSites() {
    let userSiteInput = document.getElementById('allowed_sites_list').value;

    if (userSiteInput == '') return;

    browser.storage.sync.get(['focusSites'], (data) => {
        let allowedSites = data.focusSites;

        allowedSites[userSiteInput] = {
            allowed: true,
            banned: false,
            timeLeft: 15,
            timeDefault: 15,
        };

        browser.storage.sync.set({ focusSites: allowedSites });
    });
}

function addAllowedSite(siteName, node = null) {
    browser.storage.sync.get(['focusSites'], (data) => {
        let allowedSites = data.focusSites;
        allowedSites[siteName] = {
            allowed: true,
            banned: false,
            timeLeft: 15,
            timeDefault: 15,
        };
        browser.storage.sync.set({ focusSites: allowedSites });
    });
    if (node) node.target.remove();
}

function removeAllowedSite(siteName, node = null) {
    browser.storage.sync.get(['focusSites'], (data) => {
        let allowedSites = data.focusSites;
        delete allowedSites[siteName];
        browser.storage.sync.set({ focusSites: allowedSites });
    });
    if (node) node.target.remove();
}

function displayMyAllowedSites(focusSites, generalSettings) {
    let timerPerSite = generalSettings.dailyLimit.timerPerSite;
    let sitesList = Object.entries(focusSites);

    for (let i = 0; i < sitesList.length; i++) {
        let site = sitesList[i][0];
        if (focusSites[site]['banned']) continue;

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
        allowedSitesView.appendChild(siteRow);
    }
}

function createUserSiteInput(dailyLimit) {
    let createSiteRow = document.createElement('tr');
    let createSiteText = document.createElement('td');
    createSiteText.innerText = '➕';
    createSiteText.addEventListener('click', updateAllowedSites);

    let createSiteInfo = document.createElement('td');
    let createSiteInput = document.createElement('input');
    createSiteInput.type = 'text';
    createSiteInput.id = 'allowed_sites_list';
    createSiteInput.placeholder = 'Enter a site per line';
    createSiteInfo.appendChild(createSiteInput);

    createSiteRow.appendChild(createSiteText);
    createSiteRow.appendChild(createSiteInfo);
    createSiteRow.appendChild(createTimeInput(dailyLimit));
    allowedSitesView.prepend(createSiteRow);
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
    siteRemove.addEventListener('click', (e) => removeAllowedSite(site, e));
    return siteRemove;
};

browser.storage.sync.get('focusSites', async (data) => {
    let sites = typeof data === 'undefined' ? {} : data.focusSites;
    let generalSettings = await browser.storage.sync.get('focusGeneral');
    generalSettings = await generalSettings.focusGeneral;
    allowedSitesView.innerHTML = '';
    createUserSiteInput(generalSettings.dailyLimit);
    displayMyAllowedSites(sites, generalSettings);
});

browser.storage.onChanged.addListener(async (e) => {
    if (e.focusSites) {
        let sites = e.focusSites.newValue;
        let generalSettings = await browser.storage.sync.get('focusGeneral');
        generalSettings = await generalSettings.focusGeneral;
        allowedSitesView.innerHTML = '';
        createUserSiteInput(generalSettings.dailyLimit);
        displayMyAllowedSites(sites, generalSettings);
    }
});
