<script lang="ts">
interface Props {
	enableSelector: boolean;
}

const { enableSelector }: Props = $props();
const themes = [
	{ value: "light", label: "Light" },
	{ value: "dark", label: "Dark" },
	{ value: "retro", label: "Retro" },
	{ value: "dim", label: "Dim" },
];

let theme = $state("dim");

function applyTheme(nextTheme: string) {
	theme = nextTheme;
	document.documentElement.setAttribute("data-theme", nextTheme);
	localStorage.setItem("theme", nextTheme);
}

$effect(() => {
	theme =
		localStorage.getItem("theme") ??
		document.documentElement.getAttribute("data-theme") ??
		"dim";
});
</script>

{#if enableSelector}
	<div class="dropdown dropdown-end">
		<button type="button" tabindex="0" class="btn btn-ghost btn-circle" aria-label="Select color theme">
			<svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
				<circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
				<circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
				<circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
				<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.5-.7 1.5-1.5 0-.4-.2-.8-.4-1.1-.3-.4-.4-.8-.4-1.4 0-1.1.9-2 2-2H16c3.3 0 6-2.7 6-6 0-4.4-4.5-8-10-8Z" />
			</svg>
		</button>
		<ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg">
			{#each themes as item}
				<li>
					<label class="flex cursor-pointer items-center gap-2">
						<input
							type="radio"
							name="theme"
							class="radio radio-sm"
							value={item.value}
							checked={theme === item.value}
							onchange={() => applyTheme(item.value)}
						/>
						<span>{item.label}</span>
					</label>
				</li>
			{/each}
		</ul>
	</div>
{:else}
	<label class="swap swap-rotate">
		<span class="sr-only">Toggle color theme</span>
		<input
			type="checkbox"
			checked={theme === "dim"}
			aria-label="Toggle color theme"
			onchange={(event) => applyTheme(event.currentTarget.checked ? "dim" : "light")}
		/>
		<svg class="swap-off h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
		</svg>
		<svg class="swap-on h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
		</svg>
	</label>
{/if}
