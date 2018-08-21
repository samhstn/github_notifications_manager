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
# source the development environment variables
source .dev.env
# create the bundle
npm run build
```

+ In a chrome browser go to: `chrome://extensions`
+ Ensure Developer mode is on
+ Click `Load Unpacked`
+ Select the `dist` directory in this repository

Run the server:

```bash
npm run ghenv:start
```

The extension should work on http://localhost:4444

For local development it is good to have the following commands running in separate terminal windows:

```bash
# node server
npm run ghenv:start:watch
```

```bash
# bucklescript compiler
npm run build:bs:watch
```

```bash
# javascript bundler
npm run build:js:watch
```

### Production deployment

Same as above except source the production environment variables,
And no need to start the server

```bash
# source the development environment variables
source .prod.env
```

The extension should work on https://github.com

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
