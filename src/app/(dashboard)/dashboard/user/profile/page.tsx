"use client";

import ChangePassword from "@/components/ChangePassword";
import ProfileInformation from "@/components/ProfileInformation";
import NotificationPreferences from "@/components/NotificationPreferences";

export default function SettingsPage() {
    return (
        <section className="p-6 md:p-8">

            <div className="max-w-4xl">


                <div className="mb-10">

                    <h1 className="
                        text-3xl
                        font-bold
                        text-my-deep-blue
                    ">
                        Settings
                    </h1>


                    <p className="
                        text-my-gray
                        mt-2
                    ">
                        Manage your account and preferences.
                    </p>

                </div>





                <div className="space-y-6">



                    {/* Personal Information */}

                    <section className="
                        border
                        border-my-gray/20
                        rounded-xl
                        p-6
                        bg-my-white
                    ">


                        <div className="mb-6">


                            <h2 className="
                                text-xl
                                font-semibold
                                text-my-deep-blue
                            ">
                                Personal Information
                            </h2>



                            <p className="
                                text-my-gray
                                mt-1
                            ">
                                View your account and verified identity information.
                            </p>


                        </div>
                        <ProfileInformation />
                    </section>






                    {/* Security */}

                    <section className="
                        border
                        border-my-gray/20
                        rounded-xl
                        p-6
                        bg-my-white
                    ">

                        <div className="mb-6">

                            <h2 className="
                                text-xl
                                font-semibold
                                text-my-deep-blue
                            ">
                                Security
                            </h2>

                            <ChangePassword />
                        </div>
                    </section>


                    <section className="
                        border
                        border-my-gray/20
                        rounded-xl
                        p-6
                        bg-my-white
                    ">

                        <div className="mb-6">

                            <section
                                className="
                                    mb-6
                                "
                            >
                                <NotificationPreferences />
                            </section>
                        </div>
                    </section>
                </div>
            </div>
        </section>
    );
}