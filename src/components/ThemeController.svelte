<script lang="ts">
let theme = $state("editorial-light");

function applyTheme(nextTheme: "editorial-light" | "editorial-dark") {
	theme = nextTheme;
	document.documentElement.setAttribute("data-theme", nextTheme);
	localStorage.setItem("theme", nextTheme);
}

$effect(() => {
	const current = document.documentElement.getAttribute("data-theme");
	theme = current === "editorial-dark" ? "editorial-dark" : "editorial-light";
});
</script>

<button
	type="button"
	class="flex size-10 items-center justify-center border border-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
	aria-label={theme === "editorial-dark" ? "Use light theme" : "Use dark theme"}
	onclick={() => applyTheme(theme === "editorial-dark" ? "editorial-light" : "editorial-dark")}
>
	{#if theme === "editorial-dark"}
		<svg class="size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
			<circle cx="12" cy="12" r="4" />
			<path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
		</svg>
	{:else}
		<svg class="size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
			<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
		</svg>
	{/if}
</button>
