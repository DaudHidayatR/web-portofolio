import rss from "@astrojs/rss";

export async function GET(context) {
	return rss({
		title: "Daud Hidayat Ramadhan",
		description:
			"Portfolio feed is temporarily disabled while the blog is hidden.",
		site: context.site,
		items: [],
	});
}
