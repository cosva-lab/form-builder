import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import resolve from 'rollup-plugin-node-resolve';

export default [
  {
    input: 'lib/index.js',
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
      {
        file: 'build/umd/form-builder.production.min.js',
        format: 'umd',
        exports: 'named',
        name: 'FormBuilder',
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
