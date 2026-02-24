"use client";
import { Fragment, useState } from "react";

export default function PerformanceTable({
  channelData,
  hoveredColumnROI,
  setHoveredColumnROI,
  hoveredRowROI,
  setHoveredRowROI,
  hoveredColumnWinRate,
  setHoveredColumnWinRate,
  hoveredRowWinRate,
  setHoveredRowWinRate,
  formatPercentageWithStyling,
  currentYear
}) {
  const [expandedYearsROI, setExpandedYearsROI] = useState({});
  const [expandedYearsWinRate, setExpandedYearsWinRate] = useState({});

  const quarterLabels = {
    q1: "Jan - Mar (Q1)",
    q2: "Apr - Jun (Q2)",
    q3: "Jul - Sep (Q3)",
    q4: "Oct - Dec (Q4)",
  };

  const toggleYearROI = (year) => {
    setExpandedYearsROI(prev => ({
      ...prev,
      [year]: !prev[year]
    }));
  };

  const toggleYearWinRate = (year) => {
    setExpandedYearsWinRate(prev => ({
      ...prev,
      [year]: !prev[year]
    }));
  };

  return (
    <>
      {/* Performance Overview ROI Table */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-black">Performance Overview ROI</h3>
        </div>
        <p className="text-md mb-3 text-to-purple">Hover Mouse for info</p>
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm text-black">
            <thead>
              <tr>
                <th className="border border-gray-300 bg-gray-50 px-3 py-1 font-medium text-to-purple" rowSpan={2}>Year</th>
                <th className="border border-gray-300 bg-gray-50 px-3 py-1 font-medium text-to-purple" colSpan={8}>Holding Period (From the Date of Post/Recommendations)</th>
              </tr>
              <tr>
                <th className="border border-gray-300 bg-gray-50 px-3 py-1 font-medium text-to-purple cursor-pointer"
                  onMouseEnter={() => setHoveredColumnROI('1_hour')}
                  onMouseLeave={() => setHoveredColumnROI(null)}>1 Hour</th>
                <th className="border border-gray-300 bg-gray-50 px-3 py-1 font-medium text-to-purple cursor-pointer"
                  onMouseEnter={() => setHoveredColumnROI('24_hours')}
                  onMouseLeave={() => setHoveredColumnROI(null)}>24 Hours</th>
                <th className="border border-gray-300 bg-gray-50 px-3 py-1 font-medium text-to-purple cursor-pointer"
                  onMouseEnter={() => setHoveredColumnROI('7_days')}
                  onMouseLeave={() => setHoveredColumnROI(null)}>7 Days</th>
                <th className="border border-gray-300 bg-gray-50 px-3 py-1 font-medium text-to-purple cursor-pointer"
                  onMouseEnter={() => setHoveredColumnROI('30_days')}
                  onMouseLeave={() => setHoveredColumnROI(null)}>30 Days</th>
                <th className="border border-gray-300 bg-gray-50 px-3 py-1 font-medium text-to-purple cursor-pointer"
                  onMouseEnter={() => setHoveredColumnROI('60_days')}
                  onMouseLeave={() => setHoveredColumnROI(null)}>60 Days</th>
                <th className="border border-gray-300 bg-gray-50 px-3 py-1 font-medium text-to-purple cursor-pointer"
                  onMouseEnter={() => setHoveredColumnROI('90_days')}
                  onMouseLeave={() => setHoveredColumnROI(null)}>90 Days</th>
                <th className="border border-gray-300 bg-gray-50 px-3 py-1 font-medium text-to-purple cursor-pointer"
                  onMouseEnter={() => setHoveredColumnROI('180_days')}
                  onMouseLeave={() => setHoveredColumnROI(null)}>180 Days</th>
                <th className="border border-gray-300 bg-gray-50 px-3 py-1 font-medium text-to-purple cursor-pointer"
                  onMouseEnter={() => setHoveredColumnROI('1_year')}
                  onMouseLeave={() => setHoveredColumnROI(null)}>1 Year</th>
              </tr>
            </thead>
            <tbody>
              {channelData?.Yearly &&
                Object.entries(channelData.Yearly)
                  .filter(([year]) => parseInt(year) !== 2026)
                  .sort(([a], [b]) => Number(b) - Number(a))
                  .map(([year, yearData]) => {
                    const yearQuarters = channelData?.Quarterly
                      ? Object.entries(channelData.Quarterly)
                        .filter(([quarter]) => quarter && quarter.startsWith(year))
                        .sort(([a], [b]) => {
                          const qA = parseInt(a.split("-")[1]?.replace("Q", "") || "0");
                          const qB = parseInt(b.split("-")[1]?.replace("Q", "") || "0");
                          return qA - qB;
                        })
                      : [];

                    return (
                      <Fragment key={year}>
                        {/* Year row */}
                        <tr className="hover:bg-gray-50">
                          <td
                            className="border border-gray-300 bg-gray-50 px-3 py-1 font-medium text-to-purple cursor-pointer"
                            onClick={() => yearQuarters.length > 0 && toggleYearROI(year)}
                          >
                            <div className="flex items-center gap-2">
                              <span>{parseInt(year) >= currentYear ? `${year}*` : year}</span>
                              {yearQuarters.length > 0 && (
                                <svg
                                  className={`w-4 h-4 transform transition-transform ${expandedYearsROI[year] ? "rotate-180" : ""}`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              )}
                            </div>
                          </td>
                          <td
                            className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${(() => {
                              const result = formatPercentageWithStyling(yearData?.["1_hour"]?.probablity_weighted_returns_percentage, '1_hour', hoveredColumnROI, hoveredRowROI, year);
                              if (result.isHovered) {
                                return result.isNegative ? "text-red-800 font-bold" : "text-to-purple font-bold";
                              } else {
                                return result.isNegative ? "text-red-200 hover:text-red-800 hover:font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold";
                              }
                            })()} ${hoveredColumnROI === '1_hour' && hoveredRowROI === year ? 'bg-yellow-200' : ''}`}
                            onMouseEnter={() => {
                              setHoveredColumnROI('1_hour');
                              setHoveredRowROI(year);
                            }}
                            onMouseLeave={() => {
                              setHoveredColumnROI(null);
                              setHoveredRowROI(null);
                            }}
                          >
                            {(() => {
                              const result = formatPercentageWithStyling(yearData?.["1_hour"]?.probablity_weighted_returns_percentage, '1_hour', hoveredColumnROI, hoveredRowROI, year);
                              return result.display === 'N/A' ? <span className={result.isHovered ? "text-red-800 font-bold" : "text-red-200 hover:text-red-800 hover:font-bold"}>N/A</span> : result.display;
                            })()}
                          </td>
                          <td
                            className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${(() => {
                              const result = formatPercentageWithStyling(yearData?.["24_hours"]?.probablity_weighted_returns_percentage, '24_hours', hoveredColumnROI, hoveredRowROI, year);
                              if (result.isHovered) {
                                return result.isNegative ? "text-red-800 font-bold" : "text-to-purple font-bold";
                              } else {
                                return result.isNegative ? "text-red-200 hover:text-red-800 hover:font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold";
                              }
                            })()} ${hoveredColumnROI === '24_hours' && hoveredRowROI === year ? 'bg-yellow-200' : ''}`}
                            onMouseEnter={() => {
                              setHoveredColumnROI('24_hours');
                              setHoveredRowROI(year);
                            }}
                            onMouseLeave={() => {
                              setHoveredColumnROI(null);
                              setHoveredRowROI(null);
                            }}
                          >
                            {(() => {
                              const result = formatPercentageWithStyling(yearData?.["24_hours"]?.probablity_weighted_returns_percentage, '24_hours', hoveredColumnROI, hoveredRowROI, year);
                              return result.display === 'N/A' ? <span className={result.isHovered ? "text-red-800 font-bold" : "text-red-200 hover:text-red-800 hover:font-bold"}>N/A</span> : result.display;
                            })()}
                          </td>
                          <td
                            className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${(() => {
                              const result = formatPercentageWithStyling(yearData?.["7_days"]?.probablity_weighted_returns_percentage, '7_days', hoveredColumnROI, hoveredRowROI, year);
                              if (result.isHovered) {
                                return result.isNegative ? "text-red-800 font-bold" : "text-to-purple font-bold";
                              } else {
                                return result.isNegative ? "text-red-200 hover:text-red-800 hover:font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold";
                              }
                            })()} ${hoveredColumnROI === '7_days' && hoveredRowROI === year ? 'bg-yellow-200' : ''}`}
                            onMouseEnter={() => {
                              setHoveredColumnROI('7_days');
                              setHoveredRowROI(year);
                            }}
                            onMouseLeave={() => {
                              setHoveredColumnROI(null);
                              setHoveredRowROI(null);
                            }}
                          >
                            {(() => {
                              const result = formatPercentageWithStyling(yearData?.["7_days"]?.probablity_weighted_returns_percentage, '7_days', hoveredColumnROI, hoveredRowROI, year);
                              return result.display === 'N/A' ? <span className={result.isHovered ? "text-red-800 font-bold" : "text-red-200 hover:text-red-800 hover:font-bold"}>N/A</span> : result.display;
                            })()}
                          </td>
                          <td
                            className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${(() => {
                              const result = formatPercentageWithStyling(yearData?.["30_days"]?.probablity_weighted_returns_percentage, '30_days', hoveredColumnROI, hoveredRowROI, year);
                              if (result.isHovered) {
                                return result.isNegative ? "text-red-800 font-bold" : "text-to-purple font-bold";
                              } else {
                                return result.isNegative ? "text-red-200 hover:text-red-800 hover:font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold";
                              }
                            })()} ${hoveredColumnROI === '30_days' && hoveredRowROI === year ? 'bg-yellow-200' : ''}`}
                            onMouseEnter={() => {
                              setHoveredColumnROI('30_days');
                              setHoveredRowROI(year);
                            }}
                            onMouseLeave={() => {
                              setHoveredColumnROI(null);
                              setHoveredRowROI(null);
                            }}
                          >
                            {(() => {
                              const result = formatPercentageWithStyling(yearData?.["30_days"]?.probablity_weighted_returns_percentage, '30_days', hoveredColumnROI, hoveredRowROI, year);
                              return result.display === 'N/A' ? <span className={result.isHovered ? "text-red-800 font-bold" : "text-red-200 hover:text-red-800 hover:font-bold"}>N/A</span> : result.display;
                            })()}
                          </td>
                          <td
                            className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${(() => {
                              const result = formatPercentageWithStyling(yearData?.["60_days"]?.probablity_weighted_returns_percentage, '60_days', hoveredColumnROI, hoveredRowROI, year);
                              if (result.isHovered) {
                                return result.isNegative ? "text-red-800 font-bold" : "text-to-purple font-bold";
                              } else {
                                return result.isNegative ? "text-red-200 hover:text-red-800 hover:font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold";
                              }
                            })()} ${hoveredColumnROI === '60_days' && hoveredRowROI === year ? 'bg-yellow-200' : ''}`}
                            onMouseEnter={() => {
                              setHoveredColumnROI('60_days');
                              setHoveredRowROI(year);
                            }}
                            onMouseLeave={() => {
                              setHoveredColumnROI(null);
                              setHoveredRowROI(null);
                            }}
                          >
                            {(() => {
                              const result = formatPercentageWithStyling(yearData?.["60_days"]?.probablity_weighted_returns_percentage, '60_days', hoveredColumnROI, hoveredRowROI, year);
                              return result.display === 'N/A' ? <span className={result.isHovered ? "text-red-800 font-bold" : "text-red-200 hover:text-red-800 hover:font-bold"}>N/A</span> : result.display;
                            })()}
                          </td>
                          <td
                            className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${(() => {
                              const result = formatPercentageWithStyling(yearData?.["90_days"]?.probablity_weighted_returns_percentage, '90_days', hoveredColumnROI, hoveredRowROI, year);
                              if (result.isHovered) {
                                return result.isNegative ? "text-red-800 font-bold" : "text-to-purple font-bold";
                              } else {
                                return result.isNegative ? "text-red-200 hover:text-red-800 hover:font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold";
                              }
                            })()} ${hoveredColumnROI === '90_days' && hoveredRowROI === year ? 'bg-yellow-200' : ''}`}
                            onMouseEnter={() => {
                              setHoveredColumnROI('90_days');
                              setHoveredRowROI(year);
                            }}
                            onMouseLeave={() => {
                              setHoveredColumnROI(null);
                              setHoveredRowROI(null);
                            }}
                          >
                            {(() => {
                              const result = formatPercentageWithStyling(yearData?.["90_days"]?.probablity_weighted_returns_percentage, '90_days', hoveredColumnROI, hoveredRowROI, year);
                              return result.display === 'N/A' ? <span className={result.isHovered ? "text-red-800 font-bold" : "text-red-200 hover:text-red-800 hover:font-bold"}>N/A</span> : result.display;
                            })()}
                          </td>
                          <td
                            className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${(() => {
                              const result = formatPercentageWithStyling(yearData?.["180_days"]?.probablity_weighted_returns_percentage, '180_days', hoveredColumnROI, hoveredRowROI, year);
                              if (result.isHovered) {
                                return result.isNegative ? "text-red-800 font-bold" : "text-to-purple font-bold";
                              } else {
                                return result.isNegative ? "text-red-200 hover:text-red-800 hover:font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold";
                              }
                            })()} ${hoveredColumnROI === '180_days' && hoveredRowROI === year ? 'bg-yellow-200' : ''}`}
                            onMouseEnter={() => {
                              setHoveredColumnROI('180_days');
                              setHoveredRowROI(year);
                            }}
                            onMouseLeave={() => {
                              setHoveredColumnROI(null);
                              setHoveredRowROI(null);
                            }}
                          >
                            {(() => {
                              const result = formatPercentageWithStyling(yearData?.["180_days"]?.probablity_weighted_returns_percentage, '180_days', hoveredColumnROI, hoveredRowROI, year);
                              return result.display === 'N/A' ? <span className={result.isHovered ? "text-red-800 font-bold" : "text-red-200 hover:text-red-800 hover:font-bold"}>N/A</span> : result.display;
                            })()}
                          </td>
                          <td
                            className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${(() => {
                              const result = formatPercentageWithStyling(yearData?.["1_year"]?.probablity_weighted_returns_percentage, '1_year', hoveredColumnROI, hoveredRowROI, year);
                              if (result.isHovered) {
                                return result.isNegative ? "text-red-800 font-bold" : "text-to-purple font-bold";
                              } else {
                                return result.isNegative ? "text-red-200 hover:text-red-800 hover:font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold";
                              }
                            })()} ${hoveredColumnROI === '1_year' && hoveredRowROI === year ? 'bg-yellow-200' : ''}`}
                            onMouseEnter={() => {
                              setHoveredColumnROI('1_year');
                              setHoveredRowROI(year);
                            }}
                            onMouseLeave={() => {
                              setHoveredColumnROI(null);
                              setHoveredRowROI(null);
                            }}
                          >
                            {(() => {
                              const result = formatPercentageWithStyling(yearData?.["1_year"]?.probablity_weighted_returns_percentage, '1_year', hoveredColumnROI, hoveredRowROI, year);
                              return result.display === 'N/A' ? <span className={result.isHovered ? "text-red-800 font-bold" : "text-red-200 hover:text-red-800 hover:font-bold"}>N/A</span> : result.display;
                            })()}
                          </td>
                        </tr>

                        {/* Quarter rows */}
                        {expandedYearsROI[year] && yearQuarters.map(([quarter, quarterData]) => (
                          <tr key={quarter} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-3 py-1 text-xs text-to-purple">
                              {quarterLabels[quarter.slice(-2).toLowerCase()] ?? quarter}
                            </td>
                            <td
                              className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${(() => {
                                const result = formatPercentageWithStyling(quarterData?.["1_hour"]?.probablity_weighted_returns_percentage, '1_hour', hoveredColumnROI, hoveredRowROI, quarter);
                                if (result.isHovered) {
                                  return result.isNegative ? "text-red-800 font-bold" : "text-to-purple font-bold";
                                } else {
                                  return result.isNegative ? "text-red-200 hover:text-red-800 hover:font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold";
                                }
                              })()} ${hoveredColumnROI === '1_hour' && hoveredRowROI === quarter ? 'bg-yellow-200' : ''
                                }`}
                              onMouseEnter={() => {
                                setHoveredColumnROI('1_hour');
                                setHoveredRowROI(quarter);
                              }}
                              onMouseLeave={() => {
                                setHoveredColumnROI(null);
                                setHoveredRowROI(null);
                              }}
                            >
                              {(() => {
                                const result = formatPercentageWithStyling(quarterData?.["1_hour"]?.probablity_weighted_returns_percentage, '1_hour', hoveredColumnROI, hoveredRowROI, quarter);
                                return result.display === 'N/A' ? <span className={result.isHovered ? "text-red-800 font-bold" : "text-red-200 hover:text-red-800 hover:font-bold"}>N/A</span> : result.display;
                              })()}
                            </td>

                            <td className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${(() => {
                              const result = formatPercentageWithStyling(quarterData?.["24_hours"]?.probablity_weighted_returns_percentage, '24_hours', hoveredColumnROI, hoveredRowROI, quarter);
                              if (result.isHovered) {
                                return result.isNegative ? "text-red-800 font-bold" : "text-to-purple font-bold";
                              } else {
                                return result.isNegative ? "text-red-200 hover:text-red-800 hover:font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold";
                              }
                            })()} ${hoveredColumnROI === '24_hours' && hoveredRowROI === quarter ? 'bg-yellow-200' : ''
                              }`}
                              onMouseEnter={() => {
                                setHoveredColumnROI('24_hours');
                                setHoveredRowROI(quarter);
                              }}
                              onMouseLeave={() => {
                                setHoveredColumnROI(null);
                                setHoveredRowROI(null);
                              }}>
                              {(() => {
                                const result = formatPercentageWithStyling(quarterData?.["24_hours"]?.probablity_weighted_returns_percentage, '24_hours', hoveredColumnROI, hoveredRowROI, quarter);
                                return result.display === 'N/A' ? <span className={result.isHovered ? "text-red-800 font-bold" : "text-red-200 hover:text-red-800 hover:font-bold"}>N/A</span> : result.display;
                              })()}
                            </td>

                            <td className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${(() => {
                              const result = formatPercentageWithStyling(quarterData?.["7_days"]?.probablity_weighted_returns_percentage, '7_days', hoveredColumnROI, hoveredRowROI, quarter);
                              if (result.isHovered) {
                                return result.isNegative ? "text-red-800 font-bold" : "text-to-purple font-bold";
                              } else {
                                return result.isNegative ? "text-red-200 hover:text-red-800 hover:font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold";
                              }
                            })()} ${hoveredColumnROI === '7_days' && hoveredRowROI === quarter ? 'bg-yellow-200' : ''
                              }`}
                              onMouseEnter={() => {
                                setHoveredColumnROI('7_days');
                                setHoveredRowROI(quarter);
                              }}
                              onMouseLeave={() => {
                                setHoveredColumnROI(null);
                                setHoveredRowROI(null);
                              }}>
                              {(() => {
                                const result = formatPercentageWithStyling(quarterData?.["7_days"]?.probablity_weighted_returns_percentage, '7_days', hoveredColumnROI, hoveredRowROI, quarter);
                                return result.display === 'N/A' ? <span className={result.isHovered ? "text-red-800 font-bold" : "text-red-200 hover:text-red-800 hover:font-bold"}>N/A</span> : result.display;
                              })()}
                            </td>

                            <td className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${(() => {
                              const result = formatPercentageWithStyling(quarterData?.["30_days"]?.probablity_weighted_returns_percentage, '30_days', hoveredColumnROI, hoveredRowROI, quarter);
                              if (result.isHovered) {
                                return result.isNegative ? "text-red-800 font-bold" : "text-to-purple font-bold";
                              } else {
                                return result.isNegative ? "text-red-200 hover:text-red-800 hover:font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold";
                              }
                            })()} ${hoveredColumnROI === '30_days' && hoveredRowROI === quarter ? 'bg-yellow-200' : ''
                              }`}
                              onMouseEnter={() => {
                                setHoveredColumnROI('30_days');
                                setHoveredRowROI(quarter);
                              }}
                              onMouseLeave={() => {
                                setHoveredColumnROI(null);
                                setHoveredRowROI(null);
                              }}>
                              {(() => {
                                const result = formatPercentageWithStyling(quarterData?.["30_days"]?.probablity_weighted_returns_percentage, '30_days', hoveredColumnROI, hoveredRowROI, quarter);
                                return result.display === 'N/A' ? <span className={result.isHovered ? "text-red-800 font-bold" : "text-red-200 hover:text-red-800 hover:font-bold"}>N/A</span> : result.display;
                              })()}
                            </td>

                            <td className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${(() => {
                              const result = formatPercentageWithStyling(quarterData?.["60_days"]?.probablity_weighted_returns_percentage, '60_days', hoveredColumnROI, hoveredRowROI, quarter);
                              if (result.isHovered) {
                                return result.isNegative ? "text-red-800 font-bold" : "text-to-purple font-bold";
                              } else {
                                return result.isNegative ? "text-red-200 hover:text-red-800 hover:font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold";
                              }
                            })()} ${hoveredColumnROI === '60_days' && hoveredRowROI === quarter ? 'bg-yellow-200' : ''
                              }`}
                              onMouseEnter={() => {
                                setHoveredColumnROI('60_days');
                                setHoveredRowROI(quarter);
                              }}
                              onMouseLeave={() => {
                                setHoveredColumnROI(null);
                                setHoveredRowROI(null);
                              }}>
                              {(() => {
                                const result = formatPercentageWithStyling(quarterData?.["60_days"]?.probablity_weighted_returns_percentage, '60_days', hoveredColumnROI, hoveredRowROI, quarter);
                                return result.display === 'N/A' ? <span className={result.isHovered ? "text-red-800 font-bold" : "text-red-200 hover:text-red-800 hover:font-bold"}>N/A</span> : result.display;
                              })()}
                            </td>

                            <td className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${(() => {
                              const result = formatPercentageWithStyling(quarterData?.["90_days"]?.probablity_weighted_returns_percentage, '90_days', hoveredColumnROI, hoveredRowROI, quarter);
                              if (result.isHovered) {
                                return result.isNegative ? "text-red-800 font-bold" : "text-to-purple font-bold";
                              } else {
                                return result.isNegative ? "text-red-200 hover:text-red-800 hover:font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold";
                              }
                            })()} ${hoveredColumnROI === '90_days' && hoveredRowROI === quarter ? 'bg-yellow-200' : ''
                              }`}
                              onMouseEnter={() => {
                                setHoveredColumnROI('90_days');
                                setHoveredRowROI(quarter);
                              }}
                              onMouseLeave={() => {
                                setHoveredColumnROI(null);
                                setHoveredRowROI(null);
                              }}>
                              {(() => {
                                const result = formatPercentageWithStyling(quarterData?.["90_days"]?.probablity_weighted_returns_percentage, '90_days', hoveredColumnROI, hoveredRowROI, quarter);
                                return result.display === 'N/A' ? <span className={result.isHovered ? "text-red-800 font-bold" : "text-red-200 hover:text-red-800 hover:font-bold"}>N/A</span> : result.display;
                              })()}
                            </td>

                            <td className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${(() => {
                              const result = formatPercentageWithStyling(quarterData?.["180_days"]?.probablity_weighted_returns_percentage, '180_days', hoveredColumnROI, hoveredRowROI, quarter);
                              if (result.isHovered) {
                                return result.isNegative ? "text-red-800 font-bold" : "text-to-purple font-bold";
                              } else {
                                return result.isNegative ? "text-red-200 hover:text-red-800 hover:font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold";
                              }
                            })()} ${hoveredColumnROI === '180_days' && hoveredRowROI === quarter ? 'bg-yellow-200' : ''
                              }`}
                              onMouseEnter={() => {
                                setHoveredColumnROI('180_days');
                                setHoveredRowROI(quarter);
                              }}
                              onMouseLeave={() => {
                                setHoveredColumnROI(null);
                                setHoveredRowROI(null);
                              }}>
                              {(() => {
                                const result = formatPercentageWithStyling(quarterData?.["180_days"]?.probablity_weighted_returns_percentage, '180_days', hoveredColumnROI, hoveredRowROI, quarter);
                                return result.display === 'N/A' ? <span className={result.isHovered ? "text-red-800 font-bold" : "text-red-200 hover:text-red-800 hover:font-bold"}>N/A</span> : result.display;
                              })()}
                            </td>

                            <td className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${(() => {
                              const result = formatPercentageWithStyling(quarterData?.["1_year"]?.probablity_weighted_returns_percentage, '1_year', hoveredColumnROI, hoveredRowROI, quarter);
                              if (result.isHovered) {
                                return result.isNegative ? "text-red-800 font-bold" : "text-to-purple font-bold";
                              } else {
                                return result.isNegative ? "text-red-200 hover:text-red-800 hover:font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold";
                              }
                            })()} ${hoveredColumnROI === '1_year' && hoveredRowROI === quarter ? 'bg-yellow-200' : ''
                              }`}
                              onMouseEnter={() => {
                                setHoveredColumnROI('1_year');
                                setHoveredRowROI(quarter);
                              }}
                              onMouseLeave={() => {
                                setHoveredColumnROI(null);
                                setHoveredRowROI(null);
                              }}>
                              {(() => {
                                const result = formatPercentageWithStyling(quarterData?.["1_year"]?.probablity_weighted_returns_percentage, '1_year', hoveredColumnROI, hoveredRowROI, quarter);
                                return result.display === 'N/A' ? <span className={result.isHovered ? "text-red-800 font-bold" : "text-red-200 hover:text-red-800 hover:font-bold"}>N/A</span> : result.display;
                              })()}
                            </td>
                          </tr>
                        ))}
                      </Fragment>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Win Rate Analysis Table */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="font-semibold mb-4 text-[#0c0023]">Win Rate Analysis</h3>
        <p className="text-md mb-3 text-to-purple">Hover Mouse for info</p>
        {/* Table with independent hover states */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm text-black">
            <thead>
              <tr>
                <th className="border border-gray-300 bg-gray-50 px-3 py-1 font-medium text-to-purple" rowSpan={2}>Year</th>
                <th className="border border-gray-300 bg-gray-50 px-3 py-1 font-medium text-to-purple" colSpan={8}>Holding Period (From the Date of Post/Recommendations)</th>
              </tr>
              <tr>
                <th className="border border-gray-300 bg-gray-50 px-3 py-1 font-medium text-to-purple cursor-pointer"
                  onMouseEnter={() => setHoveredColumnWinRate('1_hour')}
                  onMouseLeave={() => setHoveredColumnWinRate(null)}>1 Hour</th>
                <th className="border border-gray-300 bg-gray-50 px-3 py-1 font-medium text-to-purple cursor-pointer"
                  onMouseEnter={() => setHoveredColumnWinRate('24_hours')}
                  onMouseLeave={() => setHoveredColumnWinRate(null)}>24 Hours</th>
                <th className="border border-gray-300 bg-gray-50 px-3 py-1 font-medium text-to-purple cursor-pointer"
                  onMouseEnter={() => setHoveredColumnWinRate('7_days')}
                  onMouseLeave={() => setHoveredColumnWinRate(null)}>7 Days</th>
                <th className="border border-gray-300 bg-gray-50 px-3 py-1 font-medium text-to-purple cursor-pointer"
                  onMouseEnter={() => setHoveredColumnWinRate('30_days')}
                  onMouseLeave={() => setHoveredColumnWinRate(null)}>30 Days</th>
                <th className="border border-gray-300 bg-gray-50 px-3 py-1 font-medium text-to-purple cursor-pointer"
                  onMouseEnter={() => setHoveredColumnWinRate('60_days')}
                  onMouseLeave={() => setHoveredColumnWinRate(null)}>60 Days</th>
                <th className="border border-gray-300 bg-gray-50 px-3 py-1 font-medium text-to-purple cursor-pointer"
                  onMouseEnter={() => setHoveredColumnWinRate('90_days')}
                  onMouseLeave={() => setHoveredColumnWinRate(null)}>90 Days</th>
                <th className="border border-gray-300 bg-gray-50 px-3 py-1 font-medium text-to-purple cursor-pointer"
                  onMouseEnter={() => setHoveredColumnWinRate('180_days')}
                  onMouseLeave={() => setHoveredColumnWinRate(null)}>180 Days</th>
                <th className="border border-gray-300 bg-gray-50 px-3 py-1 font-medium text-to-purple cursor-pointer"
                  onMouseEnter={() => setHoveredColumnWinRate('1_year')}
                  onMouseLeave={() => setHoveredColumnWinRate(null)}>1 Year</th>
              </tr>
            </thead>
            <tbody>
              {channelData?.normal?.Yearly &&
                Object.entries(channelData.normal.Yearly)
                  .filter(([year]) => parseInt(year) !== 2026)
                  .sort(([a], [b]) => Number(b) - Number(a))
                  .map(([year, yearData]) => {
                    const yearQuarters = channelData?.normal?.Quarterly
                      ? Object.entries(channelData.normal.Quarterly)
                        .filter(([quarter]) => quarter && quarter.startsWith(year))
                        .sort(([a], [b]) => {
                          const qA = parseInt(a.split("-")[1]?.replace("Q", "") || "0");
                          const qB = parseInt(b.split("-")[1]?.replace("Q", "") || "0");
                          return qA - qB;
                        })
                      : [];
                    return (
                      <Fragment key={year}>
                        {/* Year row */}
                        <tr className="hover:bg-gray-50">
                          <td
                            className="border border-gray-300 bg-gray-50 px-3 py-1 font-medium text-to-purple cursor-pointer"
                            onClick={() => yearQuarters.length > 0 && toggleYearWinRate(year)}
                          >
                            <div className="flex items-center gap-2">
                              <span>{parseInt(year) >= currentYear ? `${year}*` : year}</span>
                              {yearQuarters.length > 0 && (
                                <svg
                                  className={`w-4 h-4 transform transition-transform ${expandedYearsWinRate[year] ? "rotate-180" : ""}`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              )}
                            </div>
                          </td>
                          <td
                            className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${hoveredColumnWinRate === '1_hour' || hoveredRowWinRate === year
                              ? "text-to-purple font-bold"
                              : "text-gray-300 hover:text-to-purple hover:font-bold"
                              } ${hoveredColumnWinRate === '1_hour' && hoveredRowWinRate === year
                                ? 'bg-yellow-200'
                                : ''
                              }`}
                            onMouseEnter={() => {
                              setHoveredColumnWinRate('1_hour');
                              setHoveredRowWinRate(year);
                            }}
                            onMouseLeave={() => {
                              setHoveredColumnWinRate(null);
                              setHoveredRowWinRate(null);
                            }}
                          >
                            {yearData?.["1_hour"]?.price_probablity_of_winning_percentage != null
                              ? `${yearData["1_hour"].price_probablity_of_winning_percentage.toFixed(0)}%`
                              : <span className={hoveredColumnWinRate === '1_hour' || hoveredRowWinRate === year ? "text-to-purple font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold"}>N/A</span>}
                          </td>
                          <td
                            className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${hoveredColumnWinRate === '24_hours' || hoveredRowWinRate === year
                              ? "text-to-purple font-bold"
                              : "text-gray-300 hover:text-to-purple hover:font-bold"
                              } ${hoveredColumnWinRate === '24_hours' && hoveredRowWinRate === year
                                ? 'bg-yellow-200'
                                : ''
                              }`}
                            onMouseEnter={() => {
                              setHoveredColumnWinRate('24_hours');
                              setHoveredRowWinRate(year);
                            }}
                            onMouseLeave={() => {
                              setHoveredColumnWinRate(null);
                              setHoveredRowWinRate(null);
                            }}
                          >
                            {yearData?.["24_hours"]?.price_probablity_of_winning_percentage != null
                              ? `${yearData["24_hours"].price_probablity_of_winning_percentage.toFixed(0)}%`
                              : <span className={hoveredColumnWinRate === '24_hours' || hoveredRowWinRate === year ? "text-to-purple font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold"}>N/A</span>}
                          </td>
                          <td
                            className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${hoveredColumnWinRate === '7_days' || hoveredRowWinRate === year
                              ? "text-to-purple font-bold"
                              : "text-gray-300 hover:text-to-purple hover:font-bold"
                              } ${hoveredColumnWinRate === '7_days' && hoveredRowWinRate === year
                                ? 'bg-yellow-200'
                                : ''
                              }`}
                            onMouseEnter={() => {
                              setHoveredColumnWinRate('7_days');
                              setHoveredRowWinRate(year);
                            }}
                            onMouseLeave={() => {
                              setHoveredColumnWinRate(null);
                              setHoveredRowWinRate(null);
                            }}
                          >
                            {yearData?.["7_days"]?.price_probablity_of_winning_percentage != null
                              ? `${yearData["7_days"].price_probablity_of_winning_percentage.toFixed(0)}%`
                              : <span className={hoveredColumnWinRate === '7_days' || hoveredRowWinRate === year ? "text-to-purple font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold"}>N/A</span>}
                          </td>
                          <td
                            className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${hoveredColumnWinRate === '30_days' || hoveredRowWinRate === year
                              ? "text-to-purple font-bold"
                              : "text-gray-300 hover:text-to-purple hover:font-bold"
                              } ${hoveredColumnWinRate === '30_days' && hoveredRowWinRate === year
                                ? 'bg-yellow-200'
                                : ''
                              }`}
                            onMouseEnter={() => {
                              setHoveredColumnWinRate('30_days');
                              setHoveredRowWinRate(year);
                            }}
                            onMouseLeave={() => {
                              setHoveredColumnWinRate(null);
                              setHoveredRowWinRate(null);
                            }}
                          >
                            {yearData?.["30_days"]?.price_probablity_of_winning_percentage != null
                              ? `${yearData["30_days"].price_probablity_of_winning_percentage.toFixed(0)}%`
                              : <span className={hoveredColumnWinRate === '30_days' || hoveredRowWinRate === year ? "text-to-purple font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold"}>N/A</span>}
                          </td>
                          <td
                            className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${hoveredColumnWinRate === '60_days' || hoveredRowWinRate === year
                              ? "text-to-purple font-bold"
                              : "text-gray-300 hover:text-to-purple hover:font-bold"
                              } ${hoveredColumnWinRate === '60_days' && hoveredRowWinRate === year
                                ? 'bg-yellow-200'
                                : ''
                              }`}
                            onMouseEnter={() => {
                              setHoveredColumnWinRate('60_days');
                              setHoveredRowWinRate(year);
                            }}
                            onMouseLeave={() => {
                              setHoveredColumnWinRate(null);
                              setHoveredRowWinRate(null);
                            }}
                          >
                            {yearData?.["60_days"]?.price_probablity_of_winning_percentage != null
                              ? `${yearData["60_days"].price_probablity_of_winning_percentage.toFixed(0)}%`
                              : <span className={hoveredColumnWinRate === '60_days' || hoveredRowWinRate === year ? "text-to-purple font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold"}>N/A</span>}
                          </td>
                          <td
                            className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${hoveredColumnWinRate === '90_days' || hoveredRowWinRate === year
                              ? "text-to-purple font-bold"
                              : "text-gray-300 hover:text-to-purple hover:font-bold"
                              } ${hoveredColumnWinRate === '90_days' && hoveredRowWinRate === year
                                ? 'bg-yellow-200'
                                : ''
                              }`}
                            onMouseEnter={() => {
                              setHoveredColumnWinRate('90_days');
                              setHoveredRowWinRate(year);
                            }}
                            onMouseLeave={() => {
                              setHoveredColumnWinRate(null);
                              setHoveredRowWinRate(null);
                            }}
                          >
                            {yearData?.["90_days"]?.price_probablity_of_winning_percentage != null
                              ? `${yearData["90_days"].price_probablity_of_winning_percentage.toFixed(0)}%`
                              : <span className={hoveredColumnWinRate === '90_days' || hoveredRowWinRate === year ? "text-to-purple font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold"}>N/A</span>}
                          </td>
                          <td
                            className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${hoveredColumnWinRate === '180_days' || hoveredRowWinRate === year
                              ? "text-to-purple font-bold"
                              : "text-gray-300 hover:text-to-purple hover:font-bold"
                              } ${hoveredColumnWinRate === '180_days' && hoveredRowWinRate === year
                                ? 'bg-yellow-200'
                                : ''
                              }`}
                            onMouseEnter={() => {
                              setHoveredColumnWinRate('180_days');
                              setHoveredRowWinRate(year);
                            }}
                            onMouseLeave={() => {
                              setHoveredColumnWinRate(null);
                              setHoveredRowWinRate(null);
                            }}
                          >
                            {yearData?.["180_days"]?.price_probablity_of_winning_percentage != null
                              ? `${yearData["180_days"].price_probablity_of_winning_percentage.toFixed(0)}%`
                              : <span className={hoveredColumnWinRate === '180_days' || hoveredRowWinRate === year ? "text-to-purple font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold"}>N/A</span>}
                          </td>
                          <td
                            className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${hoveredColumnWinRate === '1_year' || hoveredRowWinRate === year
                              ? "text-to-purple font-bold"
                              : "text-gray-300 hover:text-to-purple hover:font-bold"
                              } ${hoveredColumnWinRate === '1_year' && hoveredRowWinRate === year
                                ? 'bg-yellow-200'
                                : ''
                              }`}
                            onMouseEnter={() => {
                              setHoveredColumnWinRate('1_year');
                              setHoveredRowWinRate(year);
                            }}
                            onMouseLeave={() => {
                              setHoveredColumnWinRate(null);
                              setHoveredRowWinRate(null);
                            }}
                          >
                            {yearData?.["1_year"]?.price_probablity_of_winning_percentage != null
                              ? `${yearData["1_year"].price_probablity_of_winning_percentage.toFixed(0)}%`
                              : <span className={hoveredColumnWinRate === '1_year' || hoveredRowWinRate === year ? "text-to-purple font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold"}>N/A</span>}
                          </td>
                        </tr>
                        {/* Quarter rows */}
                        {expandedYearsWinRate[year] && yearQuarters.map(([quarter, quarterData]) => (
                          <tr key={quarter} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-3 py-1 text-xs text-to-purple">
                              {quarterLabels[quarter.slice(-2).toLowerCase()] ?? quarter}
                            </td>
                            <td
                              className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${hoveredColumnWinRate === '1_hour' || hoveredRowWinRate === quarter
                                ? "text-to-purple font-bold"
                                : "text-gray-300 hover:text-to-purple hover:font-bold"
                                } ${hoveredColumnWinRate === '1_hour' && hoveredRowWinRate === quarter
                                  ? 'bg-yellow-200'
                                  : ''
                                }`}
                              onMouseEnter={() => {
                                setHoveredColumnWinRate('1_hour');
                                setHoveredRowWinRate(quarter);
                              }}
                              onMouseLeave={() => {
                                setHoveredColumnWinRate(null);
                                setHoveredRowWinRate(null);
                              }}
                            >
                              {quarterData?.["1_hour"]?.price_probablity_of_winning_percentage != null
                                ? `${quarterData["1_hour"].price_probablity_of_winning_percentage.toFixed(0)}%`
                                : <span className={hoveredColumnWinRate === '1_hour' || hoveredRowWinRate === quarter ? "text-to-purple font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold"}>N/A</span>}
                            </td>
                            <td
                              className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${hoveredColumnWinRate === '24_hours' || hoveredRowWinRate === quarter
                                ? "text-to-purple font-bold"
                                : "text-gray-300 hover:text-to-purple hover:font-bold"
                                } ${hoveredColumnWinRate === '24_hours' && hoveredRowWinRate === quarter
                                  ? 'bg-yellow-200'
                                  : ''
                                }`}
                              onMouseEnter={() => {
                                setHoveredColumnWinRate('24_hours');
                                setHoveredRowWinRate(quarter);
                              }}
                              onMouseLeave={() => {
                                setHoveredColumnWinRate(null);
                                setHoveredRowWinRate(null);
                              }}
                            >
                              {quarterData?.["24_hours"]?.price_probablity_of_winning_percentage != null
                                ? `${quarterData["24_hours"].price_probablity_of_winning_percentage.toFixed(0)}%`
                                : <span className={hoveredColumnWinRate === '24_hours' || hoveredRowWinRate === quarter ? "text-to-purple font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold"}>N/A</span>}
                            </td>
                            <td
                              className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${hoveredColumnWinRate === '7_days' || hoveredRowWinRate === quarter
                                ? "text-to-purple font-bold"
                                : "text-gray-300 hover:text-to-purple hover:font-bold"
                                } ${hoveredColumnWinRate === '7_days' && hoveredRowWinRate === quarter
                                  ? 'bg-yellow-200'
                                  : ''
                                }`}
                              onMouseEnter={() => {
                                setHoveredColumnWinRate('7_days');
                                setHoveredRowWinRate(quarter);
                              }}
                              onMouseLeave={() => {
                                setHoveredColumnWinRate(null);
                                setHoveredRowWinRate(null);
                              }}
                            >
                              {quarterData?.["7_days"]?.price_probablity_of_winning_percentage != null
                                ? `${quarterData["7_days"].price_probablity_of_winning_percentage.toFixed(0)}%`
                                : <span className={hoveredColumnWinRate === '7_days' || hoveredRowWinRate === quarter ? "text-to-purple font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold"}>N/A</span>}
                            </td>
                            <td
                              className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${hoveredColumnWinRate === '30_days' || hoveredRowWinRate === quarter
                                ? "text-to-purple font-bold"
                                : "text-gray-300 hover:text-to-purple hover:font-bold"
                                } ${hoveredColumnWinRate === '30_days' && hoveredRowWinRate === quarter
                                  ? 'bg-yellow-200'
                                  : ''
                                }`}
                              onMouseEnter={() => {
                                setHoveredColumnWinRate('30_days');
                                setHoveredRowWinRate(quarter);
                              }}
                              onMouseLeave={() => {
                                setHoveredColumnWinRate(null);
                                setHoveredRowWinRate(null);
                              }}
                            >
                              {quarterData?.["30_days"]?.price_probablity_of_winning_percentage != null
                                ? `${quarterData["30_days"].price_probablity_of_winning_percentage.toFixed(0)}%`
                                : <span className={hoveredColumnWinRate === '30_days' || hoveredRowWinRate === quarter ? "text-to-purple font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold"}>N/A</span>}
                            </td>
                            <td
                              className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${hoveredColumnWinRate === '60_days' || hoveredRowWinRate === quarter
                                ? "text-to-purple font-bold"
                                : "text-gray-300 hover:text-to-purple hover:font-bold"
                                } ${hoveredColumnWinRate === '60_days' && hoveredRowWinRate === quarter
                                  ? 'bg-yellow-200'
                                  : ''
                                }`}
                              onMouseEnter={() => {
                                setHoveredColumnWinRate('60_days');
                                setHoveredRowWinRate(quarter);
                              }}
                              onMouseLeave={() => {
                                setHoveredColumnWinRate(null);
                                setHoveredRowWinRate(null);
                              }}
                            >
                              {quarterData?.["60_days"]?.price_probablity_of_winning_percentage != null
                                ? `${quarterData["60_days"].price_probablity_of_winning_percentage.toFixed(0)}%`
                                : <span className={hoveredColumnWinRate === '60_days' || hoveredRowWinRate === quarter ? "text-to-purple font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold"}>N/A</span>}
                            </td>
                            <td
                              className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${hoveredColumnWinRate === '90_days' || hoveredRowWinRate === quarter
                                ? "text-to-purple font-bold"
                                : "text-gray-300 hover:text-to-purple hover:font-bold"
                                } ${hoveredColumnWinRate === '90_days' && hoveredRowWinRate === quarter
                                  ? 'bg-yellow-200'
                                  : ''
                                }`}
                              onMouseEnter={() => {
                                setHoveredColumnWinRate('90_days');
                                setHoveredRowWinRate(quarter);
                              }}
                              onMouseLeave={() => {
                                setHoveredColumnWinRate(null);
                                setHoveredRowWinRate(null);
                              }}
                            >
                              {quarterData?.["90_days"]?.price_probablity_of_winning_percentage != null
                                ? `${quarterData["90_days"].price_probablity_of_winning_percentage.toFixed(0)}%`
                                : <span className={hoveredColumnWinRate === '90_days' || hoveredRowWinRate === quarter ? "text-to-purple font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold"}>N/A</span>}
                            </td>
                            <td
                              className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${hoveredColumnWinRate === '180_days' || hoveredRowWinRate === quarter
                                ? "text-to-purple font-bold"
                                : "text-gray-300 hover:text-to-purple hover:font-bold"
                                } ${hoveredColumnWinRate === '180_days' && hoveredRowWinRate === quarter
                                  ? 'bg-yellow-200'
                                  : ''
                                }`}
                              onMouseEnter={() => {
                                setHoveredColumnWinRate('180_days');
                                setHoveredRowWinRate(quarter);
                              }}
                              onMouseLeave={() => {
                                setHoveredColumnWinRate(null);
                                setHoveredRowWinRate(null);
                              }}
                            >
                              {quarterData?.["180_days"]?.price_probablity_of_winning_percentage != null
                                ? `${quarterData["180_days"].price_probablity_of_winning_percentage.toFixed(0)}%`
                                : <span className={hoveredColumnWinRate === '180_days' || hoveredRowWinRate === quarter ? "text-to-purple font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold"}>N/A</span>}
                            </td>
                            <td
                              className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${hoveredColumnWinRate === '1_year' || hoveredRowWinRate === quarter
                                ? "text-to-purple font-bold"
                                : "text-gray-300 hover:text-to-purple hover:font-bold"
                                } ${hoveredColumnWinRate === '1_year' && hoveredRowWinRate === quarter
                                  ? 'bg-yellow-200'
                                  : ''
                                }`}
                              onMouseEnter={() => {
                                setHoveredColumnWinRate('1_year');
                                setHoveredRowWinRate(quarter);
                              }}
                              onMouseLeave={() => {
                                setHoveredColumnWinRate(null);
                                setHoveredRowWinRate(null);
                              }}
                            >
                              {quarterData?.["1_year"]?.price_probablity_of_winning_percentage != null
                                ? `${quarterData["1_year"].price_probablity_of_winning_percentage.toFixed(0)}%`
                                : <span className={hoveredColumnWinRate === '1_year' || hoveredRowWinRate === quarter ? "text-to-purple font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold"}>N/A</span>}
                            </td>
                          </tr>
                        ))}
                      </Fragment>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
