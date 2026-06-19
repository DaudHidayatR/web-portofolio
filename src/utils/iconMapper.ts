import {
	BookOpen,
	Briefcase,
	CodeXml,
	FileText,
	Flower2,
	Folder,
	FolderCode,
	GraduationCap,
	Hammer,
	Heart,
	Home,
	Lightbulb,
	Link,
	Mail,
	MessageCircleCode,
	MessageSquare,
	Phone,
	Pickaxe,
	Rocket,
	Send,
	Star,
	Terminal,
	User,
	Wrench,
} from "@lucide/astro";
import Bluesky from "../components/icons/Bluesky.astro";
// Social media icon components
import GitHub from "../components/icons/GitHub.astro";
import Instagram from "../components/icons/Instagram.astro";
import LinkedIn from "../components/icons/LinkedIn.astro";
import Twitter from "../components/icons/Twitter.astro";
import YouTube from "../components/icons/YouTube.astro";

export type IconName =
	| "Flower2"
	| "BookOpen"
	| "FileText"
	| "CodeXml"
	| "Mail"
	| "Home"
	| "User"
	| "Briefcase"
	| "GraduationCap"
	| "Star"
	| "Heart"
	| "Lightbulb"
	| "Rocket"
	| "Folder"
	| "Terminal"
	| "Link"
	| "MessageCircleCode"
	| "Phone"
	| "MessageSquare"
	| "Send"
	| "Pickaxe"
	| "Hammer"
	| "Wrench"
	| "FolderCode"
	| "GitHub"
	| "LinkedIn"
	| "Twitter"
	| "Bluesky"
	| "Instagram"
	| "YouTube"
	| "Email";

// biome-ignore lint/suspicious/noExplicitAny: mixed Astro/Lucide component types are not unifiable in a single record
export const iconMap: Record<IconName, any> = {
	Flower2,
	BookOpen,
	FileText,
	CodeXml,
	Mail,
	Home,
	User,
	Briefcase,
	GraduationCap,
	Star,
	Heart,
	Lightbulb,
	Rocket,
	Folder,
	Terminal,
	Link,
	MessageCircleCode,
	Phone,
	MessageSquare,
	Send,
	Pickaxe,
	Hammer,
	Wrench,
	FolderCode,
	GitHub,
	LinkedIn,
	Twitter,
	Bluesky,
	Instagram,
	YouTube,
	Email: Mail,
};

export function getIcon(iconName: IconName) {
	return iconMap[iconName];
}
