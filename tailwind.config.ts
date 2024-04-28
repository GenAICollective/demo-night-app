import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["SF Pro Display", ...fontFamily.sans],
        kallisto: ["var(--font-kallisto)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;
