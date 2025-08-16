import Image from "next/image";
import { FaTrophy } from "react-icons/fa";

export default function InfluencerProfileHeader({ channelData }) {
  return (
    <section className="w-full bg-gradient-to-br from-purple-400/10 to-blue-400/10 border-b border-[#232042] mb-8 py-5">
      <div className=" flex flex-col gap-6 px-4">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Avatar */}
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-4xl font-bold overflow-hidden">
            {channelData.channel_thumbnails?.high?.url ? (
              <Image
                src={channelData.channel_thumbnails.high.url}
                alt={channelData.influencer_name || channelData.channel_title}
                width={112}
                height={112}
                className="rounded-full w-full h-full object-cover"
              />
            ) : (
              (channelData.influencer_name || channelData.channel_title || "U")
                .match(/\b\w/g)
                ?.join("") || "U"
            )}
          </div>

          {/* Details and MCM Ranking */}
          <div className="flex-1 flex flex-col md:flex-row gap-8">
            {/* Channel Details */}
            <div className="flex-1 flex flex-col gap-2 items-center md:items-start">
              <h1 className="text-3xl md:text-4xl font-bold mb-1 flex items-center gap-3">
                {channelData.influencer_name ||
                  channelData.channel_title ||
                  "Unknown Channel"}
                <svg
                  className="w-8 h-8 text-red-500"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </h1>
              <a
                href={`https://www.youtube.com/channel/${channelData.channel_id}`}
                className="text-blue-400 hover:underline text-base mb-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                📺 {channelData.channel_custom_url || "@Unknown"} -{" "}
                {channelData.subscriber_count
                  ? `${channelData.subscriber_count.toLocaleString()} Subscribers`
                  : "Unknown Subscribers"}
              </a>

              {/* Analysis Dates */}
              <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-400">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span>📅 Analysis Start Date:</span>
                    <span className="text-white">
                      {channelData.Overall?.start_date
                        ? new Date(
                            channelData.Overall.start_date
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "Not available"}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 ml-10">
                    (dd-mm-yyyy)
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span>🔄 Influencer Last Video:</span>
                    <span className="text-white">
                      {channelData.Overall?.end_date
                        ? new Date(
                            channelData.Overall.end_date
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "Not available"}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 ml-10">
                    (dd-mm-yyyy)
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-sm text-gray-400 flex items-center gap-2">
                    <span>🔄 Last System Updated:</span>
                    <span className="text-white">14-04-2025 (UTC)</span>
                  </div>
                  <span className="text-xs text-gray-500 ml-10">
                    (dd-mm-yyyy)
                  </span>
                </div>
              </div>

              {/* <div className="flex gap-2 mt-2">
              <button className="btn bg-gradient-to-r from-purple-500 to-blue-500 text-white px-5 py-2 rounded-lg font-semibold shadow hover:scale-105 transition">
                Follow
              </button>
              <button className="btn border border-purple-400 text-purple-300 px-5 py-2 rounded-lg font-semibold hover:bg-purple-700/20 transition">
                Share Profile
              </button>
              <button className="btn border border-red-400 text-red-300 px-5 py-2 rounded-lg font-semibold hover:bg-red-700/20 transition">
                Report Error
              </button>
            </div> */}
            </div>

            {/* MCM Ranking Table */}
            <div className="flex flex-col items-center md:items-end">
              <div className="bg-white/5 border border-gray-600 rounded-lg p-4 min-w-[200px] max-w-[200px] flex flex-col gap-1">
                <div className="text-center mb-3 flex flex-row gap-2 items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="">
                      <FaTrophy size={32} color="gold" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold text-white">
                      MCM Ranking
                    </h3>
                    <p className="text-sm text-gray-400">For the Year</p>
                  </div>
                </div>
                <div className=" flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">2025</span>
                    <span className="text-white font-semibold text-sm">10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">2024</span>
                    <span className="text-white font-semibold text-sm">6</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">2023</span>
                    <span className="text-white font-semibold text-sm">50</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">2022</span>
                    <span className="text-white font-semibold text-sm">52</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
