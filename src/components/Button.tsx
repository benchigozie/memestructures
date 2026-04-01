
type ButtonProps = {
    buttonText: string,
    btnType: "primary" | "secondary",
    className?: string
    bgColour?: string,
    colour?: string,
}

function Button({ buttonText, btnType, className, bgColour, colour }: ButtonProps) {

    const primaryStyle = "text-sm md:text-base px-4 py-3 md:py-4 md:py-5 rounded-xl  md:rounded-3xl font-semibold transition-all duration-300 hover:scale-103 hover:cursor-pointer";
    const secondaryStyle = "text-sm md:text-base px-4 py-3 md:py-4 md:py-5 text-my-blue rounded-xl md:rounded-3xl font-semibold transition-all duration-300 hover:scale-103 hover:cursor-pointer border border-my-blue-white";

    if (!className) {
        className = "";
    }

    if (!bgColour) {
        if (btnType === "primary") {
            bgColour = "bg-my-blue";
        }
        if (btnType === "secondary") {
            bgColour = "bg-my-blue-white/40";
        }
    }

    if (!colour) {
        if (btnType === "primary") {
            colour = "text-white";
        }
        if (btnType === "secondary") {
            colour = "text-my-blue";
        }
    }

    return (
        <div>
            <button className={`${btnType === "primary" ? primaryStyle : secondaryStyle} ${className} ${bgColour} ${colour}`}>
                {buttonText}
            </button>
        </div>
    )
}

export default Button