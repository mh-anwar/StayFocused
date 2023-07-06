let bannedSitesInput = document.getElementById('banned_sites_list');
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

browser.storage.onChanged.addListener(() => {
    displayMyBannedSites();
});

async function updateBannedSites() {
    let userSiteInput = bannedSitesInput.value.split('\n');
    browser.storage.sync.get(['focusSites'], (data) => {
        let bannedSites =
            typeof data.focusSites === 'undefined' ? {} : data.focusSites;
        for (let i = 0; i < userSiteInput.length; i++) {
            bannedSites[userSiteInput[i]] = {
                banned: true,
                allowed: false,
                timeLeft: 900,
            };
        }
        browser.storage.sync.set({ focusSites: bannedSites });
    });
}

function updateCommonSites() {
    for (let i = 0; i < commonBanned.length; i++) {
        let site = commonBanned[i];
        let siteRow = document.createElement('div');
        siteRow.innerText = site;
        siteRow.addEventListener('click', (e) =>
            addBannedSite(e.target.innerText, e)
        );
        commonSitesView.appendChild(siteRow);
    }
}

function addBannedSite(siteName, node = null) {
    browser.storage.sync.get(['focusSites'], (data) => {
        let bannedSites =
            typeof data.focusSites === 'undefined' ? {} : data.focusSites;
        bannedSites[siteName] = {
            banned: true,
            allowed: false,
            timeLeft: 900,
        };
        browser.storage.sync.set({ focusSites: bannedSites });
    });
    if (node) node.target.remove();
}

function removeBannedSite(siteName, node = null) {
    browser.storage.sync.get(['focusSites'], (data) => {
        let bannedSites =
            typeof data.focusSites === 'undefined' ? {} : data.focusSites;
        delete bannedSites[siteName];
        browser.storage.sync.set({ focusSites: bannedSites });
    });
    if (node) node.target.remove();
}

function displayMyBannedSites() {
    browser.storage.sync.get(['focusSites'], (data) => {
        bannedSitesView.innerHTML = '';
        let sites =
            typeof data.focusSites === 'undefined' ? {} : data.focusSites;
        sites = Object.keys(sites);
        displayAddBannedSite();

        for (let i = 0; i < sites.length; i++) {
            let site = sites[i];
            let siteRow = document.createElement('tr');

            let siteText = document.createElement('td');
            siteText.innerText = site;

            siteRow.appendChild(createSiteRemoveInput());
            siteRow.appendChild(siteText);
            siteRow.appendChild(createTimeInput());

            bannedSitesView.appendChild(siteRow);
        }
    });
}

function displayAddBannedSite() {
    let addSiteRow = document.createElement('tr');
    let addSiteText = document.createElement('td');
    addSiteText.innerText = '➕';
    addSiteText.addEventListener('click', updateBannedSites);

    let addSiteInfo = document.createElement('td');
    let addSiteInput = document.createElement('input');
    addSiteInput.type = 'text';
    addSiteInput.id = 'banned_sites_list';
    addSiteInfo.appendChild(addSiteInput);

    addSiteInput.placeholder = 'Enter a site per line';
    addSiteRow.appendChild(addSiteText);
    addSiteRow.appendChild(addSiteInfo);
    addSiteRow.appendChild(createTimeInput());
    bannedSitesView.appendChild(addSiteRow);
}

const createTimeInput = () => {
    let siteTiming = document.createElement('td');
    let siteTime = document.createElement('input');
    siteTime.type = 'number';
    siteTime.value = 15;
    siteTiming.appendChild(siteTime);
    return siteTiming;
};

const createSiteRemoveInput = () => {
    let siteRemove = document.createElement('td');
    siteRemove.innerText = '❌  '; // yes sometimes we have to use emojis
    siteRemove.addEventListener('click', (e) => removeBannedSite(site, e));
    return siteRemove;
};

updateCommonSites();
displayMyBannedSites();
