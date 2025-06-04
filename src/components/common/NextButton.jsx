const  NextButton = ({ onClick, label }) => {
    return (
        <button
            onClick={onClick}
            className="border border-primary-light cursor-pointer transition-all duration-100 bg-primary-dark hover:bg-primary-light text-white rounded-md px-5 py-2"
        >
            {label}
        </button>
    );
};

export default NextButton;