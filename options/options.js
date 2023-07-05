const tabs = document.querySelectorAll('.tabs li a');
const tabContents = document.querySelectorAll('.tab-content');

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

const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

darkModeToggle.addEventListener('change', () => {
    body.classList.toggle('dark-mode');
});
