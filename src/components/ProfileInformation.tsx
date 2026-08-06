"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import ProfileImageUpload from "@/components/ProfileImageUpload";
import InProgress from "./InProgress";


type Profile = {

    name:string;

    username:string | null;

    email:string;

    profileImageUrl:string | null;

    accountType:string;

    kycStatus:string;

    createdAt:string;


    individualKyc?:{

        firstName:string;

        lastName:string;

        phone:string;

        dob:string;

        gender:string;

        country:string;

        state:string;

        city:string;

        address:string;

        residenceType:string;

    } | null;


};





export default function ProfileInformation(){


    const [profile,setProfile] = useState<Profile | null>(null);

    const [loading,setLoading] = useState(true);






    async function loadProfile(){


        try{


            const response = await fetchWithAuth(
                "/api/settings/profile"
            );


            const result = await response.json();



            if(result.success){

                setProfile(result.data);

            }



        }
        catch(error){

            console.error(error);

        }
        finally{

            setLoading(false);

        }


    }







    useEffect(()=>{

        loadProfile();

    },[]);








    if(loading){

        return (

          <InProgress message="Loading profile" />

        );

    }







    if(!profile){

        return (

            <p className="text-red-500">
                Unable to load profile.
            </p>

        );

    }





    const kyc = profile.individualKyc;






    return (

        <div className="space-y-10">





            {/* Profile Header */}


            <div className="
    flex
    items-center
    gap-5
    flex-wrap
">


    <ProfileImageUpload

        imageUrl={
            profile.profileImageUrl
        }

        name={
            profile.name
        }

        onUpdated={(url)=>{

            setProfile({

                ...profile,

                profileImageUrl:url,

            });

        }}

    />



    <div>


        <h3 className="
            text-xl
            font-semibold
            text-my-deep-blue
        ">

            {profile.name}

        </h3>



        <p className="text-my-gray">

            {profile.email}

        </p>


    </div>


</div>






            {/* Account Information */}


            <section>


<h3 className="
    text-lg
    font-semibold
    text-my-deep-blue
    mb-5
">
    Account Information
</h3>



<div className="
    grid
    md:grid-cols-2
    gap-6
">


    <InfoItem
        label="Full Name"
        value={profile.name}
    />



    <InfoItem
        label="Email"
        value={profile.email}
    />



    <InfoItem
        label="Username"
        value={
            profile.username || "-"
        }
    />



    <InfoItem
        label="Account Type"
        value={
            profile.accountType
        }
    />



    <InfoItem
        label="KYC Status"
        value={
            profile.kycStatus
        }
    />



    <InfoItem
        label="Joined"
        value={
            new Date(
                profile.createdAt
            ).toLocaleDateString()
        }
    />


</div>


</section>









            {/* Identity Information */}


            {
                kyc && (

                    <section>


                        <h3 className="
                            text-lg
                            font-semibold
                            text-my-deep-blue
                            mb-5
                        ">
                            Verified Identity Information
                        </h3>





                        <div className="
                            grid
                            md:grid-cols-2
                            gap-6
                        ">


                            <InfoItem
                                label="First Name"
                                value={kyc.firstName}
                            />


                            <InfoItem
                                label="Last Name"
                                value={kyc.lastName}
                            />


                            <InfoItem
                                label="Phone"
                                value={kyc.phone}
                            />



                            <InfoItem
                                label="Date of Birth"
                                value={
                                    new Date(
                                        kyc.dob
                                    ).toLocaleDateString()
                                }
                            />



                            <InfoItem
                                label="Gender"
                                value={kyc.gender}
                            />



                            <InfoItem
                                label="Country"
                                value={kyc.country}
                            />



                            <InfoItem
                                label="State"
                                value={kyc.state}
                            />



                            <InfoItem
                                label="City"
                                value={kyc.city}
                            />



                            <InfoItem
                                label="Residence Type"
                                value={kyc.residenceType}
                            />




                            <div className="md:col-span-2">

                                <InfoItem
                                    label="Address"
                                    value={kyc.address}
                                />

                            </div>



                        </div>



                    </section>

                )

            }



        </div>

    );

}









function InfoItem({

    label,

    value,


}:{

    label:string;

    value:string;

}){


    return (

        <div>


            <p className="
                text-sm
                text-my-gray
            ">
                {label}
            </p>



            <p className="
                mt-1
                font-medium
                text-my-deep-blue
            ">
                {value || "-"}
            </p>



        </div>

    );

}