import { build } from 'esbuild';


(async () => {
    await build({
        entryPoints: ['src/scripts/content.ts', 'src/scripts/service-worker.ts', 'src/popup/popup.ts'],
        outdir: 'dist',
        bundle: true,
        platform: 'browser'
    })
})();