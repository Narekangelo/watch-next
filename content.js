let count = 0;
let mouseStatus = 'up';
let mouseTimeout;
let addedMouseEvent = false;
let windowLocation = window.location.href;
const buttonIcon = 'https://svgshare.com/i/Dw4.svg';
const youtubeUrl = 'https://www.youtube.com';

// Add mouse status checker
const addMouseStatusChecker = () => {
    let videoPosition = document.querySelector('.ytp-scrubber-container');

    if(videoPosition && !addedMouseEvent) {
        addedMouseEvent = true;

        videoPosition.addEventListener('mousedown', () => {
            clearTimeout(mouseTimeout);
            mouseStatus = 'down';
            mouseTimeout = setTimeout(() => {
                mouseStatus = 'longDown';
                doSpecialStuffBecauseOfLongDown();
            }, 1500);
        }, false);

        videoPosition.addEventListener('mouseup', () => {
            clearTimeout(mouseTimeout);
            mouseStatus = 'up';
        }, false);
    }
}

// Change location
const changeLocation = (button = null) => {
    if (!button) {
        button = document.querySelector('button.watch-next[watch-next=true]');
    }

    if (button) {
        window.location.href = youtubeUrl + button.parentElement.querySelector('a').getAttribute('href');
    }
}

// Check event and update location
const checkVideoEnd = () => {
    if(document.querySelector('video')) {
        let current = document.querySelector('span.ytp-time-current').textContent;
        let duration = document.querySelector('span.ytp-time-duration').textContent;
        let button = document.querySelector('button.watch-next[watch-next=true]');
        if(current == duration && button && mouseStatus == 'up') {
           changeLocation(button);
        }
    }
}

// Hotkey Ctrl + B
const nextHotKey = (event) => {
    if (event.altKey && event.keyCode == 78) {
        changeLocation();
    }
}

// Button click event
const btnClick = (event) => {
    let button = event.target;
    if (button.tagName.toLowerCase() != 'button') {
        button = button.parentElement;
    }

    if(button.getAttribute('watch-next') == 'false') {
        let buttons = document.querySelectorAll('button.watch-next');
        for (let btn of buttons) {
            btn.setAttribute('watch-next', 'false');
        }

        button.setAttribute('watch-next', 'true');
    } else {
        button.setAttribute('watch-next', 'false');
    }
}

// Add buttons
const appendButtons = (items) => {
    for (let item of items) {
        let div = item.querySelector('div#dismissable > .metadata');
        if(!div.querySelector('button.watch-next')) {
            let button = document.createElement('BUTTON');
            let img = document.createElement('IMG');
            img.setAttribute('src', buttonIcon)

            button.setAttribute('class', 'watch-next');
            button.setAttribute('watch-next', 'false');
            button.addEventListener('click', btnClick);
            button.appendChild(img);

            let link = div.querySelector('a');
            div.insertBefore(button, link);
        }
    }
}

// Init
const init = () => {
    if (document.querySelector('video')) {
        let items = document.querySelectorAll('#columns #related #items ytd-compact-video-renderer.ytd-watch-next-secondary-results-renderer');
        addMouseStatusChecker();

        if(window.location.href != windowLocation && items) {
            for (item of items) {
                item.parentNode.removeChild(item);
            }

            windowLocation = window.location.href;
            count = 0;
        }

        let buttonsCount = document.querySelectorAll('button.watch-next').length;

        if(items.length > count || buttonsCount != items.length) {
            count = items.length;
            appendButtons(items);
        }
    }
}

setInterval(init, 1000);
setInterval(checkVideoEnd, 1000);
document.addEventListener('keyup', nextHotKey, false);