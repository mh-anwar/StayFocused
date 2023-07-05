let timeRemainingValue;

let timeRemaining = 480;
let timer = setInterval(function () {
    timeRemainingValue = timeRemaining;
    timeRemaining--;
    if (timeRemaining < 0) {
        clearInterval(timer);
        document.getElementById('time_remaining').innerText = 'Time is up!';
    } else {
        document.getElementById('time_remaining').innerText = timeRemaining;
    }
}, 1000);

async function updateTabName() {
    let tabs = await browser.tabs.query({ active: true });
    console.log(tabs);
    let tabFavicon = tabs[0].favIconUrl;
    let tabUrl = new URL(tabs[0].url);
    document.getElementById('tab_title').innerText = tabUrl.hostname;
    document.getElementById('tab_favicon').src = tabFavicon;
}

function openOptions() {
    browser.runtime.openOptionsPage();
}
document.getElementById('open_options').addEventListener('click', openOptions);
updateTabName();
