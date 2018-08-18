const Hapi = require('hapi');
const Inert = require('inert');
const assert = require('assert');

const server = Hapi.Server({ port: process.env.PORT || 4444 });

const initialNotifications = [
  {
    repoName: 'tcm-labs/micro-apps',
    repoHref: '/tcm-labs/micro-apps',
    repoNotifications: [
      {
        href: '/tcm-labs/micro-apps/pull/1',
        name: 'Fx forms autocomplete',
        markAsReadUrl: '/tcm-labs/micro-apps/notifications/mark?ids=1'
      }
    ]
  },
  {
    repoName: 'tcm-labs/tcm-infra',
    repoHref: '/tcm-labs/tcm-infra',
    repoNotifications: [
      {
        href: '/tcm-labs/tcm-infra/pull/1',
        name: 'Dynamic CI open to public',
        markAsReadUrl: '/tcm-labs/tcm-infra/notifications/mark?ids=1'
      },
      {
        href: '/tcm-labs/tcm-infra/pull/2',
        name: 'Infra: Investigate Postgress error on QA',
        markAsReadUrl: '/tcm-labs/tcm-infra/notifications/mark?ids=2'
      }
    ]
  }
]

let notificationsObj = initialNotifications;

const notifications = {
  get: () => notificationsObj,
  set: (obj) => { notificationsObj = obj; },
  reset: () => { notificationsObj = initialNotifications; }
}

const deleteNotification = ({repoName, id}, _notificationsObj) => {
  return _notificationsObj
    .map((n) => {
      if (n.repoName === repoName) {
        return Object.assign(
          {},
          n,
          {repoNotifications: deleteRepoNotifications(id, n.repoNotifications)}
        );
      } else {
        return n;
      }
    })
    .filter((n) => n.repoNotifications.length !== 0);
}

const deleteRepoNotifications = (id, repoNotifications) => {
  return repoNotifications
    .filter((rn) => {
      const hrefParts = rn.href.split('/');

      return parseInt(hrefParts[hrefParts.length - 1]) !== id;
    });
}


const routes = [
  {
    method: 'get',
    path: '/{param*}',
    handler: { directory: { path: 'github_environment/dist' } }
  },
  {
    method: 'post',
    path: '/{markAsReadUrl*}',
    handler: (request, h) => {
      const repoName = request.params.markAsReadUrl.split('/notifications/')[0];
      const id = parseInt(request.query.ids);
      notifications.set(deleteNotification({repoName, id}, notifications.get()));

      return {};
    }
  },
  {
    method: 'get',
    path: '/notifications',
    handler: (request, h) => {
      return h.file(`${__dirname}/../dist/notifications.html`);
    }
  },
  {
    method: 'get',
    path: '/api/notifications',
    handler: (request, h) => {
      return notifications.get();
    }
  },
  {
    method: 'post',
    path: '/api/notifications',
    handler: (request, h) => {
      notifications.reset();

      return {};
    }
  },
  {
    method: 'delete',
    path: '/api/notifications',
    handler: ({query: {repoName, id}} = request, h) => {
      notifications.set(deleteNotification({repoName, id: parseInt(id)}, notifications.get()));

      return {};
    }
  }
];

const setup = async () => {
  try {
    await server.register([Inert]);
    server.route(routes);
  } catch (err) {
    /* istanbul ignore next */
    assert(!err, err);
  }
}

module.exports = {
  server,
  setup,
  initialNotifications,
  notifications,
  deleteNotification,
  deleteRepoNotifications
};
