<script lang="ts">
    import { page } from '$app/stores';
    import { base } from '$app/paths'; // use base path for correct linking in production
</script>

<nav class="border-b border-slate-800 bg-slate-950 sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
            <a href="{base}/" class="flex items-center gap-2 hover:text-blue-400 transition-colors">
                <span class="text-xl font-bold text-white">🎵 MusicToolkit</span>
            </a>

            <div class="flex items-center gap-8">
                <a
                    href="{base}/"
                    class="text-slate-400 hover:text-white transition-colors {$page.url.pathname === `${base}/`
                        ? 'text-white border-b-2 border-blue-500'
                        : ''}"
                >
                    Home
                </a>
                <a
                    href="{base}/tools"
                    class="text-slate-400 hover:text-white transition-colors {$page.url.pathname.startsWith(
                        `${base}/tools`
                    )
                        ? 'text-white border-b-2 border-blue-500'
                        : ''}"
                >
                    Tools
                </a>
                <a
                    href="{base}/learn"
                    class="text-slate-400 hover:text-white transition-colors {$page.url.pathname.startsWith(
                        `${base}/learn`
                    )
                        ? 'text-white border-b-2 border-blue-500'
                        : ''}"
                >
                    Learn
                </a>
                <a
                    href="{base}/games"
                    class="text-slate-400 hover:text-white transition-colors {$page.url.pathname.startsWith(
                        `${base}/games`
                    )
                        ? 'text-white border-b-2 border-blue-500'
                        : ''}"
                >
                    Games
                </a>
            </div>
        </div>
    </div>
</nav>