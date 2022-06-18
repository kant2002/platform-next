module.exports = {
  env: {
    mainNav: [
      {
        path: '/uk/docs/Web',
        title: 'Технології',
      },
      { path: '/docs/', title: 'Про проєкт' },
    ],
    licenseLink: '/docs/licensing/',
    ourGithub: 'https://github.com/webdoky',
  },
  i18n: {
    locales: ['uk-UA'],
    defaultLocale: 'uk-UA',
  },
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/docs/index',
        permanent: false,
      },
    ];
  },
};
