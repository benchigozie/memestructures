import { XCircle } from "lucide-react"


type ErrorResponseProps = {
    message: string;
    callableFunction?: () => void;
}

const ErrorResponse = ( { message, callableFunction} : ErrorResponseProps) => {
    return (
        <div className="flex flex-col gap-5 items-center py-4 px-10">
            <XCircle size={60} color="#006de2" className="mx-auto" />
            <p className="text-center text-xl">{message}</p>
            {
                callableFunction && <button onClick={callableFunction} className="mt-6 w-full rounded-xl bg-my-blue hover:cursor-pointer hover:bg-my-deep-blue text-white py-3 font-medium hover:opacity-90 transition-all duration-300">Back to Form</button>
            }
        </div>
    )
}

export default ErrorResponse