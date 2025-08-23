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
  { label: "Overviewoption1", value: "overview-light" },
  { label: "Overviewlight2", value: "overview-light1" },
  { label: "Overviewoption2", value: "overview-dark" },
  { label: "Overviewoption3", value: "overview1" },
  { label: "Overviewoption4", value: "overview2" },
  { label: "Overviewoption5", value: "overview3" },
  { label: "Overviewoption6", value: "overview4" },
  // { label: "Correlation Summary", value: "correlationSummary" },
  { label: "Performance Summary", value: "correlationSummaryV2" },
  // { label: "Correlation Summary V2 Dark", value: "correlationSummaryV2Dark" },
  // { label: "Correlation Summary V2 Light", value: "correlationSummaryV2Light" },
  { label: "Recommendations", value: "recommendations" },
  // { label: "Recommendations-Light", value: "recommendations-light" },
  // { label: "Performance Charts", value: "charts" },
  // { label: "Portfolio Simulator", value: "simulator" },
];

export default function InfluencerProfilePage() {
  const [tab, setTab] = useState("overview-light");
  const [channelData, setChannelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summaryType, setSummaryType] = useState("yearly");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedMetricsYear, setSelectedMetricsYear] = useState(new Date().getFullYear().toString());
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

  // Set default year to current year when data loads
  useEffect(() => {
    if (channelData?.Gemini?.Yearly && !selectedPeriod) {
      const currentYear = new Date().getFullYear().toString();
      if (channelData.Gemini.Yearly[currentYear]) {
        setSelectedPeriod(currentYear);
      } else {
        // If current year doesn't exist, use the most recent year
        const availableYears = Object.keys(channelData.Gemini.Yearly).sort((a, b) => parseInt(b) - parseInt(a));
        if (availableYears.length > 0) {
          setSelectedPeriod(availableYears[0]);
        }
      }
    }
  }, [channelData, selectedPeriod]);

  // Sync selectedMetricsYear with selectedPeriod when summaryType is yearly
  useEffect(() => {
    if (summaryType === "yearly" && selectedPeriod) {
      setSelectedMetricsYear(selectedPeriod);
    }
  }, [summaryType, selectedPeriod]);

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
        {tab === "overview-light" && (
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
              <div className="flex gap-8 mt-6">
                <div className="bg-green-100 rounded-2xl p-6 flex-1 text-center transform hover:scale-105 transition">
                  <div className="text-5xl font-black text-green-600 mb-2">
                    {bullishPercentage}%
                  </div>
                  <div className="text-sm font-bold text-green-700 uppercase">ROI</div>
                  <div className="text-sm text-green-700 ">(Avg. Rate of Investment)</div>
                  {/* <span className="text-to-purple text-xs">Cumulative Rate of Return is Calculated from date of channel launch and last system update</span> */}
                </div>
                <div className="bg-green-100 rounded-2xl p-6 flex-1 text-center transform hover:scale-105 transition">
                  <div className="text-5xl font-black text-green-600 mb-2">
                    {bearishPercentage}%
                  </div>
                  <div className="text-sm font-bold text-green-700 uppercase">RRR</div>
                  <div className="text-sm text-green-700">(Avg. Rate of Return)</div>
                </div>
                <div className="bg-green-100 rounded-2xl p-6 flex-1 text-center transform hover:scale-105 transition">
                  <div className="text-5xl font-black text-green-600 mb-2">
                    12
                  </div>
                  <div className="text-sm font-bold text-green-700 uppercase">MCM Ranking</div>
                </div>
              </div>
            </div>

            {/* Summary Dropdown Section */}
            <div className="bg-white rounded-xl p-6 mb-2 border border-gray-200">
              <h3 className="text-lg font-bold mb-4 text-[#0c0023]">
                Channel Summary Analysis
              </h3>

              {/* Type Selection Buttons */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => {
                    setSummaryType("yearly");
                    setSelectedPeriod("");
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition ${summaryType === "yearly"
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : "bg-gray-100 text-[#0c0023] hover:bg-gray-200"
                    }`}
                >
                  Year
                </button>
                <button
                  onClick={() => {
                    setSummaryType("quarterly");
                    setSelectedPeriod("");
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition ${summaryType === "quarterly"
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : "bg-gray-100 text-[#0c0023] hover:bg-gray-200"
                    }`}
                >
                  Quarter
                </button>
                <button
                  onClick={() => {
                    setSummaryType("overall");
                    setSelectedPeriod("overall");
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition ${summaryType === "overall"
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : "bg-gray-100 text-[#0c0023] hover:bg-gray-200"
                    }`}
                >
                  Cumulative
                </button>
              </div>

              {/* Period Selection Dropdown */}
              {summaryType !== "overall" && (
                <div className="mb-4">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg text-[#0c0023] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a {summaryType === "quarterly" ? "quarter" : "year"}...</option>
                    {summaryType === "quarterly"
                      ? channelData?.Gemini?.Quarterly && Object.keys(channelData.Gemini.Quarterly)
                        .sort((a, b) => {
                          const [yearA, qA] = a.split('_');
                          const [yearB, qB] = b.split('_');
                          if (yearA !== yearB) return parseInt(yearB) - parseInt(yearA);
                          return qB.localeCompare(qA);
                        })
                        .map(quarter => (
                          <option key={quarter} value={quarter}>
                            {quarter.replace('_', ' ')}
                          </option>
                        ))
                      : channelData?.Gemini?.Yearly && Object.keys(channelData.Gemini.Yearly)
                        .sort((a, b) => parseInt(b) - parseInt(a))
                        .map(year => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))
                    }
                  </select>
                </div>
              )}

              {/* Summary Display */}
              {selectedPeriod && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  {(() => {
                    const data = summaryType === "quarterly"
                      ? channelData?.Gemini?.Quarterly?.[selectedPeriod]
                      : summaryType === "yearly"
                        ? channelData?.Gemini?.Yearly?.[selectedPeriod]
                        : channelData?.Gemini?.Overall;

                    if (!data) return <p className="text-gray-500">No data available for this period.</p>;

                    return (
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-4 mb-4">
                          <div className="bg-white p-3 rounded-lg border border-gray-200 flex-1 min-w-[200px]">
                            <div className="text-sm text-gray-600">Period</div>
                            <div className="font-semibold text-[#0c0023]">
                              {summaryType === "quarterly"
                                ? data.quarter?.replace('_', ' ')
                                : summaryType === "yearly"
                                  ? data.year
                                  : "Overall"}
                            </div>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-gray-200 flex-1 min-w-[200px]">
                            <div className="text-sm text-gray-600">Credibility Score</div>
                            <div className="font-semibold text-[#0c0023]">
                              {data.overall_credibility_score}/10
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-[#0c0023] mb-2">Summary</h4>
                          <p className="text-gray-700 leading-relaxed">{data.summary}</p>
                        </div>

                        {data.posting_frequency_analysis && (
                          <div>
                            <h4 className="font-semibold text-[#0c0023] mb-2">Posting Frequency Analysis</h4>
                            <p className="text-gray-700 leading-relaxed">{data.posting_frequency_analysis}</p>
                          </div>
                        )}

                        {data.credibility_explanation && (
                          <div>
                            <h4 className="font-semibold text-[#0c0023] mb-2">Credibility Analysis</h4>
                            <p className="text-gray-700 leading-relaxed">{data.credibility_explanation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold text-[#0c0023] mb-4">
                  Channel Performance Metrics
                </h3>
                <div className="space-y-3">
                  {(() => {
                    // Get metrics data based on selected year from Channel Summary Analysis
                    const metricsData = (summaryType === "yearly" && selectedPeriod && channelData?.Ai_scoring?.Yearly?.[selectedPeriod]) ? [
                      { key: 'clarity', label: 'Clarity Score', value: channelData.Ai_scoring.Yearly[selectedPeriod].avg_clarity_of_analysis || 0 },
                      { key: 'credibility', label: 'Credibility Score', value: channelData.Ai_scoring.Yearly[selectedPeriod].avg_credibility_score || 0 },
                      { key: 'insights', label: 'Actionable Insights', value: channelData.Ai_scoring.Yearly[selectedPeriod].avg_actionable_insights || 0 },
                      { key: 'risk', label: 'Risk Management', value: channelData.Ai_scoring.Yearly[selectedPeriod].avg_risk_management || 0 },
                      { key: 'education', label: 'Educational Value', value: channelData.Ai_scoring.Yearly[selectedPeriod].avg_educational_purpose || 0 },
                      { key: 'recommendations', label: 'Recommendations', value: channelData.Ai_scoring.Yearly[selectedPeriod].avg_recommendations || 0 },
                      { key: 'coins', label: 'View on Coins', value: channelData.Ai_scoring.Yearly[selectedPeriod].avg_view_on_coins || 0 },
                      { key: 'overall', label: 'Overall Score', value: channelData.Ai_scoring.Yearly[selectedPeriod].avg_overall_score || 0 }
                    ] : [
                      { key: 'clarity', label: 'Clarity Score', value: channelData.avg_clarity_of_analysis ? parseFloat(channelData.avg_clarity_of_analysis.$numberDecimal) : 0 },
                      { key: 'credibility', label: 'Credibility Score', value: channelData.avg_credibility_score ? parseFloat(channelData.avg_credibility_score.$numberDecimal) : 0 },
                      { key: 'insights', label: 'Actionable Insights', value: channelData.avg_actionable_insights ? parseFloat(channelData.avg_actionable_insights.$numberDecimal) : 0 },
                      { key: 'risk', label: 'Risk Management', value: channelData.avg_risk_management ? parseFloat(channelData.avg_risk_management.$numberDecimal) : 0 },
                      { key: 'education', label: 'Educational Value', value: channelData.avg_educational_purpose ? parseFloat(channelData.avg_educational_purpose.$numberDecimal) : 0 }
                    ];

                    // Filter out metrics with 0 values for cleaner display
                    const validMetrics = metricsData.filter(metric => metric.value > 0);

                    if (validMetrics.length === 0) {
                      return (
                        <div className="h-40 flex items-center justify-center text-gray-500 italic">
                          No performance data available
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-2">
                        {validMetrics.map((metric, index) => (
                          <div key={metric.key} className="flex items-center justify-between">
                            <div className="flex items-center w-32">
                              <span className="text-sm text-gray-600 font-medium">{metric.label}</span>
                            </div>
                            <div className="flex-1 mx-4">
                              <div className="bg-gray-200 rounded-full h-3 relative overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 rounded-full transition-all duration-500 ease-out"
                                  style={{
                                    width: `${(metric.value / 10) * 100}%`,
                                    minWidth: metric.value > 0 ? '8px' : '0px'
                                  }}
                                ></div>
                              </div>
                            </div>
                            <div className="w-16 text-right">
                              <span className="text-sm font-semibold text-[#0c0023]">
                                {metric.value.toFixed(1)}/10
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
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
                <h3 className="font-semibold mb-4 text-[#0c0023]">Performance Overview(ROI)</h3>
                <div className="h-64">
                  {(() => {
                    const timeFrames = [
                      { key: '1_hour', label: '1H' },
                      { key: '24_hours', label: '24H' },
                      { key: '7_days', label: '7D' },
                      { key: '30_days', label: '30D' },
                      { key: '60_days', label: '60D' },
                      { key: '90_days', label: '90D' },
                      { key: '180_days', label: '180D' },
                      { key: '1_year', label: '1Y' }
                    ];

                    const getPerformanceData = () => {
                      // Use yearly data if a year is selected, otherwise use Overall
                      const dataSource = (summaryType === "yearly" && selectedPeriod)
                        ? channelData.Yearly?.[selectedPeriod]
                        : channelData.Overall;

                      return timeFrames.map(tf => ({
                        label: tf.label,
                        value: dataSource?.[tf.key]?.probablity_weighted_returns_percentage || 0
                      }));
                    };

                    const performanceData = getPerformanceData();

                    const maxValue = Math.max(...performanceData.map(d => Math.abs(d.value)), 10);
                    const minValue = Math.min(...performanceData.map(d => d.value), -10);
                    const hasData = performanceData.some(d => d.value !== 0);

                    if (!hasData) {
                      return (
                        <div className="h-full flex items-center justify-center text-gray-400 italic">
                          No performance data available
                        </div>
                      );
                    }

                    // Horizontal bar graph - clean style
                    const maxPerformanceValue = Math.max(...performanceData.map(d => Math.abs(d.value)), 100);

                    return (
                      <div className="h-full flex flex-col">
                        <div className="flex-1 flex items-center">
                          {/* Y-axis labels */}
                          <div className="flex flex-col justify-between pr-4 min-w-[100px]">
                            {[...performanceData].reverse().map((data, index) => (
                              <div key={index} className="text-sm text-gray-700 font-medium py-1">
                                {
                                  data.label === '1H' ? '1 Hour' :
                                    data.label === '24H' ? '24 Hours' :
                                      data.label === '7D' ? '7 Days' :
                                        data.label === '30D' ? '30 Days' :
                                          data.label === '60D' ? '60 Days' :
                                            data.label === '90D' ? '90 Days' :
                                              data.label === '180D' ? '180 Days' :
                                                '1 Year'}
                              </div>
                            ))}
                          </div>

                          {/* Chart area */}
                          <div className="flex-1 relative h-full">
                            {/* Background grid */}
                            <div className="absolute inset-0 grid grid-cols-10">
                              {[...Array(10)].map((_, i) => (
                                <div key={i} className="border-r border-gray-200"></div>
                              ))}
                            </div>

                            {/* Bars */}
                            <div className="relative h-full flex flex-col justify-between py-2">
                              {[...performanceData].reverse().map((data, index) => {
                                const barWidth = Math.abs(data.value);
                                const isPositive = data.value >= 0;

                                return (
                                  <div key={index} className="flex items-center relative">
                                    <div
                                      className={`h-6 ${isPositive
                                        ? 'bg-gradient-to-r from-green-500 to-green-600'
                                        : 'bg-gradient-to-r from-red-500 to-red-600'
                                        } rounded-r shadow-sm`}
                                      style={{
                                        width: `${barWidth}%`,
                                        maxWidth: '100%',
                                        transition: 'all 0.3s ease'
                                      }}
                                    >
                                      {/* Value label inside bar */}
                                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-to-purple text-xs font-semibold">
                                        {data.value > 0 ? '+' : ''}{data.value.toFixed(1)}%
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* X-axis labels */}
                            <div className="absolute -bottom-6 inset-x-0 flex justify-between">
                              {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((val) => (
                                <div key={val} className="text-xs text-gray-500">
                                  {val}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Bottom label */}
                        <div className="text-center mt-8 text-sm text-gray-600">
                          Performance Percentage (ROI)
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold mb-4 text-[#0c0023]">Win Rate Analysis</h3>
                <div className="space-y-3">
                  {(() => {
                    const periods = [
                      { key: '1_hour', label: '1 Hour' },
                      { key: '24_hours', label: '24 Hours' },
                      { key: '7_days', label: '7 Days' },
                      { key: '30_days', label: '30 Days' },
                      { key: '60_days', label: '60 Days' },
                      { key: '90_days', label: '90 Days' },
                      { key: '180_days', label: '180 Days' },
                      { key: '1_year', label: '1 Year' }
                    ];

                    const getWinRates = () => {
                      // Use yearly data if a year is selected, otherwise use Overall
                      const dataSource = (summaryType === "yearly" && selectedPeriod)
                        ? channelData.normal.Yearly?.[selectedPeriod]
                        : channelData.normal.Overall;

                      return periods.map(period => ({
                        ...period,
                        value: dataSource?.[period.key]?.price_probablity_of_winning_percentage || 0
                      }));
                    };

                    const winRates = getWinRates();

                    const maxWinRate = Math.max(...winRates.map(item => item.value), 100);

                    if (winRates.every(item => item.value === 0)) {
                      return (
                        <div className="h-40 flex items-center justify-center text-gray-500 italic">
                          No win rate data available
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-2">
                        {winRates.map((period, index) => (
                          <div key={period.key} className="flex items-center justify-between">
                            <div className="flex items-center w-24">
                              <span className="text-sm text-gray-600 font-medium">{period.label}</span>
                            </div>
                            <div className="flex-1 mx-4">
                              <div className="bg-gray-200 rounded-full h-3 relative overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                                  style={{
                                    width: `${(period.value / maxWinRate) * 100}%`,
                                    minWidth: period.value > 0 ? '8px' : '0px'
                                  }}
                                ></div>
                              </div>
                            </div>
                            <div className="w-16 text-right">
                              <span className="text-sm font-semibold text-[#0c0023]">
                                {period.value > 0 ? `${period.value.toFixed(1)}%` : 'N/A'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200 flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-2">
                  {/* <span className="text-2xl">🏆</span> */}
                  <div>
                    <div className="font-semibold text-[#0c0023]">Total No. of Videos Posted</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-to-purple">
                  {channelData.total_records || 0}
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200 flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-2">
                  {/* <span className="text-2xl">📉</span> */}
                  <div>
                    <div className="font-semibold text-[#0c0023]">Crypto Related Videos -overall period</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-to-purple">
                  {channelData.crypto_related || 0}
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
                  {(() => {
                    const dataSource = (summaryType === "yearly" && selectedPeriod)
                      ? channelData.Yearly?.[selectedPeriod]
                      : channelData.Overall;
                    const performanceValue = dataSource?.["30_days"]?.probablity_weighted_returns_percentage;

                    return performanceValue
                      ? `${performanceValue > 0 ? "+" : ""}${performanceValue.toFixed(1)}%`
                      : "N/A";
                  })()}
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
                  {(() => {
                    const dataSource = (summaryType === "yearly" && selectedPeriod)
                      ? channelData.Yearly?.[selectedPeriod]
                      : channelData.Overall;
                    const performanceValue = dataSource?.["7_days"]?.probablity_weighted_returns_percentage;

                    return performanceValue
                      ? `${performanceValue > 0 ? "+" : ""}${performanceValue.toFixed(1)}%`
                      : "N/A";
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}
        {tab === "overview-light1" && (
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
              <div className="flex gap-8 mt-6">
                <div className="bg-green-100 rounded-2xl p-6 flex-1 text-center transform hover:scale-105 transition">
                  <div className="text-5xl font-black text-green-600 mb-2">
                    {bullishPercentage}%
                  </div>
                  <div className="text-sm font-bold text-green-700 uppercase">ROI</div>
                  <div className="text-sm text-green-700 ">(Avg. Rate of Investment)</div>
                  {/* <span className="text-to-purple text-xs">Cumulative Rate of Return is Calculated from date of channel launch and last system update</span> */}
                </div>
                <div className="bg-green-100 rounded-2xl p-6 flex-1 text-center transform hover:scale-105 transition">
                  <div className="text-5xl font-black text-green-600 mb-2">
                    {bearishPercentage}%
                  </div>
                  <div className="text-sm font-bold text-green-700 uppercase">RRR</div>
                  <div className="text-sm text-green-700">(Avg. Rate of Return)</div>
                </div>
                <div className="bg-green-100 rounded-2xl p-6 flex-1 text-center transform hover:scale-105 transition">
                  <div className="text-5xl font-black text-green-600 mb-2">
                    12
                  </div>
                  <div className="text-sm font-bold text-green-700 uppercase">MCM Ranking</div>
                </div>
              </div>
            </div>

            {/* Summary Dropdown Section */}
            <div className="bg-white rounded-xl p-6 mb-2 border border-gray-200">
              <h3 className="text-lg font-bold mb-4 text-[#0c0023]">
                Channel Summary Analysis
              </h3>

              {/* Type Selection Buttons */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => {
                    setSummaryType("yearly");
                    setSelectedPeriod("");
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition ${summaryType === "yearly"
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : "bg-gray-100 text-[#0c0023] hover:bg-gray-200"
                    }`}
                >
                  Year
                </button>
                <button
                  onClick={() => {
                    setSummaryType("quarterly");
                    setSelectedPeriod("");
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition ${summaryType === "quarterly"
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : "bg-gray-100 text-[#0c0023] hover:bg-gray-200"
                    }`}
                >
                  Quarter
                </button>
                <button
                  onClick={() => {
                    setSummaryType("overall");
                    setSelectedPeriod("overall");
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition ${summaryType === "overall"
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : "bg-gray-100 text-[#0c0023] hover:bg-gray-200"
                    }`}
                >
                  Cumulative
                </button>
              </div>

              {/* Period Selection Dropdown */}
              {summaryType !== "overall" && (
                <div className="mb-4">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg text-[#0c0023] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a {summaryType === "quarterly" ? "quarter" : "year"}...</option>
                    {summaryType === "quarterly"
                      ? channelData?.Gemini?.Quarterly && Object.keys(channelData.Gemini.Quarterly)
                        .sort((a, b) => {
                          const [yearA, qA] = a.split('_');
                          const [yearB, qB] = b.split('_');
                          if (yearA !== yearB) return parseInt(yearB) - parseInt(yearA);
                          return qB.localeCompare(qA);
                        })
                        .map(quarter => (
                          <option key={quarter} value={quarter}>
                            {quarter.replace('_', ' ')}
                          </option>
                        ))
                      : channelData?.Gemini?.Yearly && Object.keys(channelData.Gemini.Yearly)
                        .sort((a, b) => parseInt(b) - parseInt(a))
                        .map(year => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))
                    }
                  </select>
                </div>
              )}

              {/* Summary Display */}
              {selectedPeriod && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  {(() => {
                    const data = summaryType === "quarterly"
                      ? channelData?.Gemini?.Quarterly?.[selectedPeriod]
                      : summaryType === "yearly"
                        ? channelData?.Gemini?.Yearly?.[selectedPeriod]
                        : channelData?.Gemini?.Overall;

                    if (!data) return <p className="text-gray-500">No data available for this period.</p>;

                    return (
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-4 mb-4">
                          <div className="bg-white p-3 rounded-lg border border-gray-200 flex-1 min-w-[200px]">
                            <div className="text-sm text-gray-600">Period</div>
                            <div className="font-semibold text-[#0c0023]">
                              {summaryType === "quarterly"
                                ? data.quarter?.replace('_', ' ')
                                : summaryType === "yearly"
                                  ? data.year
                                  : "Overall"}
                            </div>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-gray-200 flex-1 min-w-[200px]">
                            <div className="text-sm text-gray-600">Credibility Score</div>
                            <div className="font-semibold text-[#0c0023]">
                              {data.overall_credibility_score}/10
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-[#0c0023] mb-2">Summary</h4>
                          <p className="text-gray-700 leading-relaxed">{data.summary}</p>
                        </div>

                        {data.posting_frequency_analysis && (
                          <div>
                            <h4 className="font-semibold text-[#0c0023] mb-2">Posting Frequency Analysis</h4>
                            <p className="text-gray-700 leading-relaxed">{data.posting_frequency_analysis}</p>
                          </div>
                        )}

                        {data.credibility_explanation && (
                          <div>
                            <h4 className="font-semibold text-[#0c0023] mb-2">Credibility Analysis</h4>
                            <p className="text-gray-700 leading-relaxed">{data.credibility_explanation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#0c0023]">
                    Channel Performance Metrics
                  </h3>
                  <button
                    onClick={() => setTab("correlationSummaryV2")}
                    className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-md"
                  >
                    More Details
                  </button>
                </div>

                <div className="space-y-6">
                  {summaryType === "yearly" && channelData?.Ai_scoring?.Yearly
                    ? Object.entries(channelData.Ai_scoring.Yearly).map(([year, data]) => {
                      const metricsData = [
                        { key: "insights", label: "Actionable Insights", value: data.avg_actionable_insights || 0 },
                        { key: "risk", label: "Risk Management", value: data.avg_risk_management || 0 },
                        { key: "education", label: "Educational Value", value: data.avg_educational_purpose || 0 },
                      ];

                      const validMetrics = metricsData.filter((metric) => metric.value > 0);

                      return (
                        <div key={year} className="space-y-3">
                          <h4 className="text-md font-semibold text-[#0c0023]">{year}</h4>
                          {validMetrics.length === 0 ? (
                            <div className="h-20 flex items-center justify-center text-gray-500 italic">
                              No performance data available
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {validMetrics.map((metric) => (
                                <div key={metric.key} className="flex items-center justify-between">
                                  <div className="flex items-center w-48">
                                    <span className="text-sm text-gray-600 font-medium">{metric.label}</span>
                                  </div>
                                  <div className="flex-1 mx-4">
                                    <div className="bg-gray-200 rounded-full h-3 relative overflow-hidden">
                                      <div
                                        className="h-full bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 rounded-full transition-all duration-500 ease-out"
                                        style={{
                                          width: `${(metric.value / 10) * 100}%`,
                                          minWidth: metric.value > 0 ? "8px" : "0px",
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                  <div className="w-16 text-right">
                                    <span className="text-sm font-semibold text-[#0c0023]">
                                      {metric.value.toFixed(1)}/10
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                    : (
                      <div className="h-40 flex items-center justify-center text-gray-500 italic">
                        No yearly performance data available
                      </div>
                    )}
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#0c0023]">
                    Performance Overview (ROI)
                  </h3>
                  <button
                    onClick={() => setTab("recommendations")}
                    className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-md"
                  >
                    More Details
                  </button>
                </div>

                <div className="space-y-8">
                  {summaryType === "yearly" && channelData?.Yearly
                    ? Object.entries(channelData.Yearly).map(([year, dataSource]) => {
                      const timeFrames = [
                        { key: "1_hour", label: "1 Hour" },
                        { key: "24_hours", label: "24 Hours" },
                        { key: "7_days", label: "7 Days" },
                        { key: "30_days", label: "30 Days" },
                        { key: "60_days", label: "60 Days" },
                        { key: "90_days", label: "90 Days" },
                        { key: "180_days", label: "180 Days" },
                        { key: "1_year", label: "1 Year" },
                      ];

                      const performanceData = timeFrames.map((tf) => ({
                        label: tf.label,
                        value: dataSource?.[tf.key]?.probablity_weighted_returns_percentage || 0,
                      }));

                      const hasData = performanceData.some((d) => d.value !== 0);

                      return (
                        <div key={year} className="space-y-4">
                          {/* Year heading */}
                          <h4 className="text-md font-semibold text-[#0c0023]">{year}</h4>

                          {!hasData ? (
                            <div className="h-40 flex items-center justify-center text-gray-400 italic">
                              No performance data available
                            </div>
                          ) : (
                            <div className="h-64 flex flex-col">
                              <div className="flex-1 flex items-center">
                                {/* Y-axis labels */}
                                <div className="flex flex-col justify-between pr-4 min-w-[100px]">
                                  {[...performanceData].reverse().map((data, index) => (
                                    <div
                                      key={index}
                                      className="text-sm text-gray-700 font-medium py-1"
                                    >
                                      {data.label}
                                    </div>
                                  ))}
                                </div>

                                {/* Chart area */}
                                <div className="flex-1 relative h-full">
                                  {/* Background grid */}
                                  <div className="absolute inset-0 grid grid-cols-10">
                                    {[...Array(10)].map((_, i) => (
                                      <div key={i} className="border-r border-gray-200"></div>
                                    ))}
                                  </div>

                                  {/* Bars */}
                                  <div className="relative h-full flex flex-col justify-between py-2">
                                    {[...performanceData].reverse().map((data, index) => {
                                      const barWidth = Math.abs(data.value);
                                      const isPositive = data.value >= 0;

                                      return (
                                        <div
                                          key={index}
                                          className="flex items-center relative"
                                        >
                                          <div
                                            className={`h-6 ${isPositive
                                              ? "bg-gradient-to-r from-green-500 to-green-600"
                                              : "bg-gradient-to-r from-red-500 to-red-600"
                                              } rounded-r shadow-sm`}
                                            style={{
                                              width: `${barWidth}%`,
                                              maxWidth: "100%",
                                              transition: "all 0.3s ease",
                                            }}
                                          >
                                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-to-purple text-xs font-semibold">
                                              {data.value > 0 ? "+" : ""}
                                              {data.value.toFixed(1)}%
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {/* X-axis labels */}
                                  <div className="absolute -bottom-6 inset-x-0 flex justify-between">
                                    {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(
                                      (val) => (
                                        <div key={val} className="text-xs text-gray-500">
                                          {val}
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Bottom label */}
                              <div className="text-center mt-8 text-sm text-gray-600">
                                Performance Percentage (ROI)
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                    : (
                      <div className="h-40 flex items-center justify-center text-gray-400 italic">
                        No yearly performance data available
                      </div>
                    )}
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold mb-4 text-[#0c0023]">Win Rate Analysis</h3>
                <div className="space-y-8">
                  {summaryType === "yearly" && channelData?.normal?.Yearly
                    ? Object.entries(channelData.normal.Yearly).map(([year, dataSource]) => {
                      const periods = [
                        { key: '1_hour', label: '1 Hour' },
                        { key: '24_hours', label: '24 Hours' },
                        { key: '7_days', label: '7 Days' },
                        { key: '30_days', label: '30 Days' },
                        { key: '60_days', label: '60 Days' },
                        { key: '90_days', label: '90 Days' },
                        { key: '180_days', label: '180 Days' },
                        { key: '1_year', label: '1 Year' }
                      ];

                      const winRates = periods.map(period => ({
                        ...period,
                        value: dataSource?.[period.key]?.price_probablity_of_winning_percentage || 0
                      }));

                      const maxWinRate = Math.max(...winRates.map(item => item.value), 100);
                      const hasData = winRates.some(item => item.value !== 0);

                      return (
                        <div key={year} className="space-y-4">
                          {/* Year heading */}
                          <h4 className="text-md font-semibold text-[#0c0023]">{year}</h4>

                          {!hasData ? (
                            <div className="h-40 flex items-center justify-center text-gray-500 italic">
                              No win rate data available
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {winRates.map((period) => (
                                <div key={period.key} className="flex items-center justify-between">
                                  <div className="flex items-center w-32">
                                    <span className="text-sm text-gray-600 font-medium">{period.label}</span>
                                  </div>
                                  <div className="flex-1 mx-4">
                                    <div className="bg-gray-200 rounded-full h-3 relative overflow-hidden">
                                      <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                                        style={{
                                          width: `${(period.value / maxWinRate) * 100}%`,
                                          minWidth: period.value > 0 ? '8px' : '0px'
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                  <div className="w-16 text-right">
                                    <span className="text-sm font-semibold text-[#0c0023]">
                                      {period.value > 0 ? `${period.value.toFixed(1)}%` : 'N/A'}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                    : (
                      <div className="h-40 flex items-center justify-center text-gray-500 italic">
                        No yearly win rate data available
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200 flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <div className="font-semibold text-[#0c0023]">Total No. of Videos Posted</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-to-purple">
                  {channelData.total_records || 0}
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200 flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📉</span>
                  <div>
                    <div className="font-semibold text-[#0c0023]">Crypto Related Videos -overall period</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-to-purple">
                  {channelData.crypto_related || 0}
                </div>
              </div>
            </div> */}
            {/* Best/Worst Picks */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  {(() => {
                    const dataSource = (summaryType === "yearly" && selectedPeriod)
                      ? channelData.Yearly?.[selectedPeriod]
                      : channelData.Overall;
                    const performanceValue = dataSource?.["30_days"]?.probablity_weighted_returns_percentage;

                    return performanceValue
                      ? `${performanceValue > 0 ? "+" : ""}${performanceValue.toFixed(1)}%`
                      : "N/A";
                  })()}
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
                  {(() => {
                    const dataSource = (summaryType === "yearly" && selectedPeriod)
                      ? channelData.Yearly?.[selectedPeriod]
                      : channelData.Overall;
                    const performanceValue = dataSource?.["7_days"]?.probablity_weighted_returns_percentage;

                    return performanceValue
                      ? `${performanceValue > 0 ? "+" : ""}${performanceValue.toFixed(1)}%`
                      : "N/A";
                  })()}
                </div>
              </div>
            </div> */}
            <YearlyPerformanceTable
              yearlyData={yearlyData}
              quarterlyData={quarterlyData}
              channelData={channelData}
            />
          </div>
        )}
        {tab === "overview-dark" && (
          <div className="flex flex-col gap-8">
            {/* Bio & Sentiment */}
            <div className="bg-[#232042]/70 rounded-xl p-6 mb-2 border border-[#35315a]">
              <h3 className="text-lg font-bold mb-2">
                About {channelData.influencer_name || channelData.channel_title}
              </h3>
              <p className="text-gray-300 mb-4">
                {channelData.channel_description ||
                  channelData.branding_channel_description ||
                  "No description available."}
              </p>
              <div className="flex gap-8 mt-2">
                <div className="text-center">
                  <div className="text-xl font-bold mb-1 text-green-400">
                    {bullishPercentage}%
                  </div>
                  <div className="text-xs text-gray-400">Bullish Calls</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold mb-1 text-red-400">
                    {bearishPercentage}%
                  </div>
                  <div className="text-xs text-gray-400">Bearish Calls</div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#232042]/70 rounded-xl p-6 border border-[#35315a]">
                <h3 className="font-semibold mb-4">
                  Channel Performance Metrics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Clarity Score:</span>
                    <span className="font-semibold">
                      {channelData.avg_clarity_of_analysis
                        ? parseFloat(
                          channelData.avg_clarity_of_analysis.$numberDecimal
                        ).toFixed(1)
                        : "N/A"}
                      /10
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Credibility Score:</span>
                    <span className="font-semibold">
                      {channelData.avg_credibility_score
                        ? parseFloat(
                          channelData.avg_credibility_score.$numberDecimal
                        ).toFixed(1)
                        : "N/A"}
                      /10
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Actionable Insights:</span>
                    <span className="font-semibold">
                      {channelData.avg_actionable_insights
                        ? parseFloat(
                          channelData.avg_actionable_insights.$numberDecimal
                        ).toFixed(1)
                        : "N/A"}
                      /10
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Risk Management:</span>
                    <span className="font-semibold">
                      {channelData.avg_risk_management
                        ? parseFloat(
                          channelData.avg_risk_management.$numberDecimal
                        ).toFixed(1)
                        : "N/A"}
                      /10
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Educational Value:</span>
                    <span className="font-semibold">
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
              <div className="bg-[#232042]/70 rounded-xl p-6 border border-[#35315a]">
                <h3 className="font-semibold mb-4">Sentiment Analysis</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Strong Bullish:</span>
                    <span className="font-semibold text-green-400">
                      {channelData.total_strong_bullish || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mild Bullish:</span>
                    <span className="font-semibold text-green-400">
                      {channelData.total_mild_bullish || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Strong Bearish:</span>
                    <span className="font-semibold text-red-400">
                      {channelData.total_strong_bearish || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mild Bearish:</span>
                    <span className="font-semibold text-red-400">
                      {channelData.total_mild_bearish || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#232042]/70 rounded-xl p-6 border border-[#35315a]">
                <h3 className="font-semibold mb-2">30-Day Performance</h3>
                <div className="h-40 flex items-center justify-center text-gray-400 italic bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded">
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
              <div className="bg-[#232042]/70 rounded-xl p-6 border border-[#35315a]">
                <h3 className="font-semibold mb-2">Win Rate Analysis</h3>
                <div className="h-40 flex items-center justify-center text-gray-400 italic bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded">
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
              <div className="bg-[#232042]/70 rounded-xl p-6 border border-[#35315a] flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <div className="font-semibold">Best Performance</div>
                    <div className="text-xs text-gray-400">
                      BTC -{" "}
                      {channelData.start_date
                        ? new Date(channelData.start_date).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-400">
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
              <div className="bg-[#232042]/70 rounded-xl p-6 border border-[#35315a] flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📉</span>
                  <div>
                    <div className="font-semibold">7-Day Performance</div>
                    <div className="text-xs text-gray-400">
                      BTC -{" "}
                      {channelData.end_date
                        ? new Date(channelData.end_date).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-red-400">
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
              channelData={channelData}
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

        {/* Overview 1 - Dark Professional Theme */}
        {tab === "overview1" && (
          <div className="flex flex-col gap-6">
            {/* Bio & Sentiment - Dark Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
              <h3 className="text-2xl font-bold mb-3 text-white">
                About {channelData.influencer_name || channelData.channel_title}
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {channelData.channel_description ||
                  channelData.branding_channel_description ||
                  "No description available."}
              </p>
              <div className="flex gap-12 mt-4">
                <div className="text-center">
                  <div className="text-3xl font-black mb-2 text-emerald-400">
                    {bullishPercentage}%
                  </div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">Bullish Calls</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black mb-2 text-rose-400">
                    {bearishPercentage}%
                  </div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">Bearish Calls</div>
                </div>
              </div>
            </div>

            {/* Summary Analysis - Dark Theme */}
            <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-700">
              <h3 className="text-2xl font-bold mb-6 text-white">
                Channel Summary Analysis
              </h3>

              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => {
                    setSummaryType("quarterly");
                    setSelectedPeriod("");
                  }}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${summaryType === "quarterly"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                >
                  Quarterly
                </button>
                <button
                  onClick={() => {
                    setSummaryType("yearly");
                    setSelectedPeriod("");
                  }}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${summaryType === "yearly"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                >
                  Yearly
                </button>
                <button
                  onClick={() => {
                    setSummaryType("overall");
                    setSelectedPeriod("overall");
                  }}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${summaryType === "overall"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                >
                  Overall
                </button>
              </div>

              {summaryType !== "overall" && (
                <div className="mb-6">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full md:w-auto px-6 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select a {summaryType === "quarterly" ? "quarter" : "year"}...</option>
                    {summaryType === "quarterly"
                      ? channelData?.Gemini?.Quarterly && Object.keys(channelData.Gemini.Quarterly)
                        .sort((a, b) => {
                          const [yearA, qA] = a.split('_');
                          const [yearB, qB] = b.split('_');
                          if (yearA !== yearB) return parseInt(yearB) - parseInt(yearA);
                          return qB.localeCompare(qA);
                        })
                        .map(quarter => (
                          <option key={quarter} value={quarter}>
                            {quarter.replace('_', ' ')}
                          </option>
                        ))
                      : channelData?.Gemini?.Yearly && Object.keys(channelData.Gemini.Yearly)
                        .sort((a, b) => parseInt(b) - parseInt(a))
                        .map(year => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))
                    }
                  </select>
                </div>
              )}

              {selectedPeriod && (
                <div className="mt-6 p-6 bg-gray-800 rounded-xl border border-gray-700">
                  {(() => {
                    const data = summaryType === "quarterly"
                      ? channelData?.Gemini?.Quarterly?.[selectedPeriod]
                      : summaryType === "yearly"
                        ? channelData?.Gemini?.Yearly?.[selectedPeriod]
                        : channelData?.Gemini?.Overall;

                    if (!data) return <p className="text-gray-400">No data available for this period.</p>;

                    return (
                      <div className="space-y-6">
                        <div className="flex flex-wrap gap-4 mb-6">
                          <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 flex-1 min-w-[220px]">
                            <div className="text-sm text-gray-400 uppercase tracking-wider">Period</div>
                            <div className="font-bold text-white text-lg mt-1">
                              {summaryType === "quarterly"
                                ? data.quarter?.replace('_', ' ')
                                : summaryType === "yearly"
                                  ? data.year
                                  : "Overall"}
                            </div>
                          </div>
                          <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 flex-1 min-w-[220px]">
                            <div className="text-sm text-gray-400 uppercase tracking-wider">Credibility Score</div>
                            <div className="font-bold text-white text-lg mt-1">
                              {data.overall_credibility_score}/10
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-bold text-white mb-3 text-lg">Summary</h4>
                          <p className="text-gray-300 leading-relaxed">{data.summary}</p>
                        </div>

                        {data.posting_frequency_analysis && (
                          <div>
                            <h4 className="font-bold text-white mb-3 text-lg">Posting Frequency Analysis</h4>
                            <p className="text-gray-300 leading-relaxed">{data.posting_frequency_analysis}</p>
                          </div>
                        )}

                        {data.credibility_explanation && (
                          <div>
                            <h4 className="font-bold text-white mb-3 text-lg">Credibility Analysis</h4>
                            <p className="text-gray-300 leading-relaxed">{data.credibility_explanation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Performance Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
                <h3 className="font-bold text-xl mb-6 text-white">
                  Channel Performance Metrics
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Clarity Score", value: channelData.avg_clarity_of_analysis },
                    { label: "Credibility Score", value: channelData.avg_credibility_score },
                    { label: "Actionable Insights", value: channelData.avg_actionable_insights },
                    { label: "Risk Management", value: channelData.avg_risk_management },
                    { label: "Educational Value", value: channelData.avg_educational_purpose }
                  ].map((metric, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-400">{metric.label}:</span>
                      <span className="font-bold text-white text-lg">
                        {metric.value
                          ? parseFloat(metric.value.$numberDecimal).toFixed(1)
                          : "N/A"}
                        /10
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
                <h3 className="font-bold text-xl mb-6 text-white">Sentiment Analysis</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Strong Bullish:</span>
                    <span className="font-bold text-emerald-400 text-lg">
                      {channelData.total_strong_bullish || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Mild Bullish:</span>
                    <span className="font-bold text-emerald-300 text-lg">
                      {channelData.total_mild_bullish || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Strong Bearish:</span>
                    <span className="font-bold text-rose-400 text-lg">
                      {channelData.total_strong_bearish || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Mild Bearish:</span>
                    <span className="font-bold text-rose-300 text-lg">
                      {channelData.total_mild_bearish || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Win Rate Analysis */}
            {/* <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-700">
              <h3 className="font-bold text-xl mb-6 text-white">Win Rate Analysis</h3>
              <div className="space-y-4">
                {(() => {
                  const periods = [
                    { key: '24_hours', label: '24 Hours' },
                    { key: '7_days', label: '7 Days' },
                    { key: '30_days', label: '30 Days' },
                    { key: '90_days', label: '90 Days' },
                    { key: '180_days', label: '180 Days' },
                    { key: '1_year', label: '1 Year' }
                  ];

                  const winRates = periods.map(period => ({
                    ...period,
                    value: channelData.Overall?.[period.key]?.price_probablity_of_winning_percentage || 0
                  }));

                  const maxWinRate = Math.max(...winRates.map(item => item.value), 100);
                  
                  if (winRates.every(item => item.value === 0)) {
                    return (
                      <div className="h-40 flex items-center justify-center text-gray-500 italic">
                        No win rate data available
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      {winRates.map((period, index) => (
                        <div key={period.key} className="flex items-center justify-between">
                          <div className="flex items-center w-32">
                            <span className="text-sm text-gray-400 font-medium">{period.label}</span>
                          </div>
                          <div className="flex-1 mx-4">
                            <div className="bg-gray-800 rounded-full h-4 relative overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
                                style={{ 
                                  width: `${(period.value / maxWinRate) * 100}%`,
                                  minWidth: period.value > 0 ? '10px' : '0px'
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className="w-20 text-right">
                            <span className="text-sm font-bold text-white">
                              {period.value > 0 ? `${period.value.toFixed(1)}%` : 'N/A'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div> */}

            {/* Charts Grid - Dark Professional Theme */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
                <h3 className="font-bold text-xl mb-6 text-white">30-Day Performance</h3>
                <div className="h-40 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-black mb-3 text-white">
                      {channelData.Overall?.["30_days"] ? (
                        <>
                          {channelData.Overall["30_days"].probablity_weighted_returns_percentage > 0 ? "+" : ""}
                          {channelData.Overall["30_days"].probablity_weighted_returns_percentage.toFixed(2)}%
                        </>
                      ) : (
                        "N/A"
                      )}
                    </div>
                    <div className="text-lg font-semibold text-gray-400">ROI</div>
                    {channelData.Overall?.["30_days"] && (
                      <div className="mt-4">
                        <div className={`inline-flex px-4 py-2 rounded-lg font-semibold text-sm ${channelData.Overall["30_days"].probablity_weighted_returns_percentage > 0
                          ? "bg-emerald-900/50 text-emerald-400 border border-emerald-600"
                          : "bg-rose-900/50 text-rose-400 border border-rose-600"
                          }`}>
                          {channelData.Overall["30_days"].probablity_weighted_returns_percentage > 0
                            ? "Positive Returns"
                            : "Negative Returns"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
                <h3 className="font-bold text-xl mb-6 text-white">Win Rate Analysis</h3>
                <div className="space-y-4">
                  {(() => {
                    const periods = [
                      { key: '24_hours', label: '24 Hours' },
                      { key: '7_days', label: '7 Days' },
                      { key: '30_days', label: '30 Days' },
                      { key: '90_days', label: '90 Days' },
                      { key: '180_days', label: '180 Days' },
                      { key: '1_year', label: '1 Year' }
                    ];

                    const winRates = periods.map(period => ({
                      ...period,
                      value: channelData.Overall?.[period.key]?.price_probablity_of_winning_percentage || 0
                    }));

                    const maxWinRate = Math.max(...winRates.map(item => item.value), 100);

                    if (winRates.every(item => item.value === 0)) {
                      return (
                        <div className="h-32 flex items-center justify-center text-gray-500 italic">
                          No win rate data available
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-3">
                        {winRates.map((period, index) => (
                          <div key={period.key} className="flex items-center justify-between">
                            <div className="flex items-center w-32">
                              <span className="text-sm text-gray-400 font-medium">{period.label}</span>
                            </div>
                            <div className="flex-1 mx-4">
                              <div className="bg-gray-800 rounded-full h-4 relative overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
                                  style={{
                                    width: `${(period.value / maxWinRate) * 100}%`,
                                    minWidth: period.value > 0 ? '10px' : '0px'
                                  }}
                                ></div>
                              </div>
                            </div>
                            <div className="w-20 text-right">
                              <span className="text-sm font-bold text-white">
                                {period.value > 0 ? `${period.value.toFixed(1)}%` : 'N/A'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Best/Worst Picks - Dark Theme */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/20 rounded-2xl p-8 shadow-2xl border border-emerald-700/50 backdrop-blur">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🏆</span>
                  <div>
                    <div className="font-bold text-xl text-white">Best Performance</div>
                    <div className="text-sm text-emerald-400">
                      BTC - {channelData.start_date ? new Date(channelData.start_date).toLocaleDateString() : "N/A"}
                    </div>
                  </div>
                </div>
                <div className="text-3xl font-black text-emerald-400">
                  {channelData.Overall?.["30_days"]?.probablity_weighted_returns_percentage
                    ? `${channelData.Overall["30_days"].probablity_weighted_returns_percentage > 0 ? "+" : ""}${channelData.Overall["30_days"].probablity_weighted_returns_percentage.toFixed(1)}%`
                    : "N/A"}
                </div>
              </div>
              <div className="bg-gradient-to-br from-rose-900/20 to-rose-800/20 rounded-2xl p-8 shadow-2xl border border-rose-700/50 backdrop-blur">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">📉</span>
                  <div>
                    <div className="font-bold text-xl text-white">7-Day Performance</div>
                    <div className="text-sm text-rose-400">
                      BTC - {channelData.end_date ? new Date(channelData.end_date).toLocaleDateString() : "N/A"}
                    </div>
                  </div>
                </div>
                <div className="text-3xl font-black text-rose-400">
                  {channelData.Overall?.["7_days"]?.probablity_weighted_returns_percentage
                    ? `${channelData.Overall["7_days"].probablity_weighted_returns_percentage > 0 ? "+" : ""}${channelData.Overall["7_days"].probablity_weighted_returns_percentage.toFixed(1)}%`
                    : "N/A"}
                </div>
              </div>
            </div>

            {/* Bottom Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 rounded-2xl p-8 shadow-2xl border border-emerald-700">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-3xl">🎯</span>
                  <div>
                    <div className="font-bold text-xl text-white">Total Videos Posted</div>
                    <div className="text-sm text-emerald-200">Overall period</div>
                  </div>
                </div>
                <div className="text-4xl font-black text-white">
                  {channelData.total_records || 0}
                </div>
              </div>
              <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-2xl p-8 shadow-2xl border border-indigo-700">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-3xl">₿</span>
                  <div>
                    <div className="font-bold text-xl text-white">Crypto Related Videos</div>
                    <div className="text-sm text-indigo-200">Overall period</div>
                  </div>
                </div>
                <div className="text-4xl font-black text-white">
                  {channelData.crypto_related || 0}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Overview 2 - Gradient Modern Theme */}
        {tab === "overview2" && (
          <div className="flex flex-col gap-8">
            {/* Bio & Sentiment - Gradient Card */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-[2px] rounded-3xl">
              <div className="bg-white rounded-3xl p-8">
                <h3 className="text-2xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  About {channelData.influencer_name || channelData.channel_title}
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {channelData.channel_description ||
                    channelData.branding_channel_description ||
                    "No description available."}
                </p>
                <div className="flex gap-16 mt-6">
                  <div className="text-center">
                    <div className="text-4xl font-black mb-2 bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                      {bullishPercentage}%
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Bullish Calls</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-black mb-2 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                      {bearishPercentage}%
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Bearish Calls</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Analysis - Gradient Borders */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-[2px] rounded-3xl">
              <div className="bg-white rounded-3xl p-8">
                <h3 className="text-2xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Channel Summary Analysis
                </h3>

                <div className="flex gap-3 mb-6">
                  <button
                    onClick={() => {
                      setSummaryType("quarterly");
                      setSelectedPeriod("");
                    }}
                    className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${summaryType === "quarterly"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    Quarterly
                  </button>
                  <button
                    onClick={() => {
                      setSummaryType("yearly");
                      setSelectedPeriod("");
                    }}
                    className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${summaryType === "yearly"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    Yearly
                  </button>
                  <button
                    onClick={() => {
                      setSummaryType("overall");
                      setSelectedPeriod("overall");
                    }}
                    className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${summaryType === "overall"
                      ? "bg-gradient-to-r from-pink-600 to-red-600 text-white shadow-xl scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    Overall
                  </button>
                </div>

                {summaryType !== "overall" && (
                  <div className="mb-6">
                    <select
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl text-gray-800 font-medium focus:outline-none focus:ring-4 focus:ring-purple-300"
                    >
                      <option value="">Select a {summaryType === "quarterly" ? "quarter" : "year"}...</option>
                      {summaryType === "quarterly"
                        ? channelData?.Gemini?.Quarterly && Object.keys(channelData.Gemini.Quarterly)
                          .sort((a, b) => {
                            const [yearA, qA] = a.split('_');
                            const [yearB, qB] = b.split('_');
                            if (yearA !== yearB) return parseInt(yearB) - parseInt(yearA);
                            return qB.localeCompare(qA);
                          })
                          .map(quarter => (
                            <option key={quarter} value={quarter}>
                              {quarter.replace('_', ' ')}
                            </option>
                          ))
                        : channelData?.Gemini?.Yearly && Object.keys(channelData.Gemini.Yearly)
                          .sort((a, b) => parseInt(b) - parseInt(a))
                          .map(year => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))
                      }
                    </select>
                  </div>
                )}

                {selectedPeriod && (
                  <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 via-pink-50 to-red-50 rounded-2xl">
                    {(() => {
                      const data = summaryType === "quarterly"
                        ? channelData?.Gemini?.Quarterly?.[selectedPeriod]
                        : summaryType === "yearly"
                          ? channelData?.Gemini?.Yearly?.[selectedPeriod]
                          : channelData?.Gemini?.Overall;

                      if (!data) return <p className="text-gray-500">No data available for this period.</p>;

                      return (
                        <div className="space-y-6">
                          <div className="flex flex-wrap gap-4 mb-6">
                            <div className="bg-white p-5 rounded-2xl shadow-lg flex-1 min-w-[220px]">
                              <div className="text-sm text-gray-600 font-medium">Period</div>
                              <div className="font-extrabold text-xl mt-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {summaryType === "quarterly"
                                  ? data.quarter?.replace('_', ' ')
                                  : summaryType === "yearly"
                                    ? data.year
                                    : "Overall"}
                              </div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl shadow-lg flex-1 min-w-[220px]">
                              <div className="text-sm text-gray-600 font-medium">Credibility Score</div>
                              <div className="font-extrabold text-xl mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {data.overall_credibility_score}/10
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-bold text-lg mb-3 text-purple-800">Summary</h4>
                            <p className="text-gray-700 leading-relaxed">{data.summary}</p>
                          </div>

                          {data.posting_frequency_analysis && (
                            <div>
                              <h4 className="font-bold text-lg mb-3 text-purple-800">Posting Frequency Analysis</h4>
                              <p className="text-gray-700 leading-relaxed">{data.posting_frequency_analysis}</p>
                            </div>
                          )}

                          {data.credibility_explanation && (
                            <div>
                              <h4 className="font-bold text-lg mb-3 text-purple-800">Credibility Analysis</h4>
                              <p className="text-gray-700 leading-relaxed">{data.credibility_explanation}</p>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>

            {/* Performance Metrics with Gradient Accents */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-[2px] rounded-3xl">
                <div className="bg-white rounded-3xl p-8">
                  <h3 className="font-extrabold text-xl mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Channel Performance Metrics
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: "Clarity Score", value: channelData.avg_clarity_of_analysis, color: "from-blue-500 to-blue-600" },
                      { label: "Credibility Score", value: channelData.avg_credibility_score, color: "from-purple-500 to-purple-600" },
                      { label: "Actionable Insights", value: channelData.avg_actionable_insights, color: "from-pink-500 to-pink-600" },
                      { label: "Risk Management", value: channelData.avg_risk_management, color: "from-red-500 to-red-600" },
                      { label: "Educational Value", value: channelData.avg_educational_purpose, color: "from-orange-500 to-orange-600" }
                    ].map((metric, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700 font-medium">{metric.label}:</span>
                          <span className={`font-extrabold text-lg bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}>
                            {metric.value
                              ? parseFloat(metric.value.$numberDecimal).toFixed(1)
                              : "N/A"}
                            /10
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-full bg-gradient-to-r ${metric.color} rounded-full transition-all duration-500`}
                            style={{
                              width: `${metric.value ? (parseFloat(metric.value.$numberDecimal) / 10) * 100 : 0}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-[2px] rounded-3xl">
                <div className="bg-white rounded-3xl p-8">
                  <h3 className="font-extrabold text-xl mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Sentiment Analysis
                  </h3>
                  <div className="space-y-5">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Strong Bullish:</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-200 rounded-full h-3">
                          <div
                            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                            style={{ width: `${Math.min((channelData.total_strong_bullish || 0) / 10 * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="font-extrabold text-lg text-emerald-600">
                          {channelData.total_strong_bullish || 0}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Mild Bullish:</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-200 rounded-full h-3">
                          <div
                            className="h-full bg-gradient-to-r from-green-300 to-green-400 rounded-full"
                            style={{ width: `${Math.min((channelData.total_mild_bullish || 0) / 10 * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="font-extrabold text-lg text-green-600">
                          {channelData.total_mild_bullish || 0}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Strong Bearish:</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-200 rounded-full h-3">
                          <div
                            className="h-full bg-gradient-to-r from-red-400 to-rose-500 rounded-full"
                            style={{ width: `${Math.min((channelData.total_strong_bearish || 0) / 10 * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="font-extrabold text-lg text-rose-600">
                          {channelData.total_strong_bearish || 0}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Mild Bearish:</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-200 rounded-full h-3">
                          <div
                            className="h-full bg-gradient-to-r from-red-300 to-red-400 rounded-full"
                            style={{ width: `${Math.min((channelData.total_mild_bearish || 0) / 10 * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="font-extrabold text-lg text-red-600">
                          {channelData.total_mild_bearish || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Grid - Gradient Modern Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-[2px] rounded-3xl">
                <div className="bg-white rounded-3xl p-8">
                  <h3 className="font-extrabold text-xl mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    30-Day Performance
                  </h3>
                  <div className="h-40 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl font-black mb-2 bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                        {channelData.Overall?.["30_days"] ? (
                          <>
                            {channelData.Overall["30_days"].probablity_weighted_returns_percentage > 0 ? "+" : ""}
                            {channelData.Overall["30_days"].probablity_weighted_returns_percentage.toFixed(2)}%
                          </>
                        ) : (
                          "N/A"
                        )}
                      </div>
                      <div className="text-lg font-bold text-gray-700">ROI</div>
                      {channelData.Overall?.["30_days"] && (
                        <div className="mt-3">
                          <div className={`inline-flex px-4 py-2 rounded-full font-semibold text-sm ${channelData.Overall["30_days"].probablity_weighted_returns_percentage > 0
                            ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700"
                            : "bg-gradient-to-r from-red-100 to-pink-100 text-red-700"
                            }`}>
                            {channelData.Overall["30_days"].probablity_weighted_returns_percentage > 0
                              ? "Positive Returns"
                              : "Negative Returns"}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px] rounded-3xl">
                <div className="bg-white rounded-3xl p-8">
                  <h3 className="font-extrabold text-xl mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Win Rate Analysis
                  </h3>
                  <div className="space-y-3">
                    {(() => {
                      const periods = [
                        { key: '24_hours', label: '24 Hours' },
                        { key: '7_days', label: '7 Days' },
                        { key: '30_days', label: '30 Days' },
                        { key: '90_days', label: '90 Days' },
                        { key: '180_days', label: '180 Days' },
                        { key: '1_year', label: '1 Year' }
                      ];

                      const winRates = periods.map(period => ({
                        ...period,
                        value: channelData.Overall?.[period.key]?.price_probablity_of_winning_percentage || 0
                      }));

                      const maxWinRate = Math.max(...winRates.map(item => item.value), 100);

                      if (winRates.every(item => item.value === 0)) {
                        return (
                          <div className="h-32 flex items-center justify-center text-gray-500 italic">
                            No win rate data available
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-2">
                          {winRates.map((period, index) => {
                            const gradientColors = [
                              "from-blue-400 to-indigo-500",
                              "from-indigo-400 to-purple-500",
                              "from-purple-400 to-pink-500",
                              "from-pink-400 to-red-500",
                              "from-red-400 to-orange-500",
                              "from-orange-400 to-yellow-500"
                            ];

                            return (
                              <div key={period.key} className="flex items-center justify-between group">
                                <div className="flex items-center w-24">
                                  <span className="text-sm text-gray-700 font-semibold">{period.label}</span>
                                </div>
                                <div className="flex-1 mx-4">
                                  <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-full h-3 relative overflow-hidden">
                                    <div
                                      className={`h-full bg-gradient-to-r ${gradientColors[index]} rounded-full transition-all duration-500 ease-out group-hover:shadow-lg`}
                                      style={{
                                        width: `${(period.value / maxWinRate) * 100}%`,
                                        minWidth: period.value > 0 ? '10px' : '0px'
                                      }}
                                    ></div>
                                  </div>
                                </div>
                                <div className="w-16 text-right">
                                  <span className={`text-sm font-extrabold bg-gradient-to-r ${gradientColors[index]} bg-clip-text text-transparent`}>
                                    {period.value > 0 ? `${period.value.toFixed(1)}%` : 'N/A'}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Stats with Gradient Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative overflow-hidden rounded-3xl">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600"></div>
                <div className="relative p-8 text-white">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
                      <span className="text-3xl">📹</span>
                    </div>
                    <div>
                      <div className="font-extrabold text-2xl">Total Videos</div>
                      <div className="text-white/80">All time content</div>
                    </div>
                  </div>
                  <div className="text-5xl font-black">
                    {channelData.total_records || 0}
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-500 to-red-600"></div>
                <div className="relative p-8 text-white">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
                      <span className="text-3xl">🪙</span>
                    </div>
                    <div>
                      <div className="font-extrabold text-2xl">Crypto Videos</div>
                      <div className="text-white/80">Blockchain focused</div>
                    </div>
                  </div>
                  <div className="text-5xl font-black">
                    {channelData.crypto_related || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Overview 3 - Minimalist Clean Theme */}
        {tab === "overview3" && (
          <div className="flex flex-col gap-6">
            {/* Bio & Sentiment - Minimal Card */}
            <div className="bg-gray-50 rounded p-8 border-l-4 border-gray-900">
              <h3 className="text-xl font-medium mb-3 text-gray-900">
                {channelData.influencer_name || channelData.channel_title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                {channelData.channel_description ||
                  channelData.branding_channel_description ||
                  "No description available."}
              </p>
              <div className="flex gap-16 mt-4">
                <div>
                  <div className="text-3xl font-light text-gray-900">
                    {bullishPercentage}<span className="text-lg">%</span>
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Bullish</div>
                </div>
                <div>
                  <div className="text-3xl font-light text-gray-900">
                    {bearishPercentage}<span className="text-lg">%</span>
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Bearish</div>
                </div>
              </div>
            </div>

            {/* Summary Analysis - Minimal Design */}
            <div className="bg-white rounded p-8 shadow-sm">
              <h3 className="text-xl font-medium mb-6 text-gray-900 border-b pb-4">
                Channel Summary Analysis
              </h3>

              <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded">
                <button
                  onClick={() => {
                    setSummaryType("quarterly");
                    setSelectedPeriod("");
                  }}
                  className={`px-4 py-2 rounded text-sm font-medium transition-all ${summaryType === "quarterly"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  Quarterly
                </button>
                <button
                  onClick={() => {
                    setSummaryType("yearly");
                    setSelectedPeriod("");
                  }}
                  className={`px-4 py-2 rounded text-sm font-medium transition-all ${summaryType === "yearly"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  Yearly
                </button>
                <button
                  onClick={() => {
                    setSummaryType("overall");
                    setSelectedPeriod("overall");
                  }}
                  className={`px-4 py-2 rounded text-sm font-medium transition-all ${summaryType === "overall"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  Overall
                </button>
              </div>

              {summaryType !== "overall" && (
                <div className="mb-6">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full md:w-auto px-4 py-2 bg-white border border-gray-300 rounded text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  >
                    <option value="">Select {summaryType === "quarterly" ? "quarter" : "year"}</option>
                    {summaryType === "quarterly"
                      ? channelData?.Gemini?.Quarterly && Object.keys(channelData.Gemini.Quarterly)
                        .sort((a, b) => {
                          const [yearA, qA] = a.split('_');
                          const [yearB, qB] = b.split('_');
                          if (yearA !== yearB) return parseInt(yearB) - parseInt(yearA);
                          return qB.localeCompare(qA);
                        })
                        .map(quarter => (
                          <option key={quarter} value={quarter}>
                            {quarter.replace('_', ' ')}
                          </option>
                        ))
                      : channelData?.Gemini?.Yearly && Object.keys(channelData.Gemini.Yearly)
                        .sort((a, b) => parseInt(b) - parseInt(a))
                        .map(year => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))
                    }
                  </select>
                </div>
              )}

              {selectedPeriod && (
                <div className="mt-6 border-t pt-6">
                  {(() => {
                    const data = summaryType === "quarterly"
                      ? channelData?.Gemini?.Quarterly?.[selectedPeriod]
                      : summaryType === "yearly"
                        ? channelData?.Gemini?.Yearly?.[selectedPeriod]
                        : channelData?.Gemini?.Overall;

                    if (!data) return <p className="text-gray-400 text-sm">No data available</p>;

                    return (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-8 mb-6">
                          <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">Period</div>
                            <div className="font-medium text-gray-900 mt-1">
                              {summaryType === "quarterly"
                                ? data.quarter?.replace('_', ' ')
                                : summaryType === "yearly"
                                  ? data.year
                                  : "Overall"}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">Credibility</div>
                            <div className="font-medium text-gray-900 mt-1">
                              {data.overall_credibility_score}/10
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Summary</h4>
                          <p className="text-gray-600 text-sm leading-relaxed">{data.summary}</p>
                        </div>

                        {data.posting_frequency_analysis && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Posting Frequency</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">{data.posting_frequency_analysis}</p>
                          </div>
                        )}

                        {data.credibility_explanation && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Credibility Analysis</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">{data.credibility_explanation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Performance Metrics - Minimal Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded p-6 border border-gray-200">
                <h3 className="font-medium text-gray-900 mb-6 text-sm uppercase tracking-wider">
                  Performance Metrics
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Clarity", value: channelData.avg_clarity_of_analysis },
                    { label: "Credibility", value: channelData.avg_credibility_score },
                    { label: "Insights", value: channelData.avg_actionable_insights },
                    { label: "Risk Mgmt", value: channelData.avg_risk_management },
                    { label: "Education", value: channelData.avg_educational_purpose }
                  ].map((metric, index) => (
                    <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <span className="text-sm text-gray-600">{metric.label}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {metric.value
                          ? parseFloat(metric.value.$numberDecimal).toFixed(1)
                          : "-"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded p-6 border border-gray-200">
                <h3 className="font-medium text-gray-900 mb-6 text-sm uppercase tracking-wider">
                  Sentiment Breakdown
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-sm text-gray-600">Strong Bull</span>
                    <span className="text-sm font-medium text-green-700">
                      {channelData.total_strong_bullish || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-sm text-gray-600">Mild Bull</span>
                    <span className="text-sm font-medium text-green-600">
                      {channelData.total_mild_bullish || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-sm text-gray-600">Strong Bear</span>
                    <span className="text-sm font-medium text-red-700">
                      {channelData.total_strong_bearish || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-sm text-gray-600">Mild Bear</span>
                    <span className="text-sm font-medium text-red-600">
                      {channelData.total_mild_bearish || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance & Win Rate - Minimal Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded p-6 border border-gray-200">
                <h3 className="font-medium text-gray-900 mb-6 text-sm uppercase tracking-wider">
                  30-Day Performance
                </h3>
                <div className="h-32 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-light text-gray-900 mb-2">
                      {channelData.Overall?.["30_days"] ? (
                        <>
                          {channelData.Overall["30_days"].probablity_weighted_returns_percentage > 0 ? "+" : ""}
                          {channelData.Overall["30_days"].probablity_weighted_returns_percentage.toFixed(2)}%
                        </>
                      ) : (
                        "-"
                      )}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">ROI</div>
                    {channelData.Overall?.["30_days"] && (
                      <div className="mt-4">
                        <div className={`inline-block px-3 py-1 text-xs font-medium ${channelData.Overall["30_days"].probablity_weighted_returns_percentage > 0
                          ? "text-green-700 bg-green-50 border border-green-200"
                          : "text-red-700 bg-red-50 border border-red-200"
                          } rounded`}>
                          {channelData.Overall["30_days"].probablity_weighted_returns_percentage > 0
                            ? "Positive"
                            : "Negative"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded p-6 border border-gray-200">
                <h3 className="font-medium text-gray-900 mb-6 text-sm uppercase tracking-wider">
                  Win Rate by Period
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 text-gray-600 font-medium">Period</th>
                        <th className="text-right py-2 text-gray-600 font-medium">Win Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { key: '24_hours', label: '24 Hours' },
                        { key: '7_days', label: '7 Days' },
                        { key: '30_days', label: '30 Days' },
                        { key: '90_days', label: '90 Days' },
                        { key: '180_days', label: '180 Days' },
                        { key: '1_year', label: '1 Year' }
                      ].map((period) => (
                        <tr key={period.key} className="border-b border-gray-100">
                          <td className="py-3 text-gray-600">{period.label}</td>
                          <td className="py-3 text-right font-medium text-gray-900">
                            {channelData.Overall?.[period.key]?.price_probablity_of_winning_percentage
                              ? `${channelData.Overall[period.key].price_probablity_of_winning_percentage.toFixed(1)}%`
                              : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Bottom Stats - Minimal Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded p-6 border-l-4 border-gray-900">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Total Videos</div>
                <div className="text-3xl font-light text-gray-900">
                  {channelData.total_records || 0}
                </div>
              </div>
              <div className="bg-gray-50 rounded p-6 border-l-4 border-gray-900">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Crypto Videos</div>
                <div className="text-3xl font-light text-gray-900">
                  {channelData.crypto_related || 0}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Overview 4 - Vibrant Colorful Theme */}
        {tab === "overview4" && (
          <div className="flex flex-col gap-8">
            {/* Bio & Sentiment - Vibrant Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 p-1">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-orange-500/20 to-pink-500/20 animate-pulse"></div>
              <div className="relative bg-white/95 backdrop-blur rounded-3xl p-8">
                <h3 className="text-3xl font-black mb-4 text-gray-900">
                  {channelData.influencer_name || channelData.channel_title}
                </h3>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  {channelData.channel_description ||
                    channelData.branding_channel_description ||
                    "No description available."}
                </p>
                <div className="flex gap-8 mt-6">
                  <div className="bg-green-100 rounded-2xl p-6 flex-1 text-center transform hover:scale-105 transition">
                    <div className="text-5xl font-black text-green-600 mb-2">
                      {bullishPercentage}%
                    </div>
                    <div className="text-sm font-bold text-green-700 uppercase">Bullish</div>
                  </div>
                  <div className="bg-red-100 rounded-2xl p-6 flex-1 text-center transform hover:scale-105 transition">
                    <div className="text-5xl font-black text-red-600 mb-2">
                      {bearishPercentage}%
                    </div>
                    <div className="text-sm font-bold text-red-700 uppercase">Bearish</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Analysis - Colorful Design */}
            <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-8 border-2 border-purple-200">
              <h3 className="text-3xl font-black mb-6 text-purple-900">
                Channel Summary Analysis
              </h3>

              <div className="flex gap-4 mb-6 flex-wrap">
                <button
                  onClick={() => {
                    setSummaryType("quarterly");
                    setSelectedPeriod("");
                  }}
                  className={`px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 ${summaryType === "quarterly"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-2xl"
                    : "bg-white text-blue-600 border-2 border-blue-300"
                    }`}
                >
                  📊 Quarterly
                </button>
                <button
                  onClick={() => {
                    setSummaryType("yearly");
                    setSelectedPeriod("");
                  }}
                  className={`px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 ${summaryType === "yearly"
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-2xl"
                    : "bg-white text-purple-600 border-2 border-purple-300"
                    }`}
                >
                  📅 Yearly
                </button>
                <button
                  onClick={() => {
                    setSummaryType("overall");
                    setSelectedPeriod("overall");
                  }}
                  className={`px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 ${summaryType === "overall"
                    ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-2xl"
                    : "bg-white text-pink-600 border-2 border-pink-300"
                    }`}
                >
                  🌟 Overall
                </button>
              </div>

              {summaryType !== "overall" && (
                <div className="mb-6">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full md:w-auto px-6 py-4 bg-white border-3 border-purple-300 rounded-2xl text-purple-800 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-purple-400"
                  >
                    <option value="">🎯 Select {summaryType === "quarterly" ? "Quarter" : "Year"}</option>
                    {summaryType === "quarterly"
                      ? channelData?.Gemini?.Quarterly && Object.keys(channelData.Gemini.Quarterly)
                        .sort((a, b) => {
                          const [yearA, qA] = a.split('_');
                          const [yearB, qB] = b.split('_');
                          if (yearA !== yearB) return parseInt(yearB) - parseInt(yearA);
                          return qB.localeCompare(qA);
                        })
                        .map(quarter => (
                          <option key={quarter} value={quarter}>
                            {quarter.replace('_', ' ')}
                          </option>
                        ))
                      : channelData?.Gemini?.Yearly && Object.keys(channelData.Gemini.Yearly)
                        .sort((a, b) => parseInt(b) - parseInt(a))
                        .map(year => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))
                    }
                  </select>
                </div>
              )}

              {selectedPeriod && (
                <div className="mt-6 bg-white rounded-2xl p-6 shadow-xl border-2 border-purple-200">
                  {(() => {
                    const data = summaryType === "quarterly"
                      ? channelData?.Gemini?.Quarterly?.[selectedPeriod]
                      : summaryType === "yearly"
                        ? channelData?.Gemini?.Yearly?.[selectedPeriod]
                        : channelData?.Gemini?.Overall;

                    if (!data) return <p className="text-gray-500 text-center text-lg">🚫 No data available</p>;

                    return (
                      <div className="space-y-6">
                        <div className="flex flex-wrap gap-4 mb-6">
                          <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-6 rounded-2xl flex-1 min-w-[200px] border-2 border-blue-300">
                            <div className="text-lg font-bold text-blue-800">📅 Period</div>
                            <div className="text-2xl font-black text-blue-900 mt-2">
                              {summaryType === "quarterly"
                                ? data.quarter?.replace('_', ' ')
                                : summaryType === "yearly"
                                  ? data.year
                                  : "Overall"}
                            </div>
                          </div>
                          <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-6 rounded-2xl flex-1 min-w-[200px] border-2 border-purple-300">
                            <div className="text-lg font-bold text-purple-800">⭐ Credibility</div>
                            <div className="text-2xl font-black text-purple-900 mt-2">
                              {data.overall_credibility_score}/10
                            </div>
                          </div>
                        </div>

                        <div className="bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-300">
                          <h4 className="font-black text-xl mb-3 text-yellow-800">💡 Summary</h4>
                          <p className="text-gray-700 leading-relaxed text-lg">{data.summary}</p>
                        </div>

                        {data.posting_frequency_analysis && (
                          <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-300">
                            <h4 className="font-black text-xl mb-3 text-green-800">📈 Posting Frequency</h4>
                            <p className="text-gray-700 leading-relaxed text-lg">{data.posting_frequency_analysis}</p>
                          </div>
                        )}

                        {data.credibility_explanation && (
                          <div className="bg-orange-50 p-6 rounded-2xl border-2 border-orange-300">
                            <h4 className="font-black text-xl mb-3 text-orange-800">🎯 Credibility Analysis</h4>
                            <p className="text-gray-700 leading-relaxed text-lg">{data.credibility_explanation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Performance Metrics - Colorful Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-8 text-white shadow-2xl">
                <h3 className="font-black text-2xl mb-6 flex items-center gap-3">
                  📊 Performance Metrics
                </h3>
                <div className="space-y-5">
                  {[
                    { label: "Clarity", value: channelData.avg_clarity_of_analysis, icon: "🎯" },
                    { label: "Credibility", value: channelData.avg_credibility_score, icon: "⭐" },
                    { label: "Insights", value: channelData.avg_actionable_insights, icon: "💡" },
                    { label: "Risk Mgmt", value: channelData.avg_risk_management, icon: "🛡️" },
                    { label: "Education", value: channelData.avg_educational_purpose, icon: "📚" }
                  ].map((metric, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/90 font-medium flex items-center gap-2">
                          <span className="text-2xl">{metric.icon}</span>
                          {metric.label}
                        </span>
                        <span className="font-black text-xl">
                          {metric.value
                            ? parseFloat(metric.value.$numberDecimal).toFixed(1)
                            : "N/A"}
                          /10
                        </span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-white/60 to-white/80 rounded-full transition-all duration-700"
                          style={{
                            width: `${metric.value ? (parseFloat(metric.value.$numberDecimal) / 10) * 100 : 0}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
                <h3 className="font-black text-2xl mb-6 flex items-center gap-3">
                  💭 Sentiment Analysis
                </h3>
                <div className="space-y-5">
                  <div className="bg-white/20 backdrop-blur rounded-2xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">🟢 Strong Bullish</span>
                      <span className="font-black text-2xl">
                        {channelData.total_strong_bullish || 0}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur rounded-2xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">🟡 Mild Bullish</span>
                      <span className="font-black text-2xl">
                        {channelData.total_mild_bullish || 0}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur rounded-2xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">🔴 Strong Bearish</span>
                      <span className="font-black text-2xl">
                        {channelData.total_strong_bearish || 0}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur rounded-2xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">🟠 Mild Bearish</span>
                      <span className="font-black text-2xl">
                        {channelData.total_mild_bearish || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Grid - Vibrant Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl p-8 text-white shadow-2xl">
                <h3 className="font-black text-2xl mb-6 flex items-center gap-3">
                  📈 30-Day Performance
                </h3>
                <div className="h-48 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-black mb-3">
                      {channelData.Overall?.["30_days"] ? (
                        <>
                          {channelData.Overall["30_days"].probablity_weighted_returns_percentage > 0 ? "+" : ""}
                          {channelData.Overall["30_days"].probablity_weighted_returns_percentage.toFixed(2)}%
                        </>
                      ) : (
                        "N/A"
                      )}
                    </div>
                    <div className="text-2xl font-bold text-white/90">ROI</div>
                    {channelData.Overall?.["30_days"] && (
                      <div className="mt-4 text-lg font-medium text-white/80">
                        {channelData.Overall["30_days"].probablity_weighted_returns_percentage > 0
                          ? "🚀 Positive Returns!"
                          : "📉 Negative Returns"}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl p-8 text-white shadow-2xl">
                <h3 className="font-black text-2xl mb-6 flex items-center gap-3">
                  🎯 Win Rate Analysis
                </h3>
                <div className="space-y-3">
                  {(() => {
                    const periods = [
                      { key: '24_hours', label: '24 Hours', emoji: '⏰' },
                      { key: '7_days', label: '7 Days', emoji: '📅' },
                      { key: '30_days', label: '30 Days', emoji: '📆' },
                      { key: '90_days', label: '90 Days', emoji: '🗓️' },
                      { key: '180_days', label: '180 Days', emoji: '📊' },
                      { key: '1_year', label: '1 Year', emoji: '🎯' }
                    ];

                    const winRates = periods.map(period => ({
                      ...period,
                      value: channelData.Overall?.[period.key]?.price_probablity_of_winning_percentage || 0
                    }));

                    const maxWinRate = Math.max(...winRates.map(item => item.value), 100);

                    if (winRates.every(item => item.value === 0)) {
                      return (
                        <div className="h-40 flex items-center justify-center text-white/70 text-lg">
                          🚫 No win rate data available
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-3">
                        {winRates.map((period, index) => (
                          <div key={period.key} className="flex items-center justify-between bg-white/10 backdrop-blur rounded-xl p-2">
                            <div className="flex items-center w-32 gap-2">
                              <span className="text-xl">{period.emoji}</span>
                              <span className="text-sm font-bold text-white/90">{period.label}</span>
                            </div>
                            <div className="flex-1 mx-3">
                              <div className="bg-white/20 rounded-full h-4 relative overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 rounded-full transition-all duration-700 ease-out transform hover:scale-110"
                                  style={{
                                    width: `${(period.value / maxWinRate) * 100}%`,
                                    minWidth: period.value > 0 ? '15px' : '0px'
                                  }}
                                ></div>
                              </div>
                            </div>
                            <div className="w-20 text-right">
                              <span className="text-lg font-black">
                                {period.value > 0 ? `${period.value.toFixed(1)}%` : 'N/A'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Bottom Stats - Vibrant Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition"></div>
                <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-8 text-white shadow-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-6xl animate-bounce">🎬</div>
                    <div>
                      <div className="font-black text-3xl">Total Videos</div>
                      <div className="text-white/80 font-medium">Complete collection</div>
                    </div>
                  </div>
                  <div className="text-6xl font-black">
                    {channelData.total_records || 0}
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition"></div>
                <div className="relative bg-gradient-to-r from-purple-400 to-blue-500 rounded-3xl p-8 text-white shadow-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-6xl animate-pulse">💰</div>
                    <div>
                      <div className="font-black text-3xl">Crypto Content</div>
                      <div className="text-white/80 font-medium">Blockchain focused</div>
                    </div>
                  </div>
                  <div className="text-6xl font-black">
                    {channelData.crypto_related || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
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
