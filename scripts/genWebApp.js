
document.addEventListener('DOMContentLoaded', function () {
    window.AddToHomeScreenInstance = window.AddToHomeScreen({
        appName: '福岡夏日の旅2026',                           // Name of the app.
        // Required.
        appNameDisplay: 'standalone',                         // If set to 'standalone' (the default), the app name will be diplayed
        // on it's own, beneath the "Install App" header. If set to 'inline', the
        // app name will be displayed on a single line like "Install MyApp"
        // Optional. Default 'standalone'
        appIconUrl: 'apple-touch-icon.png',                   // App icon link (square, at least 40 x 40 pixels).
        // Required.
        assetUrl: 'node_modules/pwa-add-to-homescreen/dist/assets/img/',  // Link to directory of library image assets.
        // Required.
        maxModalDisplayCount: -1,                             // If set, the modal will only show this many times.
        // [Optional] Default: -1 (no limit).  (Debugging: Use this.clearModalDisplayCount() to reset the count)
        displayOptions: { showMobile: true, showDesktop: true }, // show on mobile/desktop [Optional] Default: show everywhere
        allowClose: true,                                       // allow the user to close the modal by tapping outside of it [Optional. Default: true]
        showArrow: true,                                        // show the bouncing arrow on the modal [Optional. Default: true] (highly recommend leaving at true as drastically affects install rates)
    });

    ret = window.AddToHomeScreenInstance.show('zh');        // show "add-to-homescreen" instructions to user, or do nothing if already added to homescreen
    // [optional] language.  If left blank, then language is auto-decided from (1) URL param locale='..' (e.g. /?locale=es) (2) Browser language settings
});