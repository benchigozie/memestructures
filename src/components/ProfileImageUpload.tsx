"use client";

import { useState } from "react";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { useAuth } from "@/context/AuthContext";



type Props = {

    imageUrl: string | null;

    name: string;

    onUpdated?: (
        imageUrl: string
    ) => void;

};





export default function ProfileImageUpload({

    imageUrl,

    name,

    onUpdated,

}: Props) {


    const [preview, setPreview] = useState(
        imageUrl
    );


    const [file, setFile] = useState<File | null>(
        null
    );


    const [uploading, setUploading] = useState(false);
    const { user } = useAuth();

    const [message, setMessage] = useState("");







    function handleImageChange(
        e: React.ChangeEvent<HTMLInputElement>
    ) {


        const selected = e.target.files?.[0];



        if (!selected) {

            return;

        }



        setFile(selected);



        const url = URL.createObjectURL(
            selected
        );


        setPreview(url);


    }








    async function uploadImage() {


        if (!file) {

            return;

        }



        try {


            setUploading(true);

            setMessage("");



            const formData = new FormData();


            formData.append(
                "image",
                file
            );




            const response = await fetchWithAuth(

                "/api/settings/profile-image",

                {

                    method: "PATCH",

                    body: formData,

                }

            );



            const result = await response.json();




            if (result.success) {


                setMessage(
                    "Profile image updated successfully."
                );



                if (onUpdated) {

                    onUpdated(
                        preview || ""
                    );

                }



            }
            else {


                setMessage(
                    result.error ||
                    "Upload failed"
                );

            }



        }
        catch (error) {


            console.error(error);


            setMessage(
                "Something went wrong."
            );


        }
        finally {


            setUploading(false);


        }


    }








    return (

        <div className="
            flex
            items-center
            gap-5
        ">


            <div className="
                h-24
                w-24
                rounded-full
                overflow-hidden
                border
                border-my-gray/20
                bg-my-gray/10
                flex
                items-center
                justify-center
            ">


                {
                    preview

                        ?

                        <img

                            src={preview}

                            alt="Profile"

                            className="
                            h-full
                            w-full
                            object-cover
                        "

                        />


                        :

                        <span className="
                        text-3xl
                        font-bold
                        text-my-deep-blue
                    ">

                           {user?.initials} 
                        </span>

                }


            </div>








            <div>


                <label className="
                    cursor-pointer
                    inline-block
                    rounded-lg
                    bg-my-deep-blue
                    px-4
                    py-2
                    text-sm
                    text-white
                    font-medium
                ">


                    Choose Image


                    <input

                        type="file"

                        accept="image/png,image/jpeg"

                        className="hidden"

                        onChange={handleImageChange}

                    />


                </label>





                {
                    file && (

                        <button

                            onClick={uploadImage}

                            disabled={uploading}

                            className="
                                ml-3
                                rounded-lg
                                border
                                border-my-deep-blue
                                px-4
                                py-2
                                text-sm
                                text-my-deep-blue
                                disabled:opacity-50
                            "

                        >

                            {
                                uploading
                                    ?
                                    "Uploading..."
                                    :
                                    "Save"
                            }


                        </button>

                    )
                }






                {
                    message && (

                        <p className="
                            mt-2
                            text-sm
                            text-my-gray
                        ">

                            {message}

                        </p>

                    )
                }



            </div>


        </div>

    );

}