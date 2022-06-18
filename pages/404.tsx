import Link from 'next/link';
import Layout from '../components/layout';
import MetaHead from '../components/metaHead';
import { prepareSearchData } from '../components/search';
import WdContentLoader from '../content/wdContentLoader';

export async function getStaticProps() {
  const pages = await WdContentLoader.getAll();

  return {
    props: {
      searchData: prepareSearchData(pages),
      basePath: process.env.BASE_PATH,
    },
  };
}

export default function NotFoundPage({ searchData, basePath }) {
  return (
    <main className="wd-main-page">
      <MetaHead
        title="Нічого не знайдено — Webdoky"
        description="Проєкт Webdoky — це зібрання інформації про технології відкритого вебу. HTML, CSS, JavaScript, та API, як для вебсайтів, так і для прогресивних вебзастосунків"
        basePath={`${basePath}`}
      />
      <Layout
        currentPage={{ path: '/404.html' }}
        searchData={searchData}
        sidebarSections={[]}
      >
        <div className="pt-8 md:pt-16">
          <h1 className="text-center font-bold text-4xl text-ui-primary">
            От халепа, тут ніц нема!
          </h1>
        </div>
        <div className="mb-10 flex items-center justify-center">
          <Link href="/">
            <a className="font-bold border-b border-ui-primary text-xl">
              Повернутись на головну
            </a>
          </Link>
          .
        </div>
      </Layout>
    </main>
  );
}
