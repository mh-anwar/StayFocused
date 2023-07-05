console.log('Content script is running!');

const unfocusPage = () => {
    chrome.storage.sync.get('focusSites', (data) => {
        let sites = data.focusSites;
        for (let i = 0; i < sites.length; i++) {
            if (window.location.href.includes(sites[i])) {
                window.location.href = 'https://www.google.com';
            }
        }
    });
};

unfocusPage();
