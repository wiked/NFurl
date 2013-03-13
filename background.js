var doNFurl = false;

function nfurl_urlCheck(url, str) {
    return url.toLowerCase().indexOf(str) > -1;
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {        
    if ((nfurl_urlCheck(tab.url, "/iweb/") || nfurl_urlCheck(tab.url, "/eweb/")) && nfurl_urlCheck(tab.url, "?")) {
        chrome.browserAction.setPopup({ tabId: tab.id, popup: "popup.html" });
        chrome.browserAction.enable(tab.id);
    }
    else
    {    
        chrome.browserAction.disable(tab.id);
    }

});