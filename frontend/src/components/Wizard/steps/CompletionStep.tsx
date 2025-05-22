import React, { memo } from 'react';
import Button from '../../Button/Button';

interface CompletionStepProps {
  ticketNumber: string; // Placeholder para o número do ticket
  ticketLink: string; // Placeholder para o link do ticket
  onStartOver: () => void; // Prop para reiniciar o wizard
}

export const CompletionStep = memo(({
  ticketNumber,
  ticketLink,
  onStartOver,
}: CompletionStepProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold text-[#8D44AD] mb-4">Parabéns! Sua carta de VAN foi criada com sucesso.</h2>
      <p className="text-base text-gray-700 mb-4">
        Você receberá suas cartas em anexo via e-mail juntamente com o link do atendimento para acompanhar a abertura do relacionamento com o banco selecionado.
        <br/>Se houver qualquer dúvida, acesse nosso <a href="#" className="text-[#8D44AD] hover:underline">chat aqui</a>.
      </p>
      
      <div className="mb-6">
        <p className="text-4xl font-bold text-[#8D44AD] mb-2">#{ticketNumber}</p>
        <p className="text-base text-gray-700">Link de acesso: <a href={ticketLink} className="text-[#8D44AD] hover:underline" target="_blank" rel="noopener noreferrer">{ticketLink}</a></p>
      </div>

      <Button
        type="button"
        className="bg-[#8D44AD] text-white rounded-full px-10 py-2 font-semibold shadow-md hover:bg-[#7d379c] transition disabled:opacity-50 mt-4"
        onClick={onStartOver}
      >
        Início
      </Button>
    </div>
  );
}); 