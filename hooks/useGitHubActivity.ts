"use client";

import { useState, useEffect, useCallback } from 'react';

interface RepoCommitData {
  repo: string;
  commits: number;
  lastMessage: string;
  lastDate: string;
}

const DEFAULT_REPOS = [
  'GameVault',
  'geointel',
  'FlowDay',
  'restaurant-pos',
  'TerrorFundingMonitor',
];

const REFETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function useGitHubActivity(repos: string[] = DEFAULT_REPOS) {
  const [data, setData] = useState<RepoCommitData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivity = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const reposParam = repos.join(',');
      const res = await fetch(`/api/github?repos=${reposParam}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch GitHub activity');
    } finally {
      setLoading(false);
    }
  }, [repos]);

  useEffect(() => {
    fetchActivity();
    const interval = setInterval(fetchActivity, REFETCH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchActivity]);

  return { data, loading, error, refetch: fetchActivity };
}
