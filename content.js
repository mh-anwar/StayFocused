console.log('Content script is running!');
chrome.storage.sync.get('focusSites', (data) => {
    console.log(data);
    let sites = data.focusSites;
    sites = Object.keys(sites);
    console.log('Unfocusing page');
    if (sites.includes(window.location.hostname)) {
        unfocusPage();
    } else if (sites.includes(window.location.href)) {
        unfocusPage();
    } else if (sites.includes(window.location.origin)) {
        unfocusPage();
    }
});
const unfocusPage = async () => {
    window.location.href = await browser.runtime.getURL('focus.html');
};
