browser.runtime.onInstalled.addListener((details) => {
    const reason = details.reason;
    switch (reason) {
        case 'install':
            browser.tabs.create({
                url: './install.html',
            });

            break;
    }
    browser.storage.sync.set({ focusSites: {} });
    browser.storage.sync.set({
        focusGeneral: {
            dailyLimit: {
                totalTimer: true,
                timerPerSite: false,
                time: 15,
            },
            workingDays: {
                Monday: true,
                Tuesday: true,
                Wednesday: true,
                Thursday: true,
                Friday: true,
                Saturday: false,
                Sunday: false,
            },
            workingHours: {
                startHour: 12,
                startMinute: 0,
                startPeriod: 'AM',
                endHour: 11,
                endMinute: 59,
                endPeriod: 'PM',
            },
        },
    });
});

// recieve message from content script
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'create-unfocus') {
        browser.tabs.create({
            url: './focus.html',
        });
    }
});
