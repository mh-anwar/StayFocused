document.getElementById('provide_perms').addEventListener('click', () => {
    console.log('clicked');
    chrome.permissions.request(
        {
            origins: ['<all_urls>'],
        },
        function (granted) {
            if (granted) {
                console.log('Host permissions have been granted.');
            } else {
                console.log('Host permissions have been denied.');
            }
        }
    );
});
