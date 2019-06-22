// ==UserScript==
// @name         Watch next
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

const css = `
       button.watch-next {
            background-color: #4CAF50;
            border: none;
            color: white;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            width: 30px;
            height: 20px;
            border-radius: 20%;
        }

       button.watch-next[watch-next=true] {
            background-color: #008CBA; /* BLUE */
       }
`;

document.querySelector('head').innerHTML += '<style>' + css + '</style>';

let count = 0;
let mouseStatus = 'up';
let mouseTimeout;
let addedMouseEvent = false;
let videoPosition = document.querySelector('.ytp-scrubber-container');

// Video Position Element check
let videoPositionMouseEvent = () => {
    if(videoPosition && !addedMouseEvent) {
        addedMouseEvent = true;

        videoPosition.addEventListener('mousedown', () => {
            clearTimeout(mouseTimeout);
            mouseStatus = 'down';
            mouseTimeout = setTimeout(() => {
                mouseStatus = 'longDown';
                doSpecialStuffBecauseOfLongDown(); // put your secret sauce here
            }, 1500);
        }, false);

        videoPosition.addEventListener('mouseup', () => {
            clearTimeout(mouseTimeout);
            mouseStatus = 'up';
        }, false);
    }
}

// Check event and update location
let eventCheck = () => {
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
let btnClick = (event) => {
    let button = event.target;

    if(button.getAttribute("watch-next") == 'false') {
        let buttons = document.querySelectorAll('button.watch-next');
        for (let btn of buttons) {
            btn.setAttribute("watch-next", "false");
        }

        button.setAttribute("watch-next", "true");
    }
}

// Add buttons
let appendButtons = (items) => {
    for (let item of items) {
        let div = item.querySelector('div#dismissable > .metadata');
        if(!div.querySelector('button.watch-next')) {
            let newSpan = document.createElement('BUTTON');
            let textnode = document.createTextNode('>');
            newSpan.appendChild(textnode);

            let link = div.querySelector('a');
            div.insertBefore(newSpan, link);

            newSpan.setAttribute('class', 'watch-next');
            newSpan.setAttribute('watch-next', 'false');
            newSpan.addEventListener('click', btnClick);
        }
    }
}

// Init
let init = () => {
    if(document.querySelector('video')) {
        let items = document.querySelectorAll('#columns #related #items ytd-compact-video-renderer.ytd-watch-next-secondary-results-renderer');

        videoPositionMouseEvent();

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

(function() {
    'use strict';
    setInterval(init, 1000);
    setInterval(eventCheck, 1000);
})();

