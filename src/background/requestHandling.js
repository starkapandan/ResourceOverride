/* global bgapp, match, matchReplace, browser */
{
    const logOnTab = bgapp.util.logOnTab;
    const replaceContent = (requestId, mimeAndFile) => {
        if (browser.webRequest.filterResponseData) {
            // browsers that support filterResponseData
            browser.webRequest.filterResponseData(requestId).onstart = e => {
                const encoder = new TextEncoder();
                e.target.write(encoder.encode(mimeAndFile.file));
                e.target.disconnect();
            };

            return {
                responseHeaders: [{
                    name: "Content-Type",
                    value: mimeAndFile.mimeType
                }]
            };
        }

        // browsers that dont support filterResponseData
        return {
            // unescape is a easy solution to the utf-8 problem:
            // https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/btoa#Unicode_Strings
            redirectUrl: "data:" + mimeAndFile.mimeType + ";charset=UTF-8;base64," +
                btoa(unescape(encodeURIComponent(mimeAndFile.file)))
        };
    };
    function fileMatchReplacer(fileData, replacementList) {
        for (var i = 0; i < replacementList.length; i++) {
            fileData = fileData.replaceAll(replacementList[i].find, replacementList[i].replaceWith);
        }
        return fileData;
    }
    bgapp.handleRequest = function (requestUrl, tabUrl, tabId, requestId) {
        for (var i = 0; i < bgapp.config.replacementPackages.length; i++) {
            const domainObj = bgapp.config.replacementPackages[i];
            if (domainObj.on && match(domainObj.matchUrl, tabUrl).matched) {
                const rules = domainObj.rules || [];
                for (let x = 0, len = rules.length; x < len; ++x) {
                    const ruleObj = rules[x];
                    if (ruleObj.on) {
                        if (ruleObj.type === ruleTypeEnum.sourceOverride) {
                            const matchedObj = match(ruleObj.match, requestUrl);
                            const newUrl = requestUrl.matchReplace(ruleObj.match, ruleObj.replace)
                            if (matchedObj.matched) {

                                logOnTab(tabId, "URL Override Matched: " + requestUrl +
                                    "   to:   " + newUrl + "   match url: " + ruleObj.match, true);
                                if (requestUrl !== newUrl) {
                                    return { redirectUrl: newUrl };
                                } else {
                                    // allow redirections to the original url (aka do nothing).
                                    // This allows for "redirect all of these except this."
                                    return;
                                }
                            }
                        } else if (ruleObj.type === ruleTypeEnum.localFileOverride && match(ruleObj.match, requestUrl).matched) {
                            logOnTab(tabId, "File Override Matched: " + requestUrl + "   match url: " + ruleObj.match, true);

                            var mimeAndFile = { file: ruleObj.newFileData, mimeType: ruleObj.mimeType };
                            alert(JSON.stringify(ruleObj));
                            return replaceContent(requestId, mimeAndFile);
                        } else if (ruleObj.type === ruleTypeEnum.fileReplacer && match(ruleObj.match, requestUrl).matched) {
                            logOnTab(tabId, "FileReplacer Override Matched: " + requestUrl + "   match url: " + ruleObj.match, true);

                            var mimeAndFile = { file: undefined, mimeType: ruleObj.mimeType };

                            var request = new XMLHttpRequest();
                            request.open('GET', requestUrl, false);  // `false` makes the request synchronous
                            request.send(null);
                            mimeAndFile.file = fileMatchReplacer(request.responseText, ruleObj.replacementList);

                            return replaceContent(requestId, mimeAndFile);
                        }
                    }
                }
                logOnTab(tabId, "No override match for: " + requestUrl);
            } else {
                logOnTab(tabId, "Rule is off or tab URL does not match: " + domainObj.matchUrl);
            }
        }
    };
}
