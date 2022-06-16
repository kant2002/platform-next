import {
  MacroData,
  ContentItem,
  HeadingItem,
} from '../content/wdContentLoader';
import { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Params {
  headings: HeadingItem[];
  page: ContentItem;
}

export default function WdOnThisPage({
  headings: externalHeadings,
  page,
}: Params) {
  const [activeAnchor, setActiveAnchor] = useState('');
  const [observer, setObserver] = useState(null);
  const router = useRouter();

  // TODO: we need to parse HTML in loaders, and transform headings into links, with exctractig meaningful navigation info
  const headings = externalHeadings.filter((h) => h.depth > 1);

  const observerCallback = useCallback(
    (entries, observer) => {
      // This early return fixes the jumping
      // of the bubble active state when we click on a link.
      // There should be only one intersecting element anyways.
      if (entries.length > 1) {
        return;
      }

      const id = entries[0].target.id;

      // We want to give the link of the intersecting
      // headline active and add the hash to the url.
      if (id) {
        setActiveAnchor('#' + id);

        if (history.replaceState) {
          history.replaceState(null, null, '#' + id);
        }
      }
    },
    [setActiveAnchor]
  );

  const initObserver = useCallback(() => {
    if (typeof IntersectionObserver !== 'undefined') {
      const observerInstance = new IntersectionObserver(observerCallback, {
        // This rootMargin should allow intersections at the top of the page.
        rootMargin: '0px 0px 99999px',
        threshold: 1,
      });

      setObserver(observerInstance);

      const elements = document.querySelectorAll(
        '.wd-content h2, .wd-content h3, .wd-content h4, .wd-content h5, .wd-content h6'
      );

      for (let i = 0; i < elements.length; i++) {
        observerInstance.observe(elements[i]);
      }
    }
  }, [setObserver, observerCallback]);

  const routeChangeCallback = useCallback(() => {
    // TODO: probably useEffect's mechanics makes this
    // lisetener redundant
    if (window.location.hash) {
      setActiveAnchor(window.location.hash);
    }
    // Clear the current observer.
    if (observer) {
      observer.disconnect();
    }

    // And create another one for the next page.
    initObserver();
  }, [observer, initObserver]);

  const routeHashChangeCallback = useCallback(() => {
    if (window.location.hash) {
      setActiveAnchor(window.location.hash);
    }
  }, []);

  useEffect(() => {
    if (window.location.hash) {
      setActiveAnchor(window.location.hash);
    }

    if (!observer) {
      initObserver();
    }

    router.events.on('routeChangeComplete', routeChangeCallback);
    router.events.on('hashChangeComplete', routeHashChangeCallback);

    return () => {
      if (observer) {
        observer.disconnect();
        setObserver(null);
      }
      router.events.off('routeChangeComplete', routeChangeCallback);
      router.events.off('hashChangeComplete', routeHashChangeCallback);
    };
  }, [
    observer,
    initObserver,
    routeChangeCallback,
    router.events,
    routeHashChangeCallback,
  ]);

  return (
    <div
      className="mt-8 pr-2 hidden md:block sm:pl-4 md:pl-6 md:pt-12 lg:pl-8 sm:pb-16 sm:border-l border-ui-border md:mt-0 h-full overflow-y-auto"
      style={{ maxHeight: 'calc(100vh - 4rem)' }}
    >
      <h3 className="pt-0 mt-0 text-sm tracking-wide uppercase border-none">
        На цій сторінці:
      </h3>
      <div>
        <ul>
          {headings.map((heading, index) => (
            <li
              key={`${page.path}${heading.anchor}`}
              className={classNames({
                'border-t border-dashed border-ui-border pt-2 mt-2':
                  index > 0 && heading.depth === 2,
                'font-semibold': heading.depth === 2,
                [`depth-${heading.depth}`]: true,
              })}
            >
              <Link href={`${page.path}${heading.anchor}`}>
                <a
                  className={classNames(
                    'relative flex items-center py-1 text-sm transition transform hover:translate-x-1',
                    {
                      'pl-2': heading.depth === 3,
                      'pl-3': heading.depth === 4,
                      'pl-4': heading.depth === 5,
                      'pl-5': heading.depth === 6,
                      'font-bold text-ui-primary':
                        activeAnchor === heading.anchor,
                    }
                  )}
                >
                  <span
                    className={classNames(
                      'absolute w-2 h-2 -ml-3 rounded-full opacity-0 bg-ui-primary transition transform scale-0 origin-center',
                      {
                        'opacity-100 scale-100':
                          activeAnchor === heading.anchor,
                      }
                    )}
                  ></span>
                  {heading.value}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
