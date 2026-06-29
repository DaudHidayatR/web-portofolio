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
	<div class="modal modal-open" role="dialog" aria-label={`Zoomed image: ${alt}`}>
		<div class="modal-box max-w-[96vw] bg-base-100 p-3 shadow-2xl">
			<div class="mb-3 flex justify-end">
				<button class="btn btn-circle btn-sm" aria-label="Close image zoom" type="button" onclick={() => (open = false)}>
					x
				</button>
			</div>
			<img
				alt={alt}
				class="max-h-[82vh] w-full rounded-xl object-contain"
				decoding="async"
				loading="lazy"
				src={image}
			/>
		</div>
		<button class="modal-backdrop" aria-label="Close image zoom" type="button" onclick={() => (open = false)}></button>
	</div>
{/if}
