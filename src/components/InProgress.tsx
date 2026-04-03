import { PuffLoader } from 'react-spinners'

const InProgress = ({ message } : { message: string }) => {
    return (
        <div className="flex flex-col gap-5 items-center py-8 px-10">
            <PuffLoader color="#006de2" size={60} className="mx-auto" />
            <p className="text-center text-xl">{message}</p>
        </div>
    )
}

export default InProgress;