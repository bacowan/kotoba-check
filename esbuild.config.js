import { build } from 'esbuild';
import { copy } from 'esbuild-plugin-copy';
import alias from 'esbuild-plugin-alias';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
    await build({
        entryPoints: [
            'src/scripts/content.ts',
            'src/scripts/service-worker.ts',
            'src/popup/popup.ts',
            'src/visualizer/visualizer.ts',
            'src/options/options.ts'],
        outdir: 'dist',
        bundle: true,
        platform: 'browser',
        plugins: [
            alias({
                'kuromoji': join(__dirname, 'kuromoji', 'build', 'kuromoji.js'),
            }),
            copy({
                assets: [
                    {
                        from: ['./src/**/*.{html,css,json,png,svg}'],
                        to: ['./'],
                    },
                    {
                        from: ['./kuromoji/dict/*'],
                        to: ['./dict'],
                    },
                    {
                        from: ['./jmdict/jmdict.json'],
                        to: ['./jmdict'],
                    },
                ],
            })
        ]
    })
})();