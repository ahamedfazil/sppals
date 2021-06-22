

export const parseQuery = (notParsedUrl: string): any => {
    let locQuery = {};
    let pairs = notParsedUrl.substr(notParsedUrl.indexOf('?') + 1).split('&');
    for (var i = 0; i < pairs.length; i++) {
        let pair = pairs[i].split('=');
        locQuery[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return locQuery;
};