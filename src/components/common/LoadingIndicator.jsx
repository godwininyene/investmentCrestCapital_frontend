import { BiDotsHorizontal } from 'react-icons/bi';
import { SiPolkadot } from 'react-icons/si';

const LoadingIndicator = ({ type = 'spinner', size = 7 }) => {
    return (
        <>
            {/* Bouncing Dots */}
            {type === 'dots' && (
                <section className='inline-block'>
                    <span><BiDotsHorizontal className={`animate-ping duration-1000 h-${size} w-${size}`} /></span>
                </section>
            )}

            {/* Spinner */}
            {type === 'spinner' && (
                <section className='inline-block'>
                    <SiPolkadot className={`animate-spin duration-1000 h-${size} w-${size}`} />
                </section>
            )}
        </>
    );
};

export default LoadingIndicator