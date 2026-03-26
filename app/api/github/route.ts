import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface RepoCommitData {
  repo: string;
  commits: number;
  lastMessage: string;
  lastDate: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const reposParam = searchParams.get('repos');

  if (!reposParam) {
    return NextResponse.json(
      { error: 'Missing repos parameter' },
      { status: 400 },
    );
  }

  const repos = reposParam.split(',').map((r) => r.trim()).filter(Boolean);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sinceISO = today.toISOString();

  const results: RepoCommitData[] = await Promise.all(
    repos.map(async (repo): Promise<RepoCommitData> => {
      try {
        const url = `https://api.github.com/repos/TerminatorThoku/${repo}/commits?since=${sinceISO}&per_page=10`;
        const res = await fetch(url, {
          headers: {
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'FlowDay-App',
          },
          next: { revalidate: 300 },
        });

        if (!res.ok) {
          if (res.status === 404) {
            return { repo, commits: 0, lastMessage: 'Repo not found', lastDate: '' };
          }
          if (res.status === 403) {
            return { repo, commits: 0, lastMessage: 'Rate limited', lastDate: '' };
          }
          return { repo, commits: 0, lastMessage: 'Error fetching', lastDate: '' };
        }

        const commits = await res.json();

        if (!Array.isArray(commits) || commits.length === 0) {
          return { repo, commits: 0, lastMessage: 'No commits today', lastDate: '' };
        }

        return {
          repo,
          commits: commits.length,
          lastMessage: commits[0]?.commit?.message?.split('\n')[0] || '',
          lastDate: commits[0]?.commit?.author?.date || '',
        };
      } catch {
        return { repo, commits: 0, lastMessage: 'Network error', lastDate: '' };
      }
    }),
  );

  return NextResponse.json(results, {
    headers: {
      'Cache-Control': 'public, max-age=300',
    },
  });
}
