import classNames from 'classnames';
import type { Hit as ISHit } from 'instantsearch.js';
import Link from 'next/link';
import { Highlight, Snippet } from 'react-instantsearch';

import type { Hit } from './validation';
import useHit from './useHit';

export default function Hit({ hit }: { hit: Hit & ISHit }) {
  const { handleClick, isLoading } = useHit();
  return (
    <Link
      className={classNames('hit-link', { disabled: isLoading })}
      href={`/uk/docs/${hit.slug}`}
      onClick={handleClick}
      passHref
    >
      <article>
        <h4>
          <Highlight attribute="title" hit={hit} />
        </h4>
        <Snippet attribute="description" hit={hit} />
        <Snippet attribute="content" hit={hit} />
      </article>
    </Link>
  );
}
