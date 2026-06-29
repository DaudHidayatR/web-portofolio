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

<article class={`card bg-base-100 shadow-xl transition-shadow hover:shadow-2xl ${view === "list" ? "md:card-side" : ""}`}>
	<a class="transition-opacity hover:opacity-80" href={project.href}>
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
	<div class="card-body">
		<h3 class="card-title transition-colors hover:text-primary">
			<a href={project.href}>{project.title}</a>
		</h3>
		<div class="flex flex-wrap items-center gap-2">
			<time class="text-sm text-base-content/60">{period}</time>
			{#if project.categoryLabel}
				<span class="badge badge-outline badge-sm">{project.categoryLabel}</span>
			{/if}
		</div>
		<p class="text-base-content/80">{project.description}</p>
		<div class="mt-2 flex flex-wrap gap-2">
			{#each project.skills as skill}
				<span class="badge badge-accent badge-soft badge-sm">{skill}</span>
			{/each}
		</div>
		<div class="card-actions mt-4 justify-end gap-2">
			{#if project.demoLink}
				<a
					class="btn btn-sm btn-soft gap-1"
					href={project.demoLink}
					rel="noopener noreferrer"
					target="_blank"
				>
					Demo
				</a>
			{/if}
			{#if project.sourceLink}
				<a
					class="btn btn-sm btn-soft gap-1"
					href={project.sourceLink}
					rel="noopener noreferrer"
					target="_blank"
				>
					Source
				</a>
			{/if}
			<a class="btn btn-sm btn-primary" href={project.href}>View</a>
		</div>
	</div>
</article>
