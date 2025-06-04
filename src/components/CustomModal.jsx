import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { BiArrowBack } from 'react-icons/bi';
import { FaTimesCircle } from 'react-icons/fa';

export default function Modal({ children, show = false, maxWidth = '2xl', closeable = true, backDrop = false, onClose = () => {} }) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
    }[maxWidth];

    return (
        <Transition show={show} as={Fragment} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 flex overflow-y-auto md:px-4 bg-black/50  md:py-6 sm:px-0 items-center z-50 transform transition-all h-screen"
                onClose={() => {backDrop && close()}}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="absolute inset-0 h-full" />
                </Transition.Child>

                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <Dialog.Panel
                        className={`md:mb-6 bg-white md:rounded-lg shadow-xl md:mt-10 transform transition-all sm:w-full sm:mx-auto ${maxWidthClass} w-full h-full md:h-auto`}
                    >
                        <div className="relative z-50">
                            <button className="absolute cursor-pointer -top-3 -right-3 bg-white rounded-full text-red-500 hidden md:block"  onClick={() => close()}>
                                <FaTimesCircle className="h-6 w-6" />
                            </button>
                            <aside className="md:hidden p-2 font-bold border-b">
                                <button className="flex items-center gap-2 px-2 py-1" onClick={() => close()}>
                                    <BiArrowBack  className="h-6 w-6"  /> Back
                                </button>
                            </aside>
                        </div>
                        {children}
                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}
