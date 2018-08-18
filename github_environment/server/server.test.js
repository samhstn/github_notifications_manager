const tape = require('tape');
const {
  server,
  setup,
  initialNotifications,
  notifications,
  deleteNotification,
  deleteRepoNotifications
} = require('../server/server.js');

tape('setup', async (t) => {
  await setup();
  t.end();
});

[
  {route: '/', payload: '<h1>Hello World</h1>'},
  {route: '/notifications', payload: 'Environment'}
].forEach(({route, payload}) => {
  tape(`GET :: ${route}`, async (t) => {
    const res = await server.inject(route);

    t.equal(res.statusCode, 200);
    t.ok(res.payload.includes(payload))
    t.end();
  });
});

tape('GET :: /tcm-labs/tcm-infra/pull/2 generic endpoint', async (t) => {
  const res = await server.inject('/tcm-labs/tcm-infra/pull/2');

  t.equal(res.statusCode, 404);
  t.end();
});

tape('GET :: /api/notifications', async (t) => {
  const res = await server.inject('/api/notifications');

  t.deepEqual(res.result, initialNotifications);
  t.end();
});

tape('DELETE :: /api/notifications?repoName=tcm-labs/micro-apps&id=1', async (t) => {
  const res = await server.inject(
    {
      method: 'DELETE',
      url: '/api/notifications?repoName=tcm-labs/micro-apps&id=1'
    }
  );

  t.deepEqual(res.result, {});

  t.deepEqual(notifications.get(), initialNotifications.slice(1, initialNotifications.length));

  notifications.reset();

  t.end();
});

tape('POST :: /api/notifications :: resets notifications to initial state', async (t) => {
  t.deepEqual(notifications.get(), initialNotifications);

  notifications.set({});

  t.deepEqual(notifications.get(), {});

  const res = await server.inject({method: 'POST', url: '/api/notifications'});

  t.deepEqual(res.result, {});

  t.deepEqual(notifications.get(), initialNotifications);

  t.end();
});

tape('deleteNotification :: existing notification', (t) => {
  notification = {
    repoName: 'tcm-labs/micro-apps',
    id: 1
  };

  newNotifications = deleteNotification(notification, initialNotifications);

  t.deepEqual(newNotifications, initialNotifications.slice(1, initialNotifications.length));
  t.end();
});

tape.skip('deleteNotification :: non existing notification', (t) => {
  notification = {
    repoName: 'tcm-labs/micro-apps',
    id: 1
  };

  newNotifications = deleteNotification(notification, initialNotifications);

  t.deepEqual(newNotifications, initialNotifications);
  t.end();
});

tape('deleteRepoNotifications', (t) => {
  repoNotifications = [
    {
      href: '/tcm-labs/tcm-infra/pull/1'
    },
    {
      href: '/tcm-labs/tcm-infra/pull/2'
    }
  ]

  actual = deleteRepoNotifications(1, repoNotifications);
  expected = [{href: '/tcm-labs/tcm-infra/pull/2'}]
  t.deepEqual(actual, expected);
  t.end();
});
