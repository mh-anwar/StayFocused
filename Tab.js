async function updateTime(newTime, site) {
    let data = await browser.storage.sync.get('focusSites');
    data = data.focusSites;
    data[site].timeLeft = newTime;
    return data;
}

function determineTabURL(url) {
    url = new URL(url);
    browser.storage.sync.get('focusSites', (data) => {
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
    });
}

export { determineTabURL, updateTime };
