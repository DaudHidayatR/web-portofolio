<script lang="ts">
interface Project {
	id: string;
	title: string;
	description: string;
	category: string;
	categoryLabel?: string;
	startDate: string;
	endDate?: string;
	skills: string[];
	demoLink?: string;
	sourceLink?: string;
	href: string;
	image: string;
}

interface Props {
	project: Project;
	view: string;
	period: string;
}

const { project, view, period }: Props = $props();
</script>

<article class={`editorial-frame bg-base-100 ${view === "list" ? "md:flex" : ""}`}>
	<a href={project.href}>
		<figure class={view === "grid" ? "aspect-video" : "aspect-video md:h-full md:w-72"}>
			<img
				alt={project.title}
				class="h-full w-full object-cover"
				decoding="async"
				loading="lazy"
				src={project.image}
			/>
		</figure>
	</a>
	<div class="p-6">
		<h3 class="text-xl font-bold">
			<a href={project.href}>{project.title}</a>
		</h3>
		<div class="flex flex-wrap items-center gap-2">
			<time class="editorial-muted text-sm">{period}</time>
			{#if project.categoryLabel}
				<span class="border-l editorial-rule pl-2 text-sm">{project.categoryLabel}</span>
			{/if}
		</div>
		<p class="editorial-secondary">{project.description}</p>
		<ul class="editorial-muted mt-3 flex flex-wrap gap-x-2 text-sm">
			{#each project.skills as skill, index}<li>{skill}{index < project.skills.length - 1 ? " /" : ""}</li>{/each}
		</ul>
		<div class="mt-5 flex flex-wrap justify-end gap-2">
			{#if project.demoLink}
				<a
					class="editorial-action-link"
					href={project.demoLink}
					rel="noopener noreferrer"
					target="_blank"
				>
					Demo
				</a>
			{/if}
			{#if project.sourceLink}
				<a
					class="editorial-action-link"
					href={project.sourceLink}
					rel="noopener noreferrer"
					target="_blank"
				>
					Source
				</a>
			{/if}
			<a class="editorial-action" href={project.href}>View</a>
		</div>
	</div>
</article>
