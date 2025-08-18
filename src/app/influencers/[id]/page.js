"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import InfluencerProfileHeader from "../../components/InfluencerProfile/InfluencerProfileHeader";
import InfluencerRecommendations from "../../components/InfluencerProfile/InfluencerRecommendations";
import YearlyPerformanceTable from "../../components/InfluencerProfile/YearlyPerformanceTable";
import YearlyPerformanceTableDark from "@/app/components/InfluencerProfile/YearlyPerformanceTableDark";
import YearlyPerformanceTableLight from "@/app/components/InfluencerProfile/YearlyPerformanceTableLight";
import InfluencerRecommendationsLight from "../../components/InfluencerProfile/InfluencerRecommendationsLight";
import YearlyStatsRow from "../../components/InfluencerProfile/YearlyStatsRow";

const TABS = [
  { label: "Overview", value: "overview" },
  // { label: "Correlation Summary", value: "correlationSummary" },
  { label: "Correlation Summary ", value: "correlationSummaryV2" },
  // { label: "Correlation Summary V2 Dark", value: "correlationSummaryV2Dark" },
  // { label: "Correlation Summary V2 Light", value: "correlationSummaryV2Light" },
  { label: "Recommendations", value: "recommendations" },
  // { label: "Recommendations-Light", value: "recommendations-light" },
  // { label: "Performance Charts", value: "charts" },
  // { label: "Portfolio Simulator", value: "simulator" },
];

export default function InfluencerProfilePage() {
  const [tab, setTab] = useState("overview");
  const [channelData, setChannelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const channelID = params.id;

  const getChannelData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Fetching channel data for ID: ${channelID}`);

      const apiRes = await axios.get(
        `/api/youtube-data/channel/${channelID}`
      );

      console.log('API response:', apiRes.data);

      // Handle different response structures
      let results = apiRes.data;
      if (apiRes.data && apiRes.data.results) {
        results = apiRes.data.results;
      } else if (apiRes.data && apiRes.data.data) {
        results = apiRes.data.data;
      }

      if (!results) {
        throw new Error('No data found in response');
      }

      setChannelData(results);
    } catch (error) {
      console.error("Error fetching channel data", error);
      let errorMessage = "Failed to load channel data. Please try again later.";

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response:", error.response.data);
        errorMessage = error.response.data?.error || error.response.data?.details || errorMessage;
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        errorMessage = "No response received from server";
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", error.message);
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (channelID) {
      getChannelData();
    }
  }, [channelID]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#19162b] text-white font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading channel data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#19162b] text-white font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-2xl mb-4">⚠️</div>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={getChannelData}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-5 py-2 rounded-lg font-semibold shadow hover:scale-105 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!channelData) {
    return (
      <div className="min-h-screen bg-[#19162b] text-white font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-2xl mb-4">📺</div>
          <p className="text-gray-400">No channel data found.</p>
        </div>
      </div>
    );
  }

  // Calculate sentiment percentages
  const totalSentiment =
    (channelData.total_strong_bullish || 0) +
    (channelData.total_mild_bullish || 0) +
    (channelData.total_strong_bearish || 0) +
    (channelData.total_mild_bearish || 0);
  const bullishPercentage =
    totalSentiment > 0
      ? Math.round(
        ((channelData.total_strong_bullish + channelData.total_mild_bullish) /
          totalSentiment) *
        100
      )
      : 0;
  const bearishPercentage =
    totalSentiment > 0
      ? Math.round(
        ((channelData.total_strong_bearish + channelData.total_mild_bearish) /
          totalSentiment) *
        100
      )
      : 0;

  // Extract correlation data from channelData
  const yearlyData = channelData?.Yearly || {};
  const quarterlyData = channelData?.Quarterly || {};
  const availableYears = Object.keys(yearlyData).sort().reverse();

  return (
    <div className="min-h-screen bg-[#19162b] text-white font-sans pb-16">
      {/* Profile Header */}
      <InfluencerProfileHeader
        channelData={channelData}
        bullishPercentage={bullishPercentage}
        bearishPercentage={bearishPercentage}
      />

      {/* Tabs */}
      <div className="px-4">
        <div className="flex gap-2 border-b border-[#232042] mb-8 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`px-6 py-3 text-sm font-semibold border-b-2 transition whitespace-nowrap
                ${tab === t.value
                  ? "border-blue-400 text-blue-400"
                  : "border-transparent text-gray-300 hover:text-white"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === "overview" && (
          <div className="flex flex-col gap-8">
            {/* Bio & Sentiment */}
            <div className="bg-white rounded-xl p-6 mb-2 border border-gray-200">
              <h3 className="text-lg font-bold mb-2 text-[#0c0023]">
                About {channelData.influencer_name || channelData.channel_title}
              </h3>
              <p className="text-to-purple mb-4">
                {channelData.channel_description ||
                  channelData.branding_channel_description ||
                  "No description available."}
              </p>
              <div className="flex gap-8 mt-2">
                <div className="text-center">
                  <div className="text-xl font-bold mb-1 text-to-green-recomendations">
                    {bullishPercentage}%
                  </div>
                  <div className="text-xs text-to-purple">Bullish Calls</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold mb-1 text-to-red-recomendations">
                    {bearishPercentage}%
                  </div>
                  <div className="text-xs text-to-purple">Bearish Calls</div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold mb-4 text-[#0c0023]">
                  Channel Performance Metrics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-to-purple">Clarity Score:</span>
                    <span className="font-semibold text-[#0c0023]">
                      {channelData.avg_clarity_of_analysis
                        ? parseFloat(
                          channelData.avg_clarity_of_analysis.$numberDecimal
                        ).toFixed(1)
                        : "N/A"}
                      /10
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-to-purple">Credibility Score:</span>
                    <span className="font-semibold text-[#0c0023]">
                      {channelData.avg_credibility_score
                        ? parseFloat(
                          channelData.avg_credibility_score.$numberDecimal
                        ).toFixed(1)
                        : "N/A"}
                      /10
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-to-purple">Actionable Insights:</span>
                    <span className="font-semibold text-[#0c0023]">
                      {channelData.avg_actionable_insights
                        ? parseFloat(
                          channelData.avg_actionable_insights.$numberDecimal
                        ).toFixed(1)
                        : "N/A"}
                      /10
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-to-purple">Risk Management:</span>
                    <span className="font-semibold text-[#0c0023]">
                      {channelData.avg_risk_management
                        ? parseFloat(
                          channelData.avg_risk_management.$numberDecimal
                        ).toFixed(1)
                        : "N/A"}
                      /10
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-to-purple">Educational Value:</span>
                    <span className="font-semibold text-[#0c0023]">
                      {channelData.avg_educational_purpose
                        ? parseFloat(
                          channelData.avg_educational_purpose.$numberDecimal
                        ).toFixed(1)
                        : "N/A"}
                      /10
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold mb-4 text-[#0c0023]">Sentiment Analysis</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-to-purple">Strong Bullish:</span>
                    <span className="font-semibold text-to-green-recomendations">
                      {channelData.total_strong_bullish || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-to-purple">Mild Bullish:</span>
                    <span className="font-semibold text-to-green-recomendations">
                      {channelData.total_mild_bullish || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-to-purple">Strong Bearish:</span>
                    <span className="font-semibold text-to-red-recomendations">
                      {channelData.total_strong_bearish || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-to-purple">Mild Bearish:</span>
                    <span className="font-semibold text-to-red-recomendations">
                      {channelData.total_mild_bearish || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold mb-2 text-[#0c0023]">30-Day Performance</h3>
                <div className="h-40 flex items-center justify-center text-to-purple italic bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded">
                  {channelData.Overall?.["30_days"]
                    ? `ROI: ${channelData.Overall["30_days"]
                      .probablity_weighted_returns_percentage > 0
                      ? "+"
                      : ""
                    }${channelData.Overall[
                      "30_days"
                    ].probablity_weighted_returns_percentage.toFixed(2)}%`
                    : "No data available"}
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold mb-2 text-[#0c0023]">Win Rate Analysis</h3>
                <div className="h-40 flex items-center justify-center text-to-purple italic bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded">
                  {channelData.Overall?.["30_days"]
                    ? `Win Rate: ${channelData.Overall[
                      "30_days"
                    ].price_probablity_of_winning_percentage.toFixed(1)}%`
                    : "No data available"}
                </div>
              </div>
            </div>

            {/* Best/Worst Picks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200 flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <div className="font-semibold text-[#0c0023]">Best Performance</div>
                    <div className="text-xs text-to-purple">
                      BTC -{" "}
                      {channelData.start_date
                        ? new Date(channelData.start_date).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-to-green-recomendations">
                  {channelData.Overall?.["30_days"]
                    ?.probablity_weighted_returns_percentage
                    ? `${channelData.Overall["30_days"]
                      .probablity_weighted_returns_percentage > 0
                      ? "+"
                      : ""
                    }${channelData.Overall[
                      "30_days"
                    ].probablity_weighted_returns_percentage.toFixed(1)}%`
                    : "N/A"}
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200 flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📉</span>
                  <div>
                    <div className="font-semibold text-[#0c0023]">7-Day Performance</div>
                    <div className="text-xs text-to-purple">
                      BTC -{" "}
                      {channelData.end_date
                        ? new Date(channelData.end_date).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-to-red-recomendations">
                  {channelData.Overall?.["7_days"]
                    ?.probablity_weighted_returns_percentage
                    ? `${channelData.Overall["7_days"]
                      .probablity_weighted_returns_percentage > 0
                      ? "+"
                      : ""
                    }${channelData.Overall[
                      "7_days"
                    ].probablity_weighted_returns_percentage.toFixed(1)}%`
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>
        )}
        {tab === "correlationSummary" && (
          <div className="space-y-6">
            {availableYears.length > 0 ? (
              availableYears.map((yearKey) => (
                <div key={yearKey}>
                  <YearlyStatsRow
                    yearKey={yearKey}
                    yearData={yearlyData[yearKey]}
                    quarterlyData={quarterlyData}
                  />
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8">
                No correlation data available for this channel.
              </div>
            )}
          </div>
        )}
        {tab === "correlationSummaryV2" && (
          <div className="space-y-6">
            <YearlyPerformanceTable
              yearlyData={yearlyData}
              quarterlyData={quarterlyData}
            />
          </div>
        )}
        {tab === "correlationSummaryV2Dark" && (
          <YearlyPerformanceTableDark
            yearlyData={yearlyData}
            quarterlyData={quarterlyData}
          />
        )}

        {tab === "correlationSummaryV2Light" && (
          <YearlyPerformanceTableLight
            yearlyData={yearlyData}
            quarterlyData={quarterlyData}
          />
        )}
        {tab === "recommendations" && (
          <InfluencerRecommendations
            channelID={channelID}
            channelData={channelData}
          />
        )}
        {tab === "recommendations-light" && (
          <InfluencerRecommendationsLight
            channelID={channelID}
            channelData={channelData}
          />
        )}
        {tab === "charts" && (
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-[#232042]/70 rounded-xl p-8 border border-[#35315a]">
              <h3 className="font-semibold mb-2">
                Performance Across Timeframes
              </h3>
              <div className="h-64 flex items-center justify-center text-gray-400 italic bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded">
                Interactive Performance Comparison Chart
              </div>
            </div>
            <div className="bg-[#232042]/70 rounded-xl p-8 border border-[#35315a]">
              <h3 className="font-semibold mb-2">
                Sentiment Distribution & Analysis
              </h3>
              <div className="h-64 flex items-center justify-center text-gray-400 italic bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded">
                Sentiment & Risk Metrics Visualization
              </div>
            </div>
          </div>
        )}

        {tab === "simulator" && (
          <div className="bg-[#232042]/70 rounded-xl p-8 border border-[#35315a] flex flex-col gap-6">
            <h3 className="font-semibold mb-2">Portfolio Simulator</h3>
            <p className="text-gray-300 mb-2">
              &quot;What if I followed all their recommendations?&quot;
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
              <label className="text-gray-400">Start Date:</label>
              <input
                type="date"
                className="bg-[#232042] border border-[#35315a] rounded px-3 py-1 text-sm text-white"
                defaultValue={
                  channelData.start_date
                    ? channelData.start_date.split("T")[0]
                    : "2024-01-01"
                }
              />
              <label className="text-gray-400">Strategy:</label>
              <select className="bg-[#232042] border border-[#35315a] rounded px-3 py-1 text-sm text-white">
                <option>Equal Weight</option>
                <option>Market Cap Weighted</option>
                <option>Confidence Weighted</option>
              </select>
              <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-5 py-2 rounded-lg font-semibold shadow hover:scale-105 transition">
                Run Simulation
              </button>
            </div>
            <div className="h-64 flex items-center justify-center text-gray-400 italic bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded">
              Simulated Portfolio Performance vs Benchmarks
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
