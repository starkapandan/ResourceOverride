/* globals chrome, bgapp, match */
{
    const simpleError = bgapp.util.simpleError;

    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.status == "loading") {
            if (bgapp.config.debugMode && match(/^chrome/i, tab.url).matched == false) {
                chrome.runtime.reload()
            }
        }
    });

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.action === "getDomains") {
            sendResponse(bgapp.replacementPackages);
        }  else if (request.action === "match") {
            sendResponse(match(request.domainUrl, request.windowUrl).matched);
        }

        // !!!Important!!! Need to return true for sendResponse to work.
        return true;
    });

    chrome.webRequest.onBeforeRequest.addListener(function (details) {
        if (!bgapp.requestIdTracker.has(details.requestId)) {
            if (details.tabId > -1) {
                let tabUrl = bgapp.tabUrlTracker.getUrlFromId(details.tabId);
                if (details.type === "main_frame") {
                    // a new tab must have just been created.
                    tabUrl = details.url;
                }
                if (tabUrl) {
                    const result = bgapp.handleRequest(details.url, tabUrl, details.tabId, details.requestId);
                    if (result) {
                        // make sure we don't try to redirect again.
                        bgapp.requestIdTracker.push(details.requestId);
                    }
                    return result;
                }
            }
        }
    }, {
        urls: ["<all_urls>"]
    }, ["blocking"]);

    chrome.webRequest.onHeadersReceived.addListener(bgapp.makeHeaderHandler("response"), {
        urls: ["<all_urls>"]
    }, ["blocking", "responseHeaders"]);

    chrome.webRequest.onBeforeSendHeaders.addListener(bgapp.makeHeaderHandler("request"), {
        urls: ["<all_urls>"]
    }, ["blocking", "requestHeaders"]);

    //init settings
    if (localStorage.devTools === undefined) {
        localStorage.devTools = "true";
    }
    if (localStorage.showSuggestions === undefined) {
        localStorage.showSuggestions = "true";
    }
}
