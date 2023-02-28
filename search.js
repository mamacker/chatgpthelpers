javascript: (() => {
    let huntShowMore = () => {
        return new Promise((resolve, reject) => {
            let check = () => {
                let buttons = [...document.querySelectorAll("button")];
                console.log(buttons);
                if (buttons) {
                    let showMore = buttons.find((a) => { console.log(a.innerText); return (a.innerText + "").match(/Show more/); });
                    console.log("showMore:", showMore, typeof showMore);
                    if (showMore) {
                        showMore.click();
                        setTimeout(check, 1000);
                    } else {
                        resolve();
                    }
                } else {
                    resolve();
                }
            };
            check();
        });
    };

    let fadeOut = (element, duration) => {
        return new Promise((resolve, reject) => {
            let oldColor = element.style.backgroundColor;
            element.style.backgroundColor = "yellow";
            let start = performance.now();
            let fade = (step) => {
                let elapsed = performance.now() - start;
                element.style.opacity = Math.max(1 - (elapsed / duration), 0);
                if (elapsed < duration) {
                    window.requestAnimationFrame(fade.bind(null, step));
                } else {
                    element.style.backgroundColor = oldColor;
                    resolve();
                }
            };
            window.requestAnimationFrame(fade.bind(null, element.style.opacity));
        });
    };

    let fadeIn = (element, duration, cb) => {
        return new Promise((resolve, reject) => {
            element.style.opacity = 0;
            let oldColor = element.style.backgroundColor;
            element.style.backgroundColor = "yellow";
            let start = performance.now();
            let fade = (step) => {
                let elapsed = performance.now() - start;
                element.style.opacity = Math.min((elapsed / duration) + step, 1);
                if (elapsed < duration) {
                    window.requestAnimationFrame(fade.bind(null, step));
                } else {
                    element.style.backgroundColor = oldColor;
                    resolve();
                }
            };
            window.requestAnimationFrame(fade.bind(null, element.style.opacity));
        });
    };

    let throb = (element, duration) => {
        return new Promise(async (resolve, reject) => {
            await fadeOut(element.parentElement, 1000);
            await fadeIn(element.parentElement, 1000);
            await fadeOut(element.parentElement, 1000);
            await fadeIn(element.parentElement, 1000);
            await fadeOut(element.parentElement, 1000);
            await fadeIn(element.parentElement, 1000);
            resolve();
        });
    };

    huntShowMore().then(() => {
        elements = document.querySelectorAll("a > svg + div");
        searchString = prompt("What should I search for?");

        elements.forEach(element => {
            const textContent = (element ? element.textContent || "" : "");
            if (textContent.match(new RegExp(searchString, "i"))) {
                console.log(element);
                element.scrollIntoView();
                throb(element, 1000).then(() => {
                    console.log("done");
                });
            }
        });
    });
})();