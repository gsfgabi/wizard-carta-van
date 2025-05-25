import React from 'react';

function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-black/50">
            <div className="bg-white rounded-2xl shadow-lg p-10 max-w-lg w-full relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-[#8D44AD] bg-transparent shadow-none"
                >
                    ×
                </button>
                {children}
            </div>
        </div>
    );
}

export default Modal;
