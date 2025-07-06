import { build } from 'esbuild';
import alias from 'esbuild-plugin-alias';
import path from 'path';
import { fileURLToPath } from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

(async () => {
    await build({
        entryPoints: ['src/scripts/content.ts', 'src/scripts/service-worker.ts', 'src/popup/popup.ts'],
        outdir: 'dist',
        bundle: true,
        platform: 'browser'
    })
})();