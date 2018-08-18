const repos_urls = [].map.call(document.querySelectorAll('.notifications-list > .boxed-group'), (elem) => {
  return {
    [elem.querySelector('.notifications-repo-link').innerHTML]: [].map.call(elem.querySelectorAll('.list-group-item-link'), (atag) => {return {name: atag.innerHTML, href: atag.href};})
  };
});

chrome.extension
  .connect({ name: 'content_notifications' })
  .postMessage(repos_urls);

chrome.runtime.onMessage.addListener((request, _sender, response) => {
  switch (request.name) {
    case 'click_notifications':
      document.querySelectorAll('.js-delete-notification > button').forEach((markAsReadButton) => {
        markAsReadButton.click();
      });
      break;
    default:
      console.log(request.name);
      console.log('------EXCEPTION------');
  }

  response();
});
