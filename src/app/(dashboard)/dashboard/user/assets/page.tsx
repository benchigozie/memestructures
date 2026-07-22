"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import InProgress from "@/components/InProgress";
import { fetchWithAuth } from "@/utils/fetchWithAuth";


type AssetClass = {
  id: string;
  name: string;
  slug: string;
  acronym: string | null;

  headline: string | null;
  shortDescription: string | null;
  description: string;

  fundType: string | null;
  riskProfile: string | null;
  allocationSource: string | null;
  investmentHorizon: string | null;

  minimumInvestment: number;
  maximumInvestment: number | null;

  lockupPeriod: string | null;
  targetReturn: string | null;
};



const page = () => {

  const [assets, setAssets] = useState<AssetClass[]>([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    loadAssets();
  }, []);



  async function loadAssets() {
    try {

      const res = await fetchWithAuth(
        "/api/asset-classes"
      );

      const data = await res.json();


      if (!res.ok) {
        throw new Error(data.error);
      }


      setAssets(data);


    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  }



  if (loading) {
    return (
      <InProgress message="Loading asset class offerings" />
    );
  }



  return (

    <div className="p-4 md:p-10">


      <section className="flex flex-col gap-4 mb-8">

        <h1 className="
          text-2xl 
          md:text-3xl 
          text-my-deep-blue 
          font-bold
        ">
          Asset Class Offerings
        </h1>


        <p className="text-gray-600 text-[17px]">
          Curated investment vehicles designed for modern architectural portfolios.
        </p>

      </section>




      <section>

        <div className="
          grid 
          grid-cols-1 
          lg:grid-cols-2 
          gap-5 
          md:gap-6
        ">


          {assets.map((asset) => (

            <div
              key={asset.id}
              className="
                bg-my-white
                rounded-xl
                shadow-md
                flex
                flex-col
                gap-6
                p-6
                md:p-8
                border
                border-gray-100
              "
            >



              {/* Header */}

              <div className="flex justify-between items-start">


                <div className="
                  p-3 
                  rounded-xl 
                  bg-my-blue/10
                ">

                  <TrendingUp
                    width={22}
                    height={22}
                    className="text-my-blue"
                  />

                </div>



                {asset.acronym && (

                  <div className="
                    py-1
                    px-3
                    rounded-full
                    text-xs
                    bg-my-blue/10
                    text-my-blue
                    font-medium
                  ">
                    {asset.acronym}
                  </div>

                )}


              </div>





              {/* Title */}

              <div>

                <h2 className="
                  text-xl
                  text-my-deep-blue
                  font-semibold
                ">
                  {asset.name}
                </h2>


                <p className="
                  mt-2
                  text-my-gray/70
                ">
                  {asset.headline}
                </p>

              </div>






              {/* Tags */}

              <div className="flex flex-wrap gap-2">


                {asset.fundType && (

                  <span className="
                    rounded-full
                    px-3
                    py-1
                    text-xs
                    bg-gray-100
                    text-my-deep-blue
                  ">
                    {asset.fundType}
                  </span>

                )}



                {asset.riskProfile && (

                  <span className="
                    rounded-full
                    px-3
                    py-1
                    text-xs
                    bg-my-blue/10
                    text-my-blue
                  ">
                    {asset.riskProfile} Risk
                  </span>

                )}


              </div>






              {/* Description */}

              <div className="space-y-2">

                <p className="
                  text-my-gray/80
                ">
                  {asset.shortDescription}
                </p>


                <p className="
                  text-sm
                  text-my-gray/60
                  line-clamp-3
                ">
                  {asset.description}
                </p>


              </div>







              {/* Stats */}

              <div className="
                grid
                grid-cols-2
                gap-5
              ">


                <div>

                  <span className="text-xs">
                    MIN INVESTMENT
                  </span>

                  <p className="font-medium text-my-deep-blue">
                    ₦{asset.minimumInvestment.toLocaleString()}
                  </p>

                </div>




                <div>

                  <span className="text-xs">
                    MAX INVESTMENT
                  </span>

                  <p className="font-medium text-my-deep-blue">

                    {
                      asset.maximumInvestment
                        ? `₦${asset.maximumInvestment.toLocaleString()}`
                        : "Unlimited"
                    }

                  </p>

                </div>




                <div>

                  <span className="text-xs">
                    LOCK-UP PERIOD
                  </span>

                  <p className="font-medium text-my-deep-blue">
                    {asset.lockupPeriod || "N/A"}
                  </p>

                </div>




                <div>

                  <span className="text-xs">
                    TARGET RETURN
                  </span>

                  <p className="font-medium text-my-deep-blue">
                    {asset.targetReturn || "N/A"}
                  </p>

                </div>




                <div>

                  <span className="text-xs">
                    INVESTMENT HORIZON
                  </span>

                  <p className="font-medium text-my-deep-blue">
                    {asset.investmentHorizon || "N/A"}
                  </p>

                </div>




                <div>

                  <span className="text-xs">
                    ALLOCATION SOURCE
                  </span>

                  <p className="font-medium text-my-deep-blue">
                    {asset.allocationSource || "N/A"}
                  </p>

                </div>


              </div>






              {/* CTA */}

              <Link
                href={`/dashboard/user/assets/${asset.slug}`}
                className="
                  rounded-lg
                  hover:bg-blue-100
                  hover:text-my-blue
                  text-white
                  text-sm
                  font-medium
                  py-3
                  text-center
                  bg-my-blue
                  transition-colors
                  duration-300
                "
              >
                View Opportunity
              </Link>



            </div>

          ))}


        </div>


      </section>


    </div>

  );
};


export default page;