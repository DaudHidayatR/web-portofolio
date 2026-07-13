<script lang="ts">
interface Slide {
	id: string;
	label: string;
	shortLabel?: string;
}

interface Props {
	slides: Slide[];
}

const { slides }: Props = $props();
let activeId = $state(slides[0]?.id ?? "");
const activeIndex = $derived(Math.max(0, slides.findIndex((slide) => slide.id === activeId)));
const progress = $derived(slides.length > 1 ? activeIndex / (slides.length - 1) : 1);

function isInteractiveTarget(target: EventTarget | null) {
	return target instanceof Element && Boolean(target.closest("input, textarea, select, button, a, summary, [contenteditable]:not([contenteditable='false'])"));
}

function scrollToSlide(index: number, reducedMotion: boolean) {
	const slide = slides[index];
	if (!slide) return false;

	document.getElementById(slide.id)?.scrollIntoView({
		block: "start",
		behavior: reducedMotion ? "auto" : "smooth",
	});
	return true;
}

$effect(() => {
	const elements = slides
		.map((slide) => document.getElementById(slide.id))
		.filter((element): element is HTMLElement => element !== null);
	if (elements.length === 0) return;

	const hashedId = window.location.hash.slice(1);
	if (slides.some((slide) => slide.id === hashedId)) activeId = hashedId;

	const ratios = new Map(elements.map((element) => [element.id, 0]));
	const updateActiveSlide = () => {
		const viewportCenter = window.innerHeight / 2;
		const visible = elements.filter((element) => (ratios.get(element.id) ?? 0) > 0);
		if (visible.length === 0) return;

		const next = visible.toSorted((a, b) => {
			const ratioDifference = (ratios.get(b.id) ?? 0) - (ratios.get(a.id) ?? 0);
			if (Math.abs(ratioDifference) > 0.15) return ratioDifference;
			const aRect = a.getBoundingClientRect();
			const bRect = b.getBoundingClientRect();
			const aDistance = Math.abs((Math.max(aRect.top, 0) + Math.min(aRect.bottom, window.innerHeight)) / 2 - viewportCenter);
			const bDistance = Math.abs((Math.max(bRect.top, 0) + Math.min(bRect.bottom, window.innerHeight)) / 2 - viewportCenter);
			return aDistance - bDistance;
		})[0];

		if (next.id === activeId) return;
		activeId = next.id;
		if (window.location.hash !== `#${next.id}`) {
			window.history.replaceState(window.history.state, "", `#${next.id}`);
		}
	};

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) ratios.set(entry.target.id, entry.intersectionRatio);
			updateActiveSlide();
		},
		{ threshold: [0, 0.15, 0.3, 0.5, 0.7, 0.9, 1] },
	);
	for (const element of elements) observer.observe(element);

	const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
	const handleKeydown = (event: KeyboardEvent) => {
		if (
			event.defaultPrevented ||
			event.ctrlKey ||
			event.altKey ||
			event.metaKey ||
			event.shiftKey ||
			isInteractiveTarget(event.target) ||
			document.querySelector("dialog[open]")
		) return;

		let targetIndex: number | undefined;
		switch (event.key) {
			case "ArrowDown":
			case "PageDown":
				targetIndex = activeIndex + 1;
				break;
			case "ArrowUp":
			case "PageUp":
				targetIndex = activeIndex - 1;
				break;
			case "Home":
				targetIndex = 0;
				break;
			case "End":
				targetIndex = slides.length - 1;
				break;
			default:
				return;
		}

		if (targetIndex >= 0 && targetIndex < slides.length && scrollToSlide(targetIndex, reducedMotion.matches)) {
			event.preventDefault();
		}
	};
	window.addEventListener("keydown", handleKeydown);

	return () => {
		observer.disconnect();
		window.removeEventListener("keydown", handleKeydown);
	};
});
</script>

<div class="pointer-events-none fixed inset-x-0 top-0 z-30 h-0.5 bg-base-content/10 lg:hidden" aria-hidden="true">
	<div class="h-full origin-left bg-primary transition-transform duration-200 motion-reduce:transition-none" style={`transform: scaleX(${progress})`}></div>
</div>

<nav aria-label="Homepage sections" class="fixed left-[max(1rem,env(safe-area-inset-left))] top-1/2 z-30 hidden -translate-y-1/2 lg:block">
	<div class="rounded-box border border-base-content/10 bg-base-100/85 px-2 py-3 shadow-lg backdrop-blur-sm">
		<ol class="flex flex-col gap-1">
			{#each slides as slide, index}
				<li>
					<a
						href={`#${slide.id}`}
						aria-current={slide.id === activeId ? "location" : undefined}
						aria-label={`${String(index + 1).padStart(2, "0")}: ${slide.label}`}
						class="group flex min-h-9 items-center gap-2 rounded-field px-2 text-xs font-medium text-base-content/60 outline-offset-2 transition-colors hover:bg-base-200 hover:text-base-content focus-visible:outline-2 focus-visible:outline-primary aria-[current=location]:bg-primary aria-[current=location]:text-primary-content"
					>
						<span class="w-5 font-mono tabular-nums">{String(index + 1).padStart(2, "0")}</span>
						<span class={`overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-200 motion-reduce:transition-none ${slide.id === activeId ? "max-w-32 opacity-100" : "max-w-0 opacity-0 group-hover:max-w-32 group-hover:opacity-100 group-focus-visible:max-w-32 group-focus-visible:opacity-100"}`}>
							{slide.shortLabel ?? slide.label}
						</span>
					</a>
				</li>
			{/each}
		</ol>
		<div class="mx-2 my-2 h-12 w-px overflow-hidden bg-base-content/15" aria-hidden="true">
			<div class="h-full origin-top bg-primary transition-transform duration-200 motion-reduce:transition-none" style={`transform: scaleY(${progress})`}></div>
		</div>
		<p class="px-2 text-center font-mono text-[0.65rem] tabular-nums text-base-content/60" aria-live="polite">
			{String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
		</p>
	</div>
</nav>
