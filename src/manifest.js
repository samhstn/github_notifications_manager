// writes the extension manifest.json file
// this is needed as we would like to reference environment variables

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const GNM_DOMAIN = process.env.GNM_DOMAIN;

assert(GNM_DOMAIN, 'GNM_DOMAIN environment variable should be defined');

const manifest = {
  "name": "Github Notification Manager",
  "description": "Opens github notifications",
  "icons": {"128": "logo.png"},
  "background": {
    "scripts": ["background.js"],
    "persistent": false
  },
  "browser_action": {
    "default_icon": "logo.png",
    "default_title": "Github Notification Manager",
    "default_popup": "popup.html"
  },
  "content_scripts": [{
    "matches": [`${GNM_DOMAIN}/*`],
    "js": ["content.js"]
  }],
  "version": "1.0",
  "permissions": ["tabs", "activeTab", "*://*/*"],
  "manifest_version": 2
}

fs.writeFile(
  path.join(__dirname, '..', 'dist', 'manifest.json'),
  JSON.stringify(manifest),
  (err) => {
    assert(!err, err);
  }
);
