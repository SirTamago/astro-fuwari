import {type LicenseConfig, LinkPreset, type NavBarConfig, type ProfileConfig, type SiteConfig,} from "./types/config";

export const siteConfig: SiteConfig = {
	title: "RimieLab",
	subtitle: 'blog',
	lang: "zh_CN", // 'en', 'zh_CN', 'zh_TW', 'ja', 'ko', 'es', 'th'
	themeColor: {
		hue: 50, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: true, // Hide the theme color picker for visitors
	},
	banner: {
		enable: true,
		src: "https://img.rimrose.work/__chihaya_anon_and_nagasaki_soyo_bang_dream_and_1_more_drawn_by_nightlemon__fb86ca1a32d298fce15b87b7ac6804ef.avif", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "top", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: true, // Display the credit text of the banner image
			text: "画师：夜予柠檬", // Credit text to be displayed
			url: "https://xinjinjumin349511375653.lofter.com/post/819631fe_2bef994cf", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 3, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		// Leave this array empty to use the default favicon
		{
		  src: '/favicon/Rimrose202502.ico',    // Path of the favicon, relative to the /public directory
		  // theme: 'light',              // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
		  // sizes: '32x32',              // (Optional) Size of the favicon, set only if you have favicons of different sizes
		}
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
        LinkPreset.Series,
		LinkPreset.About,
        LinkPreset.Friends,
        {
            name: "Bangumi",
            url: "/bangumi/",
        },
		// {
		// 	name: "主站",
		// 	url: "https://rimrose.top",
		// 	external: true,
		// },
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/favicon.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "Rimrose",
	bio: "We are all in the gutter, but some of us are looking at the stars.",
	links: [
		{
			name: "Twitter",
			icon: "fa6-brands:twitter", // Visit https://icones.js.org/ for icon codes
			// You will need to install the corresponding icon set if it's not already included
			// `pnpm add @iconify-json/<icon-set-name>`
			url: "https://x.com/RimroseVon",
		},
		{
			name: "Steam",
			icon: "fa6-brands:steam",
			url: "https://steamcommunity.com/profiles/76561198359867779/",
		},
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/SirTamago",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};
