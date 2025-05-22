import React, { useEffect, useState, memo } from 'react';
import Button from '../../Button/Button';
import { getVanTypes, type VanTypeData } from '../../../services/api';

interface VanTypeSelectionProps {
  selectedBank: number | null;
  onNext: (selectedVanTypes: string[]) => void;
  onBack: () => void;
  onSelect: (vanTypes: string[]) => void;
  selectedVanTypes: string[];
}

export const VanTypeSelection = memo(({
  selectedBank,
  onNext,
  onBack,
  onSelect,
  selectedVanTypes,
}: VanTypeSelectionProps) => {
  const [vanTypes, setVanTypes] = useState<VanTypeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedBank) {
      setLoading(true);
      setError(null);
      getVanTypes(selectedBank.toString())
        .then((data) => {
          setVanTypes(data);
          // Se houver apenas uma VAN disponível, seleciona automaticamente
          if (data.length === 1 && data[0].available) {
            onSelect([data[0].id.toString()]);
          }
          setError(null);
        })
        .catch((error) => {
          console.error('Erro ao carregar tipos de VAN:', error);
          setError('Erro ao carregar os tipos de VAN. Por favor, tente novamente.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [selectedBank, onSelect]);

  const handleVanTypeToggle = (vanTypeId: string) => {
    const newSelection = selectedVanTypes.includes(vanTypeId)
      ? selectedVanTypes.filter((id) => id !== vanTypeId)
      : [...selectedVanTypes, vanTypeId];
    onSelect(newSelection);
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-600">Carregando tipos de VAN...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => {
            setLoading(true);
            setError(null);
            getVanTypes(selectedBank!.toString())
              .then((data) => {
                setVanTypes(data);
                setError(null);
              })
              .catch((error) => {
                setError('Erro ao carregar os tipos de VAN. Por favor, tente novamente.');
              })
              .finally(() => {
                setLoading(false);
              });
          }}
          className="text-[#8D44AD] hover:text-[#7d379c] font-medium"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  // Verifica se todos os tipos de VAN estão indisponíveis
  const allVanTypesUnavailable = vanTypes.length > 0 && vanTypes.every(vanType => !vanType.available);

  if (allVanTypesUnavailable) {
    return (
      <>
        <h2 className="text-2xl font-semibold text-black mb-1">
          4. Selecionar tipo de VAN
        </h2>
        <p className="text-base text-gray-700 mb-6">
          Selecione qual(is) tipo(s) de VAN você deseja gerar a carta.
        </p>

        <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-red-600 text-lg font-medium mb-2">
              Não há tipos de VAN disponíveis para o banco selecionado
            </p>
            <p className="text-gray-600">
              Por favor, selecione outro banco ou entre em contato com o suporte.
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-8">
          <Button
            type="button"
            className="border-2 border-[#8D44AD] text-[#8D44AD] bg-white rounded-full px-10 py-2 font-semibold transition hover:bg-[#f3eaff] hover:text-[#8D44AD] disabled:opacity-50 shadow-none"
            onClick={onBack}
          >
            Voltar
          </Button>
          <Button
            type="button"
            className="bg-[#8D44AD] text-white rounded-full px-10 py-2 font-semibold shadow-md hover:bg-[#7d379c] transition disabled:opacity-50"
            onClick={onNext}
            disabled={true}
          >
            Próximo
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-semibold text-black mb-1">
        4. Selecionar tipo de VAN
      </h2>
      <p className="text-base text-gray-700 mb-6">
        Selecione qual(is) tipo(s) de VAN você deseja gerar a carta.
      </p>

      <div className="space-y-4 mb-8">
        {vanTypes.map((vanType) => (
          <label
            key={vanType.id}
            className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors duration-200 ${
              selectedVanTypes.includes(vanType.id.toString())
                ? 'border-[#8D44AD] bg-[#f3eaff]'
                : 'border-gray-200 hover:border-[#8D44AD] hover:bg-[#f3eaff]'
            } ${!vanType.available ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input
              type="checkbox"
              checked={selectedVanTypes.includes(vanType.id.toString())}
              onChange={() => handleVanTypeToggle(vanType.id.toString())}
              disabled={!vanType.available}
              className="w-5 h-5 text-[#8D44AD] border-gray-300 rounded focus:ring-[#8D44AD]"
            />
            <span className="ml-3 text-lg font-medium text-gray-900">
              {vanType.type}
            </span>
            {!vanType.available && (
              <span className="ml-2 text-sm text-red-600">
                (Indisponível)
              </span>
            )}
          </label>
        ))}
      </div>

      <div className="flex justify-between items-center mt-8">
        <Button
          type="button"
          className="border-2 border-[#8D44AD] text-[#8D44AD] bg-white rounded-full px-10 py-2 font-semibold transition hover:bg-[#f3eaff] hover:text-[#8D44AD] disabled:opacity-50 shadow-none"
          onClick={onBack}
        >
          Voltar
        </Button>
        <Button
          type="button"
          className="bg-[#8D44AD] text-white rounded-full px-10 py-2 font-semibold shadow-md hover:bg-[#7d379c] transition disabled:opacity-50"
          onClick={() => onNext(selectedVanTypes)}
          disabled={selectedVanTypes.length === 0 || vanTypes.length === 0}
          title={vanTypes.length === 0 ? "Nenhum tipo de VAN disponível para este banco." : selectedVanTypes.length === 0 ? "Selecione pelo menos um tipo de VAN para continuar." : ""}
        >
          Gerar Cartas
        </Button>
      </div>
    </>
  );
}); 