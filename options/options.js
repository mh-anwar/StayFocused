const tabs = document.querySelectorAll('.tabs li a');
const tabContents = document.querySelectorAll('.tab-content');
const darkModeToggle = document.getElementById('darkModeToggle');
let submitBannedSites = document.getElementById('submit_banned_sites');
let bannedSites = document.getElementById('banned_sites_list');
let submitAllowedSites = document.getElementById('submit_allowed_sites');
let allowedSites = document.getElementById('allowed_sites');
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

tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(tab.getAttribute('href'));

        tabs.forEach((tab) => tab.classList.remove('active'));
        tabContents.forEach((content) => content.classList.remove('active'));

        tab.classList.add('active');
        target.classList.add('active');
    });
});

darkModeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
});

function updateBannedSites() {
    let sites = bannedSites.value;
    let sitesDict = {};
    sites = sites.split('\n');
    for (let i = 0; i < sites.length; i++) {
        sitesDict[sites[i]] = {
            banned: true,
            allowed: false,
            timeLeft: 900,
        };
    }
    chrome.storage.sync.set({ focusSites: sites });
}
function updateAllowedSites() {
    let sites = allowedSites.value;
    let sitesDict = {};
    sites = sites.split('\n');
    for (let i = 0; i < sites.length; i++) {
        sitesDict[sites[i]] = {
            banned: false,
            allowed: true,
            timeLeft: 900,
        };
    }
    chrome.storage.sync.set({ focusSites: sites });
}
function updateCommonSites() {
    for (let i = 0; i < commonBanned.length; i++) {
        let site = commonBanned[i];
        let siteDiv = document.createElement('div');
        siteDiv.innerText = '+ ' + site;
        commonSitesView.appendChild(siteDiv);
    }
}
function displayMyBannedSites() {
    chrome.storage.sync.get('focusSites', (data) => {
        let sites = data.focusSites;
        for (let i = 0; i < sites.length; i++) {
            let site = sites[i];
            let siteDiv = document.createElement('div');
            siteDiv.innerText = 'x ' + site;
            bannedSitesView.appendChild(siteDiv);
        }
    });
}
submitAllowedSites.addEventListener('click', updateAllowedSites);
submitBannedSites.addEventListener('click', updateBannedSites);
updateCommonSites();
displayMyBannedSites();
