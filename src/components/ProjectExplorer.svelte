<script lang="ts">
import ProjectCardMini from "./ProjectCardMini.svelte";
interface Category {
	slug: string;
	title: string;
	icon?: string;
}

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
	projects: Project[];
	categories: Category[];
}

const { projects, categories }: Props = $props();

let query = $state("");
let selectedCategory = $state("all");
let selectedSkill = $state("all");
let sort = $state("newest");
let view = $state("grid");

const queryDefaults = {
	q: "",
	category: "all",
	skill: "all",
	sort: "newest",
	view: "grid",
};

if (typeof window !== "undefined") {
	const params = new URLSearchParams(window.location.search);
	query = params.get("q") ?? queryDefaults.q;
	selectedCategory = params.get("category") ?? queryDefaults.category;
	selectedSkill = params.get("skill") ?? queryDefaults.skill;
	sort = params.get("sort") ?? queryDefaults.sort;
	view = params.get("view") ?? queryDefaults.view;
}

$effect(() => {
	const params = new URLSearchParams();
	const values = {
		q: query.trim(),
		category: selectedCategory,
		skill: selectedSkill,
		sort,
		view,
	};

	for (const [key, value] of Object.entries(values)) {
		if (value !== queryDefaults[key as keyof typeof queryDefaults]) {
			params.set(key, value);
		}
	}

	const search = params.toString();
	const url = `${window.location.pathname}${search ? `?${search}` : ""}`;
	window.history.replaceState(null, "", url);
});

const skills = $derived(
	Array.from(new Set(projects.flatMap((project) => project.skills))).sort(),
);

const filteredProjects = $derived(
	projects
		.filter(
			(project) =>
				selectedCategory === "all" || project.category === selectedCategory,
		)
		.filter(
			(project) =>
				selectedSkill === "all" || project.skills.includes(selectedSkill),
		)
		.filter((project) => {
			const term = query.trim().toLowerCase();
			return (
				!term ||
				project.title.toLowerCase().includes(term) ||
				project.description.toLowerCase().includes(term) ||
				project.skills.some((skill) => skill.toLowerCase().includes(term))
			);
		})
		.toSorted((a, b) => {
			const order =
				new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
			return sort === "newest" ? order : -order;
		}),
);

function formatPeriod(startDate: string, endDate?: string) {
	const options: Intl.DateTimeFormatOptions = {
		month: "short",
		year: "numeric",
	};
	const start = new Date(startDate).toLocaleDateString("en-US", options);
	const end = endDate
		? new Date(endDate).toLocaleDateString("en-US", options)
		: "Present";
	return `${start} - ${end}`;
}
</script>

<section class="space-y-8">
	<div class="card bg-base-200 shadow-sm">
		<div class="card-body gap-4">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-4">
				<label class="form-control md:col-span-2">
					<span class="label-text mb-1">Search projects</span>
					<input
						bind:value={query}
						class="input input-bordered w-full"
						placeholder="Search title, description, or skill"
						type="search"
					/>
				</label>

				<label class="form-control">
					<span class="label-text mb-1">Category</span>
					<select bind:value={selectedCategory} class="select select-bordered w-full">
						<option value="all">All categories</option>
						{#each categories as category}
							<option value={category.slug}>{category.icon ?? ""} {category.title}</option>
						{/each}
						<option value="_other">Other</option>
					</select>
				</label>

				<label class="form-control">
					<span class="label-text mb-1">Skill</span>
					<select bind:value={selectedSkill} class="select select-bordered w-full">
						<option value="all">All skills</option>
						{#each skills as skill}
							<option value={skill}>{skill}</option>
						{/each}
					</select>
				</label>
			</div>

			<div class="flex flex-wrap items-center justify-between gap-3">
				<p class="text-sm text-base-content/70">
					{filteredProjects.length} of {projects.length} projects shown
				</p>
				<div class="flex flex-wrap gap-2">
					<select bind:value={sort} class="select select-bordered select-sm">
						<option value="newest">Newest first</option>
						<option value="oldest">Oldest first</option>
					</select>
					<div class="join">
						<button
							aria-pressed={view === "grid"}
							class={`btn btn-sm join-item ${view === "grid" ? "btn-primary" : "btn-soft"}`}
							type="button"
							onclick={() => (view = "grid")}
						>
							Grid
						</button>
						<button
							aria-pressed={view === "list"}
							class={`btn btn-sm join-item ${view === "list" ? "btn-primary" : "btn-soft"}`}
							type="button"
							onclick={() => (view = "list")}
						>
							List
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	{#if filteredProjects.length > 0}
		<div class={view === "grid" ? "grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3" : "space-y-6"}>
			{#each filteredProjects as project}
				<ProjectCardMini {project} {view} period={formatPeriod(project.startDate, project.endDate)} />
			{/each}
		</div>
	{:else}
		<div class="py-20 text-center">
			<p class="text-2xl text-base-content/60">No projects match these filters.</p>
		</div>
	{/if}
</section>
