# Github Notification Manager

A Chrome extension to help you manage your github notifications

I find myself doing this quite often

![Clicking notifications](https://user-images.githubusercontent.com/15983736/44427702-351d9080-a58a-11e8-8d06-2de92987eb9c.gif)

Wouldn't it be good if there was a way to do this with a single click...

### Development Quick Start

```bash
# clone repository
git clone https://github.com/samhstn/github_notifications_manager.git
cd github_notifications_manager
# install dependencies
npm install
# create the bundle
npm run build
```

+ In a chrome browser go to: `chrome://extensions`
+ Ensure Developer mode is on
+ Click `Load Unpacked`
+ Select the `dist` directory in this repository

### File Structure

```
├── src # these files are bundled into the dist directory
     ├── background.js # Runs in the background, this file runs once when you start chrome
     ├── content.js # Runs once per browser tab or window
     └── popup.js # Runs every time the browser extension icon is clicked
├── dist # bundled extension
├── server # used to replicate how the github webpage should behave
     └── public # contains html views
├── rollup.config.js # config for the bundling of src files
└── README.md
```

### Environment envs

For local development:

```bash
export PORT=4444
export NOTIFICATIONS_ROUTE=/notifications.html
export DOMAIN=http://localhost:$PORT
export NOTIFICATION_REPO_SELECTOR=.notification-repo_link
export NOTIFICATION_ELEMENT_SELECTOR=.list-group-item-link
```

In production:

```bash
export NOTIFICATIONS_ROUTE=/notifications
export DOMAIN=https://github.com
export NOTIFICATION_REPO_SELECTOR=.notification-repo_link
export NOTIFICATION_ELEMENT_SELECTOR=.list-group-item-link
```
