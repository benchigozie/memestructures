import { funds } from "@/data/funds";
import Link from "next/link";

const page = () => {
  return (
    <div className="p-4 md:p-10">
      {/* FIXED TYPO: flex */}
      <section className="flex flex-col gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl text-my-deep-blue font-bold mb-1">
          Asset Class Offerings
        </h1>
        <p className="text-gray-600 text-[17px]">
          Curated Investment Vehicles designed for modern architectural portfolio.
        </p>
      </section>

      <section className="flex flex-col gap-4 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          
          {funds.map((fund) => {
            const Icon = fund.icon;

            return (
              <div
                key={fund.slug}
                className="bg-my-white rounded-lg shadow-md flex flex-col gap-6 p-6 md:p-8 border border-gray-100"
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-xl ${fund.theme.bg}`}>
                    <Icon width={20} height={20} color={fund.theme.iconColor} />
                  </div>

                  <div className={`py-1 px-3 rounded-full text-xs ${fund.theme.bg} ${fund.theme.text}`}>
                    {fund.type}
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-lg md:text-xl text-my-deep-blue font-medium">
                  {fund.name}
                </h2>

                {/* Description */}
                <p className="text-my-gray/70">{fund.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs">MIN INVESTMENT</span>
                    <p className="font-medium text-my-deep-blue">
                      ${fund.minInvestment.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs">MAX INVESTMENT</span>
                    <p className="font-medium text-my-deep-blue">
                      {fund.maxInvestment
                        ? `$${fund.maxInvestment.toLocaleString()}`
                        : "Unlimited"}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs">LOCK-UP PERIOD</span>
                    <p className="font-medium text-my-deep-blue">
                      {fund.lockup}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs">TARGET RETURN</span>
                    <p className="font-medium text-my-deep-blue">
                      {fund.targetReturn}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/dashboard/user/assets/${fund.slug}`}
                  className="rounded-lg hover:bg-blue-100 hover:text-my-blue text-my-white text-sm font-medium py-3 text-center bg-my-blue transition-colors duration-300"
                >
                  Invest Now
                </Link>
              </div>
            );
          })}

        </div>
      </section>
    </div>
  );
};

export default page;