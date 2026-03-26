"use client";

import { useCallback } from "react";
import { Music, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpotifyWidgetProps {
  blockType: "study" | "gym" | "swim";
  className?: string;
  studyPlaylistUrl?: string;
  gymPlaylistUrl?: string;
}

// Default playlists
const DEFAULT_PLAYLISTS = {
  study: {
    uri: "spotify:playlist:0vvXsWCC9xrXsKd4FyS8kM",
    url: "https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM",
    label: "Study Focus",
  },
  gym: {
    uri: "spotify:playlist:37i9dQZF1DX76Wlfdnj7AP",
    url: "https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP",
    label: "Beast Mode",
  },
  swim: {
    uri: "spotify:playlist:37i9dQZF1DX76Wlfdnj7AP",
    url: "https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP",
    label: "Workout",
  },
} as const;

function parseSpotifyUrl(input: string): { uri: string; url: string } | null {
  if (!input) return null;

  // Handle spotify:playlist:ID format
  if (input.startsWith("spotify:playlist:")) {
    const id = input.replace("spotify:playlist:", "");
    return {
      uri: input,
      url: `https://open.spotify.com/playlist/${id}`,
    };
  }

  // Handle https://open.spotify.com/playlist/ID format
  const match = input.match(/playlist\/([a-zA-Z0-9]+)/);
  if (match) {
    const id = match[1];
    return {
      uri: `spotify:playlist:${id}`,
      url: `https://open.spotify.com/playlist/${id}`,
    };
  }

  return null;
}

export default function SpotifyWidget({
  blockType,
  className,
  studyPlaylistUrl,
  gymPlaylistUrl,
}: SpotifyWidgetProps) {
  const isStudy = blockType === "study";
  const customUrl = isStudy ? studyPlaylistUrl : gymPlaylistUrl;
  const customParsed = customUrl ? parseSpotifyUrl(customUrl) : null;

  const playlist = customParsed
    ? { ...customParsed, label: isStudy ? "Study Focus" : "Workout" }
    : DEFAULT_PLAYLISTS[blockType];

  const handleClick = useCallback(() => {
    // Try deep link first (opens Spotify app)
    const start = Date.now();

    // Create a hidden anchor to try the deep link
    const link = document.createElement("a");
    link.href = playlist.uri;
    link.style.display = "none";
    document.body.appendChild(link);

    // Try opening the URI
    window.location.href = playlist.uri;

    // If the page is still visible after 1.5s, deep link didn't work
    // Fall back to web URL
    setTimeout(() => {
      if (Date.now() - start < 2000) {
        window.open(playlist.url, "_blank", "noopener,noreferrer");
      }
      document.body.removeChild(link);
    }, 1500);
  }, [playlist.uri, playlist.url]);

  const bgColor = isStudy
    ? "from-violet-600/20 to-violet-500/10"
    : "from-green-600/20 to-green-500/10";

  const iconColor = isStudy ? "text-violet-400" : "text-green-400";

  return (
    <button
      onClick={handleClick}
      className={cn(
        "group flex items-center gap-2 rounded-xl border border-zinc-800/50 bg-gradient-to-r px-3 py-2 transition-all hover:border-zinc-700 hover:shadow-md",
        bgColor,
        className
      )}
    >
      <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-[#1DB954]/20">
        <Music className="h-4 w-4 text-[#1DB954]" />
        <Play className="absolute -bottom-0.5 -right-0.5 h-3 w-3 fill-[#1DB954] text-[#1DB954] opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="text-left">
        <p className="text-xs font-semibold text-zinc-200">
          {playlist.label}
        </p>
        <p className="text-[10px] text-zinc-500">Open in Spotify</p>
      </div>
    </button>
  );
}
