import { XCircle } from "lucide-react"


type ErrorResponseProps = {
    message: string;
    callableFunction?: () => void;
}

const ErrorResponse = ( { message, callableFunction} : ErrorResponseProps) => {
    return (
        <div className="flex flex-col gap-4 items-center py-5">
            <XCircle size={50} color="#006de2" className="mx-auto" />
            <p className="text-center text-lg">{message}</p>
            {
                callableFunction && <button onClick={callableFunction} className="mt-1 w-full rounded-xl bg-my-blue hover:cursor-pointer hover:bg-my-deep-blue text-white py-3 font-medium hover:opacity-90 transition-all duration-300">Back to Form</button>
            }
        </div>
    )
}

export default ErrorResponse