import React, { memo } from 'react';
import { FaMoneyCheckAlt, FaFileAlt, FaExchangeAlt, FaBarcode } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import Card from '../../Card/Card';
import Button from '../../Button/Button';
import type { ProductData } from '../../../services/api';

interface ProductSelectionProps {
  selectedProducts: string[];
  onSelect: (products: string[]) => void;
  onNext: () => void;
  onBack: () => void;
  selectedBank: number | null;
  products: ProductData[];
}

const PRODUCT_ICONS: Record<string, IconType> = {
  'Pagamentos': FaMoneyCheckAlt,
  'Extrato': FaFileAlt,
  'DDA': FaExchangeAlt,
  'Boletos': FaBarcode,
};

export const ProductSelection = memo(({
  selectedProducts,
  onSelect,
  onNext,
  onBack,
  selectedBank,
  products,
}: ProductSelectionProps) => {
  const handleProductToggle = (productId: number) => {
    const newSelection = selectedProducts.includes(productId.toString())
      ? selectedProducts.filter((id) => id !== productId.toString())
      : [...selectedProducts, productId.toString()];
    onSelect(newSelection);
  };

  return (
    <Card className="shadow-none p-0">
      <div className="w-full h-full px-0 py-0">
        <h2 className="text-2xl font-semibold mb-2 text-black text-left">
          2. Selecionar um ou mais produtos
        </h2>
        <p className="text-base text-black mb-8 text-left">
          Selecione quais produtos deseja utilizar a transferência de arquivos por VAN
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product) => {
            const selected = selectedProducts.includes(product.id.toString());
            const isDisabled = !product.available;
            const Icon = PRODUCT_ICONS[product.name];
            
            return (
              <button
                key={product.id}
                type="button"
                disabled={isDisabled}
                className={`
                  flex flex-col items-center justify-center rounded-xl border-2 px-4 py-10 transition min-h-[160px] h-full
                  ${selected
                    ? 'border-[#8D44AD] bg-[#8D44AD] text-white'
                    : isDisabled
                    ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'border-[#8D44AD] bg-white text-[#8D44AD] hover:bg-[#f3eaff]'}
                  focus:outline-none
                `}
                style={{ boxShadow: 'none' }}
                onClick={() => !isDisabled && handleProductToggle(product.id)}
              >
                <span className="mb-3">
                  {Icon && (
                    <Icon
                      size={38}
                      color={selected ? 'white' : isDisabled ? '#9CA3AF' : '#8D44AD'}
                    />
                  )}
                </span>
                <span className="text-2xl font-bold mb-2">{product.name}</span>
                {isDisabled && (
                  <span className="text-sm text-gray-500 mt-2">
                    Indisponível
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
          <Button
            type="button"
            className="border-2 border-[#8D44AD] text-[#8D44AD] bg-white rounded-full px-10 py-2 font-semibold transition hover:bg-[#f3eaff] hover:text-[#8D44AD] disabled:opacity-50 shadow-none"
            onClick={onBack}
          >
            Voltar
          </Button>
          <Button
            type="button"
            className="bg-[#8D44AD] text-white rounded-full px-10 py-2 font-semibold shadow-none hover:bg-[#7d379c] transition disabled:opacity-50"
            onClick={onNext}
            disabled={selectedProducts.length === 0}
          >
            Próximo
          </Button>
        </div>
      </div>
    </Card>
  );
});