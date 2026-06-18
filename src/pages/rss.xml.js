import { getCollection } from "astro:content";
import rss from "@astrojs/rss";

export async function GET(context) {
	const posts = await getCollection("blog");

	return rss({
		title: "Daud Hidayat Ramadhan",
		description:
			"Backend engineering, DevSecOps, cloud infrastructure, Go, Kubernetes, and GCP notes from Daud Hidayat Ramadhan.",
		site: context.site,
		items: posts
			.sort(
				(a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
			)
			.map((post) => ({
				title: post.data.title,
				description: post.data.description,
				pubDate: post.data.publishDate,
				link: `/blog/${post.id}/`,
			})),
	});
}
