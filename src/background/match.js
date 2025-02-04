function tokenize(str) {
    "use strict";
    var ans = str.split(/(\*+)/g);
    if (ans[0] === "") {
        ans.shift();
    }
    if (ans[ans.length - 1] === "") {
        ans.pop();
    }
    return ans;
}

function string_to_RegExp(regexString, defaultFlag = undefined) {
    var matches = regexString.match(/(\/?)(.+)\1([a-z]*)/i);
    if (matches == undefined) {
        return undefined;
    }
    var regexProcessedFilter = new RegExp(matches[2], matches[3]);
    return regexProcessedFilter;
}

function globMatch(pattern, str) {
    "use strict";
    var patternTokens = tokenize(pattern);
    var freeVars = {};
    var varGroup;
    var strParts = str;
    var matchAnything = false;
    var completeMatch = patternTokens.every(function (token) {
        if (token.charAt(0) === "*") {
            matchAnything = true;
            varGroup = token.length;
            freeVars[varGroup] = freeVars[varGroup] || [];
        } else {
            var matches = strParts.split(token);
            if (matches.length > 1) {
                // The token was found in the string.
                var possibleFreeVar = matches.shift();
                if (matchAnything) {
                    // Found a possible candidate for the *.
                    freeVars[varGroup].push(possibleFreeVar);
                } else {
                    if (possibleFreeVar !== "") {
                        // But if we haven't seen a * for this freeVar,
                        // the string doesnt match the pattern.
                        return false;
                    }
                }

                matchAnything = false;
                // We matched up part of the pattern to the string
                // prepare to look at the next part of the string.
                strParts = matches.join(token);
            } else {
                // The token wasn't found in the string. Pattern doesn't match.
                return false;
            }
        }
        return true;
    });

    if (matchAnything) {
        // If we still need to match a string part up to a star,
        // match the rest of the string.
        freeVars[varGroup].push(strParts);
    } else {
        if (strParts !== "") {
            // There is still some string part that didn't match up to the pattern.
            completeMatch = false;
        }
    }

    return {
        matched: completeMatch,
        freeVars: freeVars
    };
}

function match(regexPattern, str) {
    "use strict";
    if ((regexPattern instanceof RegExp) === false) {
        const matchRes = globMatch(regexPattern, str);
        if (matchRes.matched) {
            matchRes.captureGroups = [str];
        }
        return matchRes;
    }
    var matches = str.match(regexPattern);

    return {
        matched: matches ? true : false,
        captureGroups: matches
    };
}


String.prototype.matchReplace = function (regexPattern, str) {
    if ((regexPattern instanceof RegExp) === false) {
        const matchRes = globMatch(regexPattern, str);
        if (matchRes.matched) {
            matchRes.captureGroups = [str];
        }
        return str;
    }
    return ;
}
