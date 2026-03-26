"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitBranch, ExternalLink, RefreshCw, GitCommit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow, parseISO } from "date-fns";

interface RepoCommitData {
  repo: string;
  commits: number;
  lastMessage: string;
  lastDate: string;
}

interface GitHubActivityProps {
  repos: RepoCommitData[];
  loading?: boolean;
  onRefresh?: () => void;
}

export default function GitHubActivity({
  repos,
  loading,
  onRefresh,
}: GitHubActivityProps) {
  const totalCommits = repos.reduce((sum, r) => sum + r.commits, 0);

  const lastCommit = repos
    .filter((r) => r.lastDate)
    .sort((a, b) => new Date(b.lastDate).getTime() - new Date(a.lastDate).getTime())[0];

  return (
    <Card className="border-zinc-800 bg-zinc-900/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm text-zinc-300">
            <GitBranch className="h-4 w-4" />
            GitHub Activity
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-zinc-700 text-zinc-400"
            >
              {totalCommits} today
            </Badge>
            {onRefresh && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-zinc-500 hover:text-zinc-300"
                onClick={onRefresh}
                disabled={loading}
              >
                <RefreshCw
                  className={`h-3 w-3 ${loading ? "animate-spin" : ""}`}
                />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading && !repos.length ? (
          <div className="flex items-center justify-center py-4">
            <RefreshCw className="h-4 w-4 animate-spin text-zinc-500" />
            <span className="ml-2 text-sm text-zinc-500">Loading...</span>
          </div>
        ) : (
          <>
            {repos.map((repo) => (
              <div
                key={repo.repo}
                className="flex items-center justify-between rounded-lg px-2 py-1.5"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      repo.commits > 0 ? "bg-green-500" : "bg-zinc-600"
                    }`}
                  />
                  <span className="text-sm text-zinc-300">{repo.repo}</span>
                </div>
                <span
                  className={`text-xs font-medium ${
                    repo.commits > 0 ? "text-green-400" : "text-zinc-600"
                  }`}
                >
                  {repo.commits} {repo.commits === 1 ? "commit" : "commits"}
                </span>
              </div>
            ))}

            {lastCommit && lastCommit.lastDate && (
              <div className="mt-3 flex items-start gap-2 border-t border-zinc-800 pt-3">
                <GitCommit className="mt-0.5 h-3 w-3 flex-shrink-0 text-zinc-500" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-zinc-400">
                    {lastCommit.lastMessage}
                  </p>
                  <p className="text-[10px] text-zinc-600">
                    {formatDistanceToNow(parseISO(lastCommit.lastDate), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            )}

            <a
              href="https://github.com/TerminatorThoku"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center gap-1 text-xs text-orange-500 hover:text-orange-400"
            >
              View GitHub Profile
              <ExternalLink className="h-3 w-3" />
            </a>
          </>
        )}
      </CardContent>
    </Card>
  );
}
