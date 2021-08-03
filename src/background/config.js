bgapp.config = {};
bgapp.config.debugMode = false;

//these are your golden rules that does everything in this plugin
bgapp.config.replacementPackages = [
    //add dicts in same fashion as below test and samples
    {
        matchUrl: /example\.com\/api\/test\.php/i, //Turn into glob matching by using string instead of regExp object e.g "*example.com/api/test.php*"
        on: true,
        rules: [
            {
                type: ruleTypeEnum.sourceOverride,
                match: /.*utility.*\.js/i,  //replaces ONLY matched part of url, therefore match all if full redirect is needed
                replace: "https://example.com/lounge/wp-includes/js/jquery/jquery.min.js",
                on: true
            },
            {
                type: ruleTypeEnum.sourceOverride,
                match: "*utility.js*",
                replace: "https://example.com/lounge/wp-includes/js/jquery/jquery.min.js",
                on: true
            },
            {
                type: ruleTypeEnum.sourceOverride,
                match: /(.*example.com).*utility.*\.js/i,                //capture groups
                replace: "$1/lounge/wp-includes/js/jquery/jquery.min.js",   //replace by capture group
                on: true
            },
        ],
    },
    {
        matchUrl: "*example.com/api/test.php*",
        on: true,
        rules: [
            {
                type: ruleTypeEnum.localFileOverride,
                match: "*utility*.js*",
                newFileData:
                    `
                    alert("hello, this is a test")
                `,
                mimeType: mimeTypeEnum.js, //specify filetype
                on: true
            },

        ],
    },
    {
        matchUrl: "*example.com/api/test.php*",
        on: true,
        rules: [
            {
                type: ruleTypeEnum.fileReplacer,
                match: "*",
                replacementList: [
                    {
                        find: "Current POST",       //string find and replace
                        replaceWith: "og post"
                    },
                    {
                        find: /Current/ig,          //g aka global flag is important since it replaces all occurences!
                        replaceWith: "blabla post"  //regex supports replace of capture groups $1,$2...$100
                    },
                ],
                mimeType: mimeTypeEnum.html, //specify filetype
                on: true
            },
            {
                type: ruleTypeEnum.fileReplacer,
                match: "*example.com/*utility.js*",
                replacementList: [
                    {
                        find: /^/ig,          //g aka global flag is important since it replaces all occurences!
                        replaceWith: "alert('wazzup');"  //regex supports replace of capture groups $1,$2...$100
                    },
                ],
                mimeType: mimeTypeEnum.js, //specify filetype
                on: true
            },
        ],
    },
    {
        matchUrl: "*example.com/api/test.php*",
        on: true,
        rules: [
            {
                type: ruleTypeEnum.headerModifier,
                match: "*",
                //The rules are modified by string format of "set headerKey1: headerValue1;set headerKey2: headerValue2;remove headerKey3; remove headerKey4"
                //keep in mind to urlencode headerValues..
                requestRules: "set Accept-Encoding: exampleValue1;set Cookie: sample%20cookie%20val;remove Cookie;remove Accept-Datetime",
                responseRules: "set Accept-Encoding: blablabla;set Cookie: sample%20cookie%20val;remove Cookie;remove Accept-Datetime",
                on: true
            },
        ],
    },
];


/**
 * -- Matching --
 *      *glob patterns have to match full url exactly to count as a match
 *          *Does not support captureGroups replacing
 *      *regex partials matches always count as a match
 *          *supports captureGroups replacing with $1,$2...$100
 * -- sourceOverrides --
 *      *When replacing with regex, it replaces ONLY matched part of url, therefore match all if full redirect is needed
*/
bgapp.config.testAndExamples = [
    {
        matchUrl: /example\.com\/api\/test\.php/i, //Turn into glob matching by using string instead of regExp object e.g "*example.com/api/test.php*"
        on: true,
        rules: [
            {
                type: ruleTypeEnum.sourceOverride,
                match: /.*utility.*\.js/i,  //replaces ONLY matched part of url, therefore match all if full redirect is needed
                replace: "https://example.com/lounge/wp-includes/js/jquery/jquery.min.js",
                on: true
            },
            {
                type: ruleTypeEnum.sourceOverride,
                match: "*utility.js*",
                replace: "https://example.com/lounge/wp-includes/js/jquery/jquery.min.js",
                on: true
            },
            {
                type: ruleTypeEnum.sourceOverride,
                match: /(.*example.com).*utility.*\.js/i,                //capture groups
                replace: "$1/lounge/wp-includes/js/jquery/jquery.min.js",   //replace by capture group
                on: true
            },
        ],
    },
    {
        matchUrl: "*example.com/api/test.php*",
        on: true,
        rules: [
            {
                type: ruleTypeEnum.localFileOverride,
                match: "*utility*.js*",
                newFileData:
                    `
                    alert("hello, this is a test")
                `,
                mimeType: mimeTypeEnum.js, //specify filetype
                on: true
            },

        ],
    },
    {
        matchUrl: "*example.com/api/test.php*",
        on: true,
        rules: [
            {
                type: ruleTypeEnum.fileReplacer,
                match: "*",
                replacementList: [
                    {
                        find: "Current POST",       //string find and replace
                        replaceWith: "og post"
                    },
                    {
                        find: /Current/ig,          //g aka global flag is important since it replaces all occurences!
                        replaceWith: "blabla post"  //regex supports replace of capture groups $1,$2...$100
                    },
                ],
                mimeType: mimeTypeEnum.html, //specify filetype
                on: true
            },
            {
                type: ruleTypeEnum.fileReplacer,
                match: "*example.com/*utility.js*",
                replacementList: [
                    {
                        find: /^/ig,          //g aka global flag is important since it replaces all occurences!
                        replaceWith: "alert('wazzup');"  //regex supports replace of capture groups $1,$2...$100
                    },
                ],
                mimeType: mimeTypeEnum.js, //specify filetype
                on: true
            },
        ],
    },
    {
        matchUrl: "*example.com/api/test.php*",
        on: true,
        rules: [
            {
                type: ruleTypeEnum.headerModifier,
                match: "*",
                //The rules are modified by string format of "set headerKey1: headerValue1;set headerKey2: headerValue2;remove headerKey3; remove headerKey4"
                //keep in mind to urlencode headerValues..
                requestRules: "set Accept-Encoding: exampleValue1;set Cookie: sample%20cookie%20val;remove Cookie;remove Accept-Datetime",
                responseRules: "set Accept-Encoding: blablabla;set Cookie: sample%20cookie%20val;remove Cookie;remove Accept-Datetime",
                on: true
            },
        ],
    },
];