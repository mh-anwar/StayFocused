const tabs = document.querySelectorAll('.tabs li a');
const tabContents = document.querySelectorAll('.tab-content');
const darkModeToggle = document.getElementById('darkModeToggle');

const totalTimerRadio = document.getElementById('total_timer');
const timerPerSiteRadio = document.getElementById('timer_per_site');
const submitAllowedSites = document.getElementById('submit_allowed_sites');
const allowedSites = document.getElementById('allowed_sites');

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
    browser.storage.sync.set({ focusSites: sites });
}

function displayDailyLimit(generalData) {
    let dailyLimit = generalData.dailyLimit;
    let dailyLimitInput = document.getElementById('daily_time_limit');
    dailyLimitInput.value = dailyLimit.time;
    if (dailyLimit.totalTimer) {
        totalTimerRadio.checked = true;
    } else {
        timerPerSiteRadio.checked = true;
    }

    document
        .getElementById('submit_daily_limit')
        .addEventListener('click', () => updateDailyLimit(generalData));
}

function displayWorkingDays(generalData) {
    let workingDays = generalData.workingDays;
    let workingDayCheckboxes = document.getElementsByName('working_day');

    for (let i = 0; i < workingDayCheckboxes.length; i++) {
        let day = workingDayCheckboxes[i].value;
        if (workingDays[day]) {
            workingDayCheckboxes[i].checked = true;
        }
        workingDayCheckboxes[i].addEventListener('click', updateWorkingDays);
    }
}
function displayWorkingHours(generalData) {
    let workingHours = generalData.workingHours;
    let workingStartHour = document.getElementById('working_start_hour');
    let workingStartMinute = document.getElementById('working_start_minute');
    let workingEndHour = document.getElementById('working_end_hour');
    let workingEndMinute = document.getElementById('working_end_minute');

    workingStartHour.value = workingHours.startHour;
    // TODO Handle Octal literals
    workingStartMinute.value = workingHours.startMinute;
    workingEndHour.value = workingHours.endHour;
    workingEndMinute.value = workingHours.endMinute;

    workingStartHour.addEventListener('change', (e) => updateWorkingHours(e));
    workingStartMinute.addEventListener('change', (e) => updateWorkingHours(e));
    workingEndHour.addEventListener('change', (e) => updateWorkingHours(e));
    workingEndMinute.addEventListener('change', (e) => updateWorkingHours(e));
}

function updateWorkingDays(e) {
    let workingDayCheckboxes = document.getElementsByName('working_day');
    let newWorkingDays = {};
    for (let i = 0; i < workingDayCheckboxes.length; i++) {
        newWorkingDays[workingDayCheckboxes[i].value] =
            workingDayCheckboxes[i].checked;
    }
    browser.storage.sync.get(['focusGeneral'], (data) => {
        let updatedData = data.focusGeneral;
        updatedData.workingDays = newWorkingDays;
        browser.storage.sync.set({
            focusGeneral: updatedData,
        });
    });
}
function updateDailyLimit(generalData) {
    let newDailyLimit = {
        totalTimer: true,
        timerPerSite: false,
        time: 15,
    };
    let dailyLimitInput = document.getElementById('daily_time_limit');
    newDailyLimit.time = dailyLimitInput.value;

    if (totalTimerRadio.checked) {
        newDailyLimit.totalTimer = true;
        newDailyLimit.timerPerSite = false;
    } else {
        newDailyLimit.totalTimer = false;
        newDailyLimit.timerPerSite = true;
    }
    generalData.dailyLimit = newDailyLimit;
    browser.storage.sync.set({ focusGeneral: generalData }, () => {
        window.location.reload();
    });
}
function updateWorkingHours(e) {}

browser.storage.sync.get('focusGeneral', (data) => {
    data = data.focusGeneral;
    displayDailyLimit(data);
    displayWorkingDays(data);
    displayWorkingHours(data);
});

browser.storage.onChanged.addListener((e) => {
    console.log(e);
    if (e.focusGeneral) {
        let generalData = e.focusGeneral.newValue;
        displayDailyLimit(generalData);
        displayWorkingDays(generalData);
        displayWorkingHours(generalData);
    }
});
