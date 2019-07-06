let count = 0;
let mouseStatus = 'up';
let mouseTimeout;
let addedMouseEvent = false;

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

// Check event and update location
const changeLocation = () => {
    if(document.querySelector('video')) {
        let current = document.querySelector('span.ytp-time-current').textContent;
        let duration = document.querySelector('span.ytp-time-duration').textContent;
        let button = document.querySelector('button.watch-next[watch-next=true]');
        if(current == duration && button && mouseStatus == 'up') {
            let link = 'https://www.youtube.com' + button.parentElement.querySelector('a').getAttribute('href');
            window.location.href = link;
        }
    }
}

// Button click event
const btnClick = (event) => {
    let button = event.target;

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
            let span = document.createElement('SPAN');
            let textnode = document.createTextNode('>');

            button.appendChild(textnode);

            let link = div.querySelector('a');
            div.insertBefore(button, link);

            button.setAttribute('class', 'watch-next');
            button.setAttribute('watch-next', 'false');
            button.addEventListener('click', btnClick);
        }
    }
}

// Init
const init = () => {
    if (document.querySelector('video')) {
        let items = document.querySelectorAll('#columns #related #items ytd-compact-video-renderer.ytd-watch-next-secondary-results-renderer');
        addMouseStatusChecker();

        if(!document.querySelector('input[type=hidden].watch-next')) {
            let input = document.createElement('INPUT');
            input.setAttribute('type', 'hidden');
            input.setAttribute('class', 'watch-next');
            document.querySelector('head').appendChild(input);

            count = 0;
        }

        if(items.length > count) {
            count = items.length;
            appendButtons(items);
        }
    }
}

setInterval(init, 1000);
setInterval(changeLocation, 1000);