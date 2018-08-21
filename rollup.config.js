import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

const GNM_DOMAIN = process.env.GNM_DOMAIN;
const GNM_NOTIFICATIONS_ROUTE = process.env.GNM_NOTIFICATIONS_ROUTE;

export default ['background', 'content', 'popup'].map((file) => {
  return {
    input: `src/${file}.js`,
    output: {
      file: `dist/${file}.js`,
      format: 'iife'
    },
    plugins: [
      replace({
        'process.env.GNM_DOMAIN': JSON.stringify(GNM_DOMAIN),
        'process.env.GNM_NOTIFICATIONS_ROUTE': JSON.stringify(GNM_NOTIFICATIONS_ROUTE),
      })
    ]
  }
}).concat(
  {
    input: 'github_environment/src/Notifications.bs.js',
    output: {
      file: 'github_environment/dist/notifications.js',
      format: 'iife',
      name: 'notifications',
      sourcemap: true
    },
    plugins: [
      commonjs({ include: 'node_modules/**' })
    ]
  }
)
