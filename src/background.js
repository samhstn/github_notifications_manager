let tabUrl;
let activeTabId;
let notifications;

chrome.tabs.onActivated.addListener(({tabId}) => {
  activeTabId = tabId
  chrome.tabs.get(tabId, ({url}) => { tabUrl = url; });
});
chrome.tabs.onUpdated.addListener((tabId, _updateInfo, {url}) => {
  activeTabId = tabId;
  tabUrl = url;
});
chrome.tabs.onCreated.addListener(({url, tabId}) => {
  activeTabId = tabId;
  tabUrl = url;
});

chrome.extension.onConnect.addListener((port) => {
  switch (port.name) {
    case 'tab_url':
      port.postMessage(tabUrl);
      break;
    case 'content_notifications':
      port.onMessage.addListener((notifications_obj) => {
        notifications = notifications_obj;
      });
      break;
    case 'popup_notifications':
      port.postMessage(notifications);
      break;
    default:
      console.log(port.name);
      console.log('------EXCEPTION------');
  }
});

chrome.runtime.onMessage.addListener((request, _sender, response) => {
  switch (request.name) {
    case 'open_url':
      chrome.tabs.create({url: request.payload});
      break;
    case 'read_all_notifications':
      chrome.tabs.sendMessage(activeTabId, {name: 'click_notifications'}, () => {
        notifications.forEach((notification) => {
          Object.values(notification)[0].forEach(({href}) => {
            chrome.tabs.create({url: href});
          });
        });
      });
      break;
    default:
      console.log(request.name);
      console.log('------EXCEPTION------');
  }

  response();
});
