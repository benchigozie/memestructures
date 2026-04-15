import { PuffLoader } from 'react-spinners'

const InProgress = ({ message } : { message?: string }) => {
    return (
        <div className="flex flex-col gap-4 items-center py-5">
            <PuffLoader color="#006de2" size={50} className="mx-auto" />
            <p className="text-center text-lg">{message}</p>
        </div>
    )
}

export default InProgress;