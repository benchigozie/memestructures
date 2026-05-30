import { CircleX } from "lucide-react"

type PopUpProps = {
    title: string;
    message: string;
    onConfirm: () => void;
    onClose: () => void;
}

const PopUp = ({ title, message, onConfirm, onClose } : PopUpProps ) => {
    return (
        <section className='py-8 bg-black/70 fixed top-0 left-0 w-full h-screen flex justify-center'>
            <div className='flex items-center justify-center w-full h-full mx-2'>
                <div className='bg-my-white rounded-3xl w-full max-w-2xl p-8 md:p-10 shadow-xl shadow-my-gray/10 relative'>
                    <div className="absolute top-4 right-4 cursor-pointer" onClick={onClose}>
                        <CircleX size={25} color="#0F172A"/>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="text-center items-center flex flex-col gap-3">
                            <h2 className='text-3xl md:text-4xl text-my-deep-blue font-bold text-center'>{title}</h2>
                            <p className='text-gray-600 text-lg'>{message}</p>
                        </div>
                        <div className="flex justify-center gap-1.5">

                            <button onClick={onClose} className="cursor-pointer bg-my-deep-blue text-my-white hover:bg-gray-200 hover:text-my-deep-blue px-6 py-2.5 rounded-xl  transition-all duration-300">
                                Close
                            </button>
                            <button onClick={onConfirm} className="cursor-pointer hover:bg-gray-200 hover:text-my-deep-blue bg-my-blue text-my-white px-6 py-2.5 rounded-xl transition-all duration-300">
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PopUp