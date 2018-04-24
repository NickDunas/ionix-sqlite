export function isBrowser() {
    if (typeof cordova === 'undefined') {
        return Promise.resolve(true);
    }
    return new Promise(function (resolve) {
        document.addEventListener('deviceready', function () {
            resolve(cordova.platformId === 'browser');
        });
    });
}
