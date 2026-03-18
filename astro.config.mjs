// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import cloudflare from "@astrojs/cloudflare"; // On repasse sur Cloudflare
import wix from "@wix/astro";
import monitoring from "@wix/monitoring-astro";
import react from "@astrojs/react";
import sourceAttrsPlugin from "@wix/babel-plugin-jsx-source-attrs";
import dynamicDataPlugin from "@wix/babel-plugin-jsx-dynamic-data";
import customErrorOverlayPlugin from "./vite-error-overlay-plugin.js";
import postcssPseudoToData from "@wix/postcss-pseudo-to-data";

const isBuild = process.env.NODE_ENV == "production";

export default defineConfig({
  output: "server",
  adapter: cloudflare(), // Utilisation de l'adaptateur Cloudflare officiel
  integrations: [
    {
      name: "framewire",
      hooks: {
        "astro:config:setup": ({ injectScript, command }) => {
          if (command === "dev") {
            injectScript(
              "page",
              `import loadFramewire from "framewire.js";
              loadFramewire(true);`
            );
          }
        },
      },
    },
    tailwind(),
    wix({
      htmlEmbeds: isBuild,
      auth: true,
    }),
    ...(isBuild ? [monitoring()] : []),
    react(isBuild ? {} : {
      babel: { plugins: [sourceAttrsPlugin, dynamicDataPlugin] },
    }),
  ],
  vite: {
    plugins: [customErrorOverlayPlugin()],
    cacheDir: 'node_modules/.cache/.vite',
    optimizeDeps: {
      include: [
        'react', 'react-dom', 'zustand', 'framer-motion', 
        'date-fns', 'clsx', 'class-variance-authority', 
        'tailwind-merge', '@radix-ui/*', '@wix/*', 'zod'
      ],
    },
    css: !isBuild ? {
      postcss: {
        plugins: [postcssPseudoToData()],
      },
    } : undefined,
  },
  image: {
    domains: ["static.wixstatic.com"],
  },
});
