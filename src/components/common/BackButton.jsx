const  BackButton = ({ onClick, disabled }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`border border-primary-light transition-all duration-100 hover:bg-primary-light hover:text-white rounded-md px-5 py-2 ${
                disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
        >
            Previous
        </button>
    );
};

export default BackButton