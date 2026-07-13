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
let activeId = $state("");
const activeIndex = $derived(Math.max(0, slides.findIndex((slide) => slide.id === activeId)));
const progress = $derived(slides.length > 0 ? (activeIndex + 1) / slides.length : 0);

function isInteractiveTarget(target: EventTarget | null) {
	return target instanceof Element && Boolean(target.closest("input, textarea, select, button, a, summary, [role='button'], [role='link'], [contenteditable]:not([contenteditable='false'])"));
}

function findActiveSection(elements: HTMLElement[]) {
	const viewportCenter = window.innerHeight / 2;
	const containingCenter = elements.find((element) => {
		const rect = element.getBoundingClientRect();
		return rect.top <= viewportCenter && rect.bottom >= viewportCenter;
	});

	if (containingCenter) return containingCenter;

	return elements.reduce((closest, element) => {
		const closestRect = closest.getBoundingClientRect();
		const elementRect = element.getBoundingClientRect();
		const closestDistance = Math.min(
			Math.abs(closestRect.top - viewportCenter),
			Math.abs(closestRect.bottom - viewportCenter),
		);
		const elementDistance = Math.min(
			Math.abs(elementRect.top - viewportCenter),
			Math.abs(elementRect.bottom - viewportCenter),
		);

		return elementDistance < closestDistance ? element : closest;
	});
}

function scrollToSlide(index: number, reducedMotion: boolean) {
	const slide = slides[index];
	if (!slide) return false;

	const element = document.getElementById(slide.id);
	if (!element) return false;

	element.scrollIntoView({
		block: "start",
		behavior: reducedMotion ? "auto" : "smooth",
	});
	return true;
}

function navigateToSlide(index: number, reducedMotion: boolean) {
	const slide = slides[index];
	if (!slide) return false;

	const element = document.getElementById(slide.id);
	if (!element) return false;

	if (window.location.hash !== `#${slide.id}`) {
		window.history.pushState(window.history.state, "", `#${slide.id}`);
	}

	element.scrollIntoView({
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

	const updateActiveSlide = () => {
		const next = findActiveSection(elements);
		if (next.id !== activeId) activeId = next.id;
	};

	let observer: IntersectionObserver | undefined;
	const observeViewportCenter = () => {
		observer?.disconnect();
		const centerMargin = Math.max(0, window.innerHeight / 2 - 1);
		observer = new IntersectionObserver(updateActiveSlide, {
			rootMargin: `-${centerMargin}px 0px -${centerMargin}px 0px`,
			threshold: 0,
		});
		for (const element of elements) observer.observe(element);
		updateActiveSlide();
	};
	observeViewportCenter();

	const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
	const handleHistoryNavigation = () => {
		const targetIndex = slides.findIndex((slide) => `#${slide.id}` === window.location.hash);
		if (targetIndex >= 0) scrollToSlide(targetIndex, reducedMotion.matches);
	};
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

		if (targetIndex >= 0 && targetIndex < slides.length && navigateToSlide(targetIndex, reducedMotion.matches)) {
			event.preventDefault();
		}
	};
	window.addEventListener("keydown", handleKeydown);
	window.addEventListener("popstate", handleHistoryNavigation);
	window.addEventListener("resize", observeViewportCenter);

	return () => {
		observer?.disconnect();
		window.removeEventListener("keydown", handleKeydown);
		window.removeEventListener("popstate", handleHistoryNavigation);
		window.removeEventListener("resize", observeViewportCenter);
	};
});
</script>

<div class="pointer-events-none fixed inset-x-0 top-[env(safe-area-inset-top)] z-30 h-0.5 bg-base-content/10 lg:hidden" aria-hidden="true">
	<div class="h-full origin-left bg-primary transition-transform duration-200 motion-reduce:transition-none" style={`transform: scaleX(${progress})`}></div>
</div>

<nav aria-label="Homepage sections" class="fixed left-[max(0.5rem,env(safe-area-inset-left))] top-1/2 z-30 hidden -translate-y-1/2 lg:block">
	<div class="rounded-box border border-base-content/10 bg-base-100/85 p-2 shadow-lg backdrop-blur-sm">
		<ol class="flex flex-col gap-1">
			{#each slides as slide, index}
				<li class="tooltip tooltip-right" data-tip={slide.label}>
					<a
						href={`#${slide.id}`}
						title={slide.label}
						aria-current={slide.id === activeId ? "location" : undefined}
						aria-label={`${String(index + 1).padStart(2, "0")}: ${slide.label}`}
						class="flex size-9 items-center justify-center gap-2 rounded-field px-0 text-xs font-medium text-base-content/60 outline-offset-2 transition-colors hover:bg-base-200 hover:text-base-content focus-visible:outline-2 focus-visible:outline-primary aria-[current=location]:bg-primary aria-[current=location]:text-primary-content 2xl:w-auto 2xl:min-w-9 2xl:justify-start 2xl:px-2"
					>
						<span class="font-mono tabular-nums">{String(index + 1).padStart(2, "0")}</span>
						<span class={`hidden overflow-hidden whitespace-nowrap text-left transition-[max-width,opacity] duration-200 motion-reduce:transition-none 2xl:block ${slide.id === activeId ? "2xl:max-w-32 2xl:opacity-100" : "2xl:max-w-0 2xl:opacity-0"}`}>
							{slide.shortLabel ?? slide.label}
						</span>
					</a>
				</li>
			{/each}
		</ol>
		<div class="mx-auto my-2 h-12 w-px overflow-hidden bg-base-content/15" aria-hidden="true">
			<div class="h-full origin-top bg-primary transition-transform duration-200 motion-reduce:transition-none" style={`transform: scaleY(${progress})`}></div>
		</div>
		<p class="text-center font-mono text-[0.65rem] tabular-nums text-base-content/60" aria-hidden="true">
			{String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
		</p>
	</div>
</nav>
