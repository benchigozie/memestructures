import { PuffLoader } from 'react-spinners';

const Loading = () => {
    return (
        <div className="flex flex-col gap-5 items-center py-6 px-10">
            <PuffLoader color="#006de2" size={60} className="mx-auto" />
            <p className="text-center text-xl">Loading</p>
        </div>
    )
}

export default Loading