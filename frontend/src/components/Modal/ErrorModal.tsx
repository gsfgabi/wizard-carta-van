import React from 'react';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleLoginRedirect = () => {
    window.location.href = '/login';
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center" style={{ zIndex: 51 }}>
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Ocorreu um erro inesperado
          </h3>
          <p className="text-gray-600 mb-6">
            Pedimos desculpas pelo inconveniente. Estamos cientes do problema e nossa equipe técnica está trabalhando para solucioná-lo o mais rápido possível. Por favor, tente novamente mais tarde.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleLoginRedirect}
              className="w-full bg-[#8D44AD] text-white rounded-full px-6 py-2 font-semibold hover:bg-[#7d379c] transition"
            >
              Voltar para o Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 