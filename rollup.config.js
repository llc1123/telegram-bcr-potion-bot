import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import nodePolyfills from 'rollup-plugin-node-polyfills'

export default {
  input: 'dist/app.js',
  output: {
    file: 'app.js',
    format: 'iife',
    plugins: [terser()],
  },
  plugins: [nodePolyfills(), json(), resolve(), commonjs()],
}
