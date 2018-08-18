import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default ['background', 'content', 'popup'].map((file) => {
  return {
    input: `src/${file}.js`,
    output: {
      file: `dist/${file}.js`,
      format: 'iife'
    }
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
