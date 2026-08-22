// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import fs from 'node:fs';
import path from 'node:path';
import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Reads simple `key: value` frontmatter out of a markdown file's leading
 * `---` block, without pulling in a YAML parser dependency.
 */
function readFrontMatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  const frontMatter = {};
  if (match) {
    for (const line of match[1].split('\n')) {
      const separatorIndex = line.indexOf(':');
      if (separatorIndex === -1) continue;
      const key = line.slice(0, separatorIndex).trim();
      const value = line
        .slice(separatorIndex + 1)
        .trim()
        .replace(/^["']|["']$/g, '');
      frontMatter[key] = value;
    }
  }
  return frontMatter;
}

function readFirstHeading(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : undefined;
}

/**
 * Walks the docs/ folder and builds the data the homepage renders, so new
 * guides and categories show up automatically without editing any page code.
 */
function buildGuidesData() {
  const docsDir = path.join(process.cwd(), 'docs');
  if (!fs.existsSync(docsDir)) return [];

  return fs
    .readdirSync(docsDir, {withFileTypes: true})
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const categoryDir = path.join(docsDir, entry.name);
      let categoryMeta = {label: entry.name, position: 0};
      const categoryJsonPath = path.join(categoryDir, '_category_.json');
      if (fs.existsSync(categoryJsonPath)) {
        categoryMeta = {
          ...categoryMeta,
          ...JSON.parse(fs.readFileSync(categoryJsonPath, 'utf-8')),
        };
      }

      const docs = fs
        .readdirSync(categoryDir)
        .filter((file) => /\.mdx?$/.test(file))
        .map((file) => {
          const content = fs.readFileSync(path.join(categoryDir, file), 'utf-8');
          const frontMatter = readFrontMatter(content);
          const slug = file.replace(/\.mdx?$/, '');
          return {
            title: frontMatter.title || readFirstHeading(content) || slug,
            description: frontMatter.description || '',
            permalink: `/docs/${entry.name}/${slug}`,
            position: Number(frontMatter.sidebar_position ?? 999),
          };
        })
        .sort((a, b) => a.position - b.position);

      return {
        label: categoryMeta.label,
        description: categoryMeta.link?.description,
        icon: categoryMeta.customProps?.icon,
        position: categoryMeta.position ?? 0,
        docs,
      };
    })
    .sort((a, b) => a.position - b.position);
}

const guidesData = buildGuidesData();

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Codex Knowledge Base',
  tagline: 'My Knowledge Base',
  favicon: 'img/book-favicon.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'y-ravishanka', // Usually your GitHub org/user name.
  projectName: 'lkdyr-knowledge-base', // Usually your repo name.

  onBrokenLinks: 'throw',

  customFields: {
    guidesData,
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/y-ravishanka/lkdyr-knowledge-base/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Codex',
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Bookshelf',
          },
          {
            href: 'https://github.com/y-ravishanka/lkdyr-knowledge-base',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Bookshelf',
                to: '/docs/linux/Deployment',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/y-ravishanka/lkdyr-knowledge-base',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} shadow_s64w. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
