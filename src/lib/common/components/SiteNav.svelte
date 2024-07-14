<script lang=ts>
    import { pathToLabel } from '$lib/common/transforms/text'
    import { writable } from 'svelte/store'
    import { page } from '$app/stores'
	import { onMount } from 'svelte'

    export let pathnames: `/${string}`[]
    export let root = "home"

    export const current = (() => {
        const { subscribe, set } = writable<string>()

        return {
            subscribe,
            set,
        }
    })()

    const links: HTMLAnchorElement[] = []

    onMount(() => {
        const checkCurrentPage = (target: HTMLAnchorElement) => {
            const { ariaCurrent, innerText: page} = target
            
            if (ariaCurrent === 'page') {
                console.log(target.innerHTML)
                current.set(page)
            }
        }

        const observer = new MutationObserver(mutations => {
            mutations.forEach(({ type, attributeName, target }) => {
                if (type !== 'attributes') return
                if (attributeName !== 'aria-current') return
                
                checkCurrentPage(target as HTMLAnchorElement)
            })
        })

        links.map(link => {
            checkCurrentPage(link)
            observer.observe(link, {
                attributes: true,
            })
        })
    })
</script>

<style lang=scss>
    ul, li {
        display: contents;
        font-size: inherit;
    }

    a {
        color: inherit;
        font-size: inherit;
        padding: 1rem .25rem;
        padding-bottom: 0;
        text-decoration: none;

        $emphasis: var(--color-emphasis);

        &[aria-current=page] {
            color: $emphasis;
        }

        &:hover {
            color: $emphasis;
            text-decoration: underline;
        }
    }
</style>

<nav>
    <ul>
        {#each pathnames as pathname, i}
            {@const current =  $page.url.pathname === pathname  ? 'page' : null}
            {@const label = pathToLabel(pathname, root)}

            <li>
                <a bind:this={links[i]} href={pathname} aria-current={current}>{label}</a>
            </li>
        {/each}
    </ul>
</nav>