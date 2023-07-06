const tabs = document.querySelectorAll('.tabs li a');
const tabContents = document.querySelectorAll('.tab-content');
const darkModeToggle = document.getElementById('darkModeToggle');

let submitAllowedSites = document.getElementById('submit_allowed_sites');
let allowedSites = document.getElementById('allowed_sites');

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

submitAllowedSites.addEventListener('click', updateAllowedSites);
