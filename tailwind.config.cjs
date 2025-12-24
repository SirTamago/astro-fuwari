/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,mjs}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Noto Sans SC"',       // 2. M PLUS 缺少的汉字，用思源黑体补全 (避免乱码或回退到宋体)
          "Roboto",               // 3. 英文专用 (可选，如果没有引入Roboto这行可以删掉)
          "sans-serif",           // 4. 网页通用无衬线关键字
          ...defaultTheme.fontFamily.sans // 5. 最后回退到系统默认 (San Francisco, Segoe UI 等)
        ],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}