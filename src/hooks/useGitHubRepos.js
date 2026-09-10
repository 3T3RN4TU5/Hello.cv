import { useEffect, useState } from 'react';
import { reposFallback } from '../data/repos-fallback.js';

const API = 'https://api.github.com';
const FORKS = new Set(['EInfratech_Systems_Official', 'next13-airbnb-clone', 'complete-javascript-course']);
const HIDDEN = new Set(['Jeevan8000']); // profile config repo, not a project

/**
 * Fetch public repositories for a user (unauthenticated, no credentials).
 * Falls back to the verified static list on any failure.
 */
export function useGitHubRepos(username) {
  const [state, setState] = useState({ repos: null, live: false, loading: true });

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);

    async function load() {
      try {
        const res = await fetch(
          `${API}/users/${username}/repos?per_page=100&sort=updated&type=owner`,
          {
            signal: controller.signal,
            headers: { Accept: 'application/vnd.github+json' },
          }
        );
        if (!res.ok) throw new Error(`GitHub API ${res.status}`);
        const data = await res.json();
        const repos = data
          .filter((r) => !r.fork && !FORKS.has(r.name) && !HIDDEN.has(r.name))
          .slice(0, 12)
          .map((r) => ({
            name: r.name,
            description: r.description,
            language: r.language,
            homepage: r.homepage || null,
            html_url: r.html_url,
            topics: r.topics || [],
          }));
        setState({ repos: repos.length ? repos : reposFallback, live: true, loading: false });
      } catch {
        setState({ repos: reposFallback, live: false, loading: false });
      } finally {
        clearTimeout(timeout);
      }
    }
    load();
    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [username]);

  return state;
}
