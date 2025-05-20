import React from 'react';
import Stepper from '../components/Stepper/Stepper';
import Card from '../components/Card/Card';

const steps = [
  'Banco',
  'Produto',
  'Dados da empresa e conta',
  'Tipo de VAN',
  'Revisão',
  'Encerramento',
];

export default function WizardIntro({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-2">
      <Card className="p-4 sm:p-8 md:p-10 max-w-6xl w-full">
        <h1 className="text-xl sm:text-2xl font-bold text-center text-primary mb-2">
          Assistente de Emissão de Cartas de VAN
        </h1>
        <p className="text-gray-700 text-center mb-6 sm:mb-8 mt-2 text-sm sm:text-base">
          Bem-vindo à Ferramenta de Emissão de Cartas de VAN da Plugbank.<br />
          A seguir, você passará por sete etapas que vão te auxiliar a criar uma ou mais cartas de forma prática para imprimir e assinar.
        </p>
        <div className="hidden md:block mb-6">
          <Stepper currentStep={0} steps={steps} />
        </div>
        <div className="flex justify-center md:justify-end">
          <button
            className="bg-primary text-white rounded-full px-8 py-3 font-bold text-lg hover:bg-primaryDark transition w-full md:w-auto"
            onClick={onStart}
          >
            Começar
          </button>
        </div>
      </Card>
    </div>
  );
}