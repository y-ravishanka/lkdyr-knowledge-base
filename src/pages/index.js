import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const bookshelfPosts = [
  {
    title: 'Deployment',
    description:
      'Deploy an application to a Linux environment using NGINX and PM2 on Ubuntu 22.',
    link: '/docs/linux/Deployment',
  },
  {
    title: 'MS SQL Server in Linux (Ubuntu 22 Server)',
    description:
      'Install and configure MS SQL Server 2022 on an Ubuntu 22 Server environment.',
    link: '/docs/linux/ms-sql-server-for-ubuntu22',
  },
];

function BookshelfSection() {
  return (
    <section className={styles.bookshelfSection}>
      <div className="container">
        <Heading as="h2" className={styles.bookshelfTitle}>
          From the Bookshelf
        </Heading>
        <div className={styles.bookshelfGrid}>
          {bookshelfPosts.map((post) => (
            <Link key={post.link} to={post.link} className={styles.bookCard}>
              <span className={styles.bookCardIcon}>📖</span>
              <Heading as="h3" className={styles.bookCardTitle}>
                {post.title}
              </Heading>
              <p className={styles.bookCardDescription}>{post.description}</p>
            </Link>
          ))}
          <div className={styles.bookCardMore}>
            <span className={styles.bookCardIcon}>✍️</span>
            <p>More entries coming soon</p>
          </div>
        </div>
        <div className={styles.bookshelfMore}>
          <Link className="button button--primary button--lg" to="/docs/linux/Deployment">
            Browse the Bookshelf
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout
      title="My Knowledge Base"
      description="lkdyrkb — a personal knowledge base">
      <main>
        <section className={styles.heroSection}>
          <img
            src="/img/boy-reading.svg"
            alt="Boy reading a book"
            className={styles.heroArt}
          />
          <h1 className={styles.heroTitle}>My Knowledge Base</h1>
        </section>
        <BookshelfSection />
      </main>
    </Layout>
  );
}
