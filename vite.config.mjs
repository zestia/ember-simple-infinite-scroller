import { defineConfig } from 'vite';
import { extensions, ember, classicEmberSupport } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';

// For scenario testing
const isCompat = Boolean(process.env.ENABLE_COMPAT_BUILD);

export default defineConfig({
<<<<<<< HEAD
  resolve: {
    alias: [
      {
        find: '@zestia/ember-simple-infinite-scroller',
        replacement: `${__dirname}/src`
      }
    ]
  },
||||||| parent of 4ebc1eb (v0.10.0...v0.16.1)
  resolve: {
    alias: [
      {
        find: '@zestia/ember-simple-infinite-scroller',
        replacement: `${__dirname}/src`,
      },
    ],
  },
=======
>>>>>>> 4ebc1eb (v0.10.0...v0.16.1)
  plugins: [
    ...(isCompat ? [classicEmberSupport()] : []),
    ember(),
    babel({
      babelHelpers: 'inline',
      extensions
    })
  ],
  build: {
    rollupOptions: {
      input: {
        tests: 'tests/index.html'
      }
    }
  },
  define: {
    global: 'globalThis'
  }
});
