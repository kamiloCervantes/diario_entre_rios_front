"use client";

import { useEffect } from "react";
import { trackArticleView } from "@/lib/track-view";

interface TrackViewProps {
  articleId: string | number;
}

export default function TrackView({ articleId }: TrackViewProps) {
  useEffect(() => {
    if (articleId) {
      trackArticleView(articleId);
    }
  }, [articleId]);

  return null;
}
