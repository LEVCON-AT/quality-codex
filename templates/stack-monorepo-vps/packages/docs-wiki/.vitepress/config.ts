import { defineConfig } from 'vitepress';

export default defineConfig({
  srcDir: '../../docs-user',
  title: '__PROJECT_NAME__ Docs',
  description: 'User-Dokumentation',
  lang: 'de-AT',
  themeConfig: {
    nav: [
      { text: 'Getting Started', link: '/getting-started/installation' },
      { text: 'Features', link: '/features/' },
      { text: 'Admin', link: '/admin/setup' },
      { text: 'FAQ', link: '/faq' },
    ],
    sidebar: {
      '/getting-started/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Installation', link: '/getting-started/installation' },
            { text: 'First Login', link: '/getting-started/first-login' },
            { text: 'Concepts', link: '/getting-started/concepts' },
          ],
        },
      ],
      '/admin/': [
        {
          text: 'Admin',
          items: [
            { text: 'Setup', link: '/admin/setup' },
            { text: 'User Management', link: '/admin/user-management' },
            { text: 'Backup & Restore', link: '/admin/backup-restore' },
            { text: 'Monitoring', link: '/admin/monitoring' },
          ],
        },
      ],
    },
    search: { provider: 'local' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/__GH_ORG__/__SLUG__' }],
    footer: {
      message: '__PROJECT_NAME__',
      copyright: '__YEAR__ © __OWNER__',
    },
  },
});
