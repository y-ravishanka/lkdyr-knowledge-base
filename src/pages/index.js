import {useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const DEFAULT_ICON = '📄';

function StatPill({value, label}) {
  return (
    <div className={styles.statPill}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

function GuideCard({doc}) {
  return (
    <Link to={doc.permalink} className={styles.guideCard}>
      <div className={styles.guideCardBody}>
        {doc.category && (
          <span className={styles.guideCardBadge}>{doc.category}</span>
        )}
        <Heading as="h3" className={styles.guideCardTitle}>
          {doc.title}
        </Heading>
        {doc.description && (
          <p className={styles.guideCardDescription}>{doc.description}</p>
        )}
      </div>
      <span className={styles.guideCardArrow} aria-hidden="true">
        →
      </span>
    </Link>
  );
}

function CategorySection({section}) {
  return (
    <section className={styles.categorySection}>
      <div className={styles.categoryHeader}>
        <span className={styles.categoryIcon} aria-hidden="true">
          {section.icon || DEFAULT_ICON}
        </span>
        <div>
          <Heading as="h2" className={styles.categoryTitle}>
            {section.label}
          </Heading>
          {section.description && (
            <p className={styles.categoryDescription}>{section.description}</p>
          )}
        </div>
        <span className={styles.categoryCount}>
          {section.docs.length} guide{section.docs.length === 1 ? '' : 's'}
        </span>
      </div>
      <div className={styles.guideGrid}>
        {section.docs.map((doc) => (
          <GuideCard key={doc.permalink} doc={doc} />
        ))}
      </div>
    </section>
  );
}

function SearchResults({query, allDocs}) {
  const term = query.trim().toLowerCase();
  const results = allDocs.filter(
    (doc) =>
      doc.title.toLowerCase().includes(term) ||
      doc.description?.toLowerCase().includes(term)
  );

  return (
    <section className={styles.categorySection}>
      <div className={styles.categoryHeader}>
        <span className={styles.categoryIcon} aria-hidden="true">
          🔎
        </span>
        <div>
          <Heading as="h2" className={styles.categoryTitle}>
            Results for &ldquo;{query.trim()}&rdquo;
          </Heading>
        </div>
        <span className={styles.categoryCount}>
          {results.length} match{results.length === 1 ? '' : 'es'}
        </span>
      </div>
      {results.length > 0 ? (
        <div className={styles.guideGrid}>
          {results.map((doc) => (
            <GuideCard key={doc.permalink} doc={doc} />
          ))}
        </div>
      ) : (
        <p className={styles.noResults}>
          No guides matched. Try a different keyword.
        </p>
      )}
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  const [query, setQuery] = useState('');

  const sections = siteConfig.customFields?.guidesData ?? [];
  const allDocs = useMemo(
    () =>
      sections.flatMap((section) =>
        section.docs.map((doc) => ({...doc, category: section.label}))
      ),
    [sections]
  );

  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <main>
        <section className={styles.heroSection}>
          <div className={styles.heroGlow} aria-hidden="true" />
          <img
            src="/img/boy-reading.svg"
            alt="Boy reading a book"
            className={styles.heroArt}
          />
          <h1 className={styles.heroTitle}>{siteConfig.title}</h1>
          <p className={styles.heroSubtitle}>
            A living collection of hands-on guides — updated as new notes are
            added.
          </p>

          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon} aria-hidden="true">
              ⌕
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search guides..."
              className={styles.searchInput}
              aria-label="Search guides"
            />
          </div>

          <div className={styles.statsRow}>
            <StatPill value={allDocs.length} label="Guides" />
            <StatPill value={sections.length} label="Categories" />
            <StatPill value="OSS" label="Free & open" />
          </div>
        </section>

        <div className={styles.contentArea}>
          {query.trim() ? (
            <SearchResults query={query} allDocs={allDocs} />
          ) : sections.length > 0 ? (
            sections.map((section) => (
              <CategorySection key={section.label} section={section} />
            ))
          ) : (
            <p className={styles.noResults}>No guides published yet.</p>
          )}
        </div>
      </main>
    </Layout>
  );
}
