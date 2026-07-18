<script lang="ts">
interface Props {
	image: string;
	alt: string;
}

const { image, alt }: Props = $props();
let open = $state(false);
</script>

<button
	type="button"
	class="block w-full cursor-zoom-in"
	aria-label={`Zoom image: ${alt}`}
	onclick={() => (open = true)}
>
	<slot />
</button>

{#if open}
	<div class="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-base-content/75 p-3 sm:p-6" role="dialog" aria-modal="true" aria-label={`Zoomed image: ${alt}`}>
		<div class="relative z-10 m-auto max-h-full max-w-[96vw] rounded-box border editorial-rule bg-base-100 p-3">
			<div class="mb-3 flex justify-end">
				<button class="editorial-action-secondary size-10 min-h-10 justify-center p-0" aria-label="Close image zoom" type="button" onclick={() => (open = false)}>
					x
				</button>
			</div>
			<img
				alt={alt}
				class="max-h-[calc(100vh-7rem)] max-w-[calc(100vw-2rem)] rounded-box object-contain sm:max-h-[calc(100vh-9rem)]"
				decoding="async"
				loading="lazy"
				src={image}
			/>
		</div>
		<button class="absolute inset-0 cursor-default" aria-label="Close image zoom" type="button" onclick={() => (open = false)}></button>
	</div>
{/if}
