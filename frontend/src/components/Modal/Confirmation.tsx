import React from 'react';
import Button from "../Button/Button";

function Confirmation({ onConfirm, onCancel, title = "Confirmar e Enviar Carta?", message = "Esta ação é irreversível." }) {
    return (
        <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            <p className="text-gray-700">{message}</p>
            <div className="w-full flex justify-between mt-6">
                <Button
                    type="button"
                    className="border-2 border-[#8D44AD] text-[#8D44AD] bg-white rounded-full px-10 py-2 font-semibold transition hover:bg-[#f3eaff] hover:text-[#8D44AD] disabled:opacity-50 shadow-none"
                    onClick={onCancel}
                >
                    Cancelar
                </Button>
                <Button
                    type="button"
                    className="bg-[#8D44AD] text-white rounded-full px-10 py-2 font-semibold shadow-none hover:bg-[#7d379c] transition disabled:opacity-50"
                    onClick={onConfirm}
                >
                    Confirmar e Enviar Carta
                </Button>
            </div>
        </div>
    );
}


export default Confirmation;
