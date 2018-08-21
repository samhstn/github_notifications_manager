const GNM_DOMAIN = process.env.GNM_DOMAIN;
const GNM_NOTIFICATIONS_ROUTE = process.env.GNM_NOTIFICATIONS_ROUTE;

function readAllNotifications (_e) {
  chrome.runtime.sendMessage({name: 'read_all_notifications'});
}

chrome.extension
  .connect({name: 'tab_url'})
  .onMessage.addListener((tabUrl, _port) => {
    if (tabUrl === `${GNM_DOMAIN}${GNM_NOTIFICATIONS_ROUTE}`) {
      chrome.extension
        .connect({name: 'popup_notifications'})
        .onMessage.addListener((notifications) => {
          const html = notifications.map((n) => {
            return `
              <h4>${Object.keys(n)[0]}</h4>
              <div>
                <p>
                  ${
                    Object.values(n)[0]
                      .map(({name}) => name)
                      .join('</p><p>')
                  }
                </p>
              </div>
            `;
          }).join('</div><div>');

          document.querySelector('#app').innerHTML = `
            <div>
              ${html}
            </div>
            <button id="read-all-notifications">Read all notifications</button>
          `;

          document.querySelector('#read-all-notifications').addEventListener('click', readAllNotifications);
        });
    } else {
      document.querySelector('#app').innerHTML = '<button id="to_notifications">Go to notifications</button>';
      document.querySelector('#to_notifications').addEventListener('click', (_e) => {
        chrome.runtime.sendMessage({name: 'open_url', payload: `${GNM_DOMAIN}${GNM_NOTIFICATIONS_ROUTE}`});
      });
    }
  });
