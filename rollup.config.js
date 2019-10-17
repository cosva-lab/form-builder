import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import resolve from 'rollup-plugin-node-resolve';
import { terser as minify } from 'rollup-plugin-terser';

export default [
  {
    input: 'build/esm/index.js',
    onwarn: function(warning) {
      // Skip certain warnings

      // should intercept ... but doesn't in some rollup versions
      if (warning.code === 'THIS_IS_UNDEFINED') {
        return;
      }

      // console.warn everything else
      console.warn(warning.message);
    },
    output: [
      {
        file: 'build/umd/form-builder.development.js',
        format: 'umd',
        name: 'FormBuilder',
        exports: 'named',
        sourcemap: true,
      },
    ],
    options: {
      context: 'this',
    },
    plugins: [
      external(),
      resolve(),
      commonjs({
        include: 'node_modules/**',
        namedExports: {
          'node_modules/react-is/index.js': [
            'ForwardRef',
            'isValidElementType',
          ],
        },
        ignoreGlobal: true,
      }),
    ],
  },
];
