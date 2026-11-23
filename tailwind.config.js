/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: { 50:"#FBF7EE",100:"#F5EED3",200:"#EAD9A8",300:"#DCC27E",400:"#C9A961",500:"#B9975B",600:"#A07F3F",700:"#7E6330",800:"#5C4822",900:"#3A2E16" },
        charcoal: { 50:"#F6F6F7",100:"#E7E7EA",200:"#CFCFD6",300:"#A8A8B5",400:"#7C7C8E",500:"#5C5C6E",600:"#444452",700:"#32323E",800:"#232330",900:"#17171F",950:"#0F0F14" },
        rose: { 500:"#D96C7A", 600:"#C94F60" }
      },
      fontFamily: { sans: ["Inter","system-ui","sans-serif"], serif: ["Georgia","serif"] }
    },
  },
  plugins: [],
};
