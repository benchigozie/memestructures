
type ButtonProps = { 
    buttonText: string, 
    btnType: "primary" | "secondary",
    className?: string 
}

function Button({ buttonText, btnType, className }: ButtonProps ) {

    const primaryStyle = "px-7 py-4 md:py-5 bg-my-blue text-white rounded-xl  md:rounded-3xl font-semibold transition-all duration-300 hover:scale-103 hover:cursor-pointer";
    const secondaryStyle = "px-7 py-4 md:py-5 bg-my-blue-white/40 text-my-blue rounded-xl md:rounded-3xl font-semibold transition-all duration-300 hover:scale-103 hover:cursor-pointer border border-my-blue-white";
    
    if (!className) {
        className = "";
    }

  return (
    <div>
        <button className={btnType === "primary" ? primaryStyle + " " + className : secondaryStyle + " " + className }>
            {buttonText}
        </button>
    </div>
  )
}

export default Button