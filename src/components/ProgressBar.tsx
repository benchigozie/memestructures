type ProgressBarProps = {
    progress: number;
    colour: string;
    height: string;
};

function ProgressBar({ progress, colour, height }: ProgressBarProps) {
    return (
        <div className={`w-full bg-my-blue-white rounded-full overflow-hidden  ${height}`}>
            <div
                className={`h-full rounded-full transition-all duration-300 ${colour}`}
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

export default ProgressBar;