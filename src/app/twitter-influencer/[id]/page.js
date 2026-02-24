"use client";
import { use } from "react";
import TwitterInfluencerProfile from "../../components/InfluencerProfile/TwitterInfluencerProfile";

export default function TwitterInfluencerPage({ params }) {
  const resolvedParams = use(params);
  const channelId = resolvedParams.id;

  return <TwitterInfluencerProfile channelId={channelId} />;
}
