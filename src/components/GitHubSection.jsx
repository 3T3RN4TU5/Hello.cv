import SectionHeading, { Reveal } from './SectionHeading.jsx';
import { useGitHubRepos } from '../hooks/useGitHubRepos.js';
import { profile } from '../data/profile.js';
import { ExternalIcon } from './icons.jsx';

const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Python: '#3572A5',
  'Jupyter Notebook': '#DA5B0B',
  Java: '#b07219',
  PHP: '#4F5D95',
  C: '#555555',
  'C++': '#f34b7d',
};

function relativeDate(iso) {
  if (!iso) return null;
  const then = new Date(iso);
  const days = Math.floor((Date.now() - then.getTime()) / 86400000);
  if (days < 1) return 'today';
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function RepoCard({ repo }) {
  return (
    <article className="repo-card">
      <div className="r-head">
        <a
          className="r-name"
          href={repo.html_url}
          target="_blank"
          rel="noreferrer"
          aria-label={`${repo.name} on GitHub`}
        >
          {repo.name}
        </a>
        {repo.homepage && (
          <a
            className="r-demo"
            href={repo.homepage}
            target="_blank"
            rel="noreferrer"
            aria-label={`${repo.name} live demo`}
            title="Live demo"
          >
            <ExternalIcon />
          </a>
        )}
      </div>
      {repo.description ? (
        <p className="r-desc">{repo.description}</p>
      ) : (
        <p className="r-desc none">no description</p>
      )}
      <div className="r-foot">
        {repo.language && (
          <>
            <span className="lang-dot" style={{ '--lang-color': LANG_COLORS[repo.language] ?? '#8b98ad' }} />
            <span>{repo.language}</span>
          </>
        )}
        {repo.topics?.slice(0, 2).map((t) => (
          <span key={t}>#{t}</span>
        ))}
        <span style={{ marginLeft: 'auto' }}>{relativeDate(repo.updated_at) ?? ''}</span>
      </div>
    </article>
  );
}

export default function GitHubSection() {
  const { repos, live, loading } = useGitHubRepos(profile.githubUser);

  return (
    <section id="github" className="section" aria-label="GitHub repositories">
      <div className="container">
        <SectionHeading
          index="07"
          kicker="Open source of truth"
          title="GitHub"
          note={
            <>
              <span className="gh-badge">
                <span className="blink" aria-hidden="true" />
                {loading ? 'fetching' : live ? 'live from GitHub API' : 'cached list'}
              </span>
            </>
          }
        />

        {!live && !loading && (
          <p className="gh-error">
            Live fetch unavailable — showing the last verified snapshot of public repositories.
          </p>
        )}

        <div className="repo-grid">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <div className="repo-skeleton" key={i} aria-hidden="true" />)
            : repos.map((r) => <RepoCard key={r.name} repo={r} />)}
        </div>

        <Reveal className="gh-all">
          <a className="btn btn-ghost" href={profile.github} target="_blank" rel="noreferrer">
            View all repositories
            <ExternalIcon />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
