import React, { useState, useEffect, memo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import toast from 'react-hot-toast';
import Button from '../../Button/Button';
import { getVanTypes, type VanTypeData, getProducts, type ProductData, type CNABData, type BankData } from '../../../services/api';
import { FinnetLetterDisplay } from '../letters/FinnetLetterDisplay';
import { NexxeraLetterDisplay } from '../letters/NexxeraLetterDisplay';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

// Configuração do worker do PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface ValidationStepProps {
  selectedProducts: string[];
  selectedVanTypes: string[];
  onBack: () => void;
  selectedBank: number | null;
  generatedLetterContents: { type: string, content: string, formData: any, bankInfo: BankData | undefined, productInfo: ProductData[], vanTypeInfo: VanTypeData[], cnabs: CNABData[] }[];
  onConfirmAndSend: () => Promise<void>;
  loadingConfirmAndSend: boolean;
}

export const ValidationStep = memo(({
  selectedProducts,
  selectedVanTypes,
  onBack,
  selectedBank,
  generatedLetterContents,
  onConfirmAndSend,
  loadingConfirmAndSend,
}: ValidationStepProps) => {
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [vanTypes, setVanTypes] = useState<VanTypeData[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [dataError, setDataError] = useState<string | null>(null);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);

  useEffect(() => {
    if (selectedBank) {
      setLoadingData(true);
      setDataError(null);
      Promise.all([
        getVanTypes(selectedBank.toString()),
        getProducts(selectedBank.toString()),
      ])
        .then(([vanTypesData, productsData]) => {
          setVanTypes(vanTypesData);
          setProducts(productsData);
        })
        .catch((error) => {
          console.error('Erro ao carregar dados para revisão:', error);
          setDataError('Erro ao carregar informações para revisão. Por favor, tente novamente.');
        })
        .finally(() => {
          setLoadingData(false);
        });
    } else {
        setVanTypes([]);
        setProducts([]);
        setLoadingData(false);
    }
  }, [selectedBank]);

  const handleGeneratePDF = async () => {
    setLoadingPdf(true);
    try {
      // TODO: Implementar chamada à API para gerar o PDF
      // Simulação temporária
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setPdfUrl('/sample.pdf');
      toast.success('PDF gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao buscar bancos:', error);
      toast.error('Erro ao gerar o PDF. Tente novamente.');
    } finally {
      setLoadingPdf(false);
    }
  };

  const handleNextProduct = () => {
    if (currentProductIndex < selectedProducts.length - 1) {
      setCurrentProductIndex(currentProductIndex + 1);
    }
  };

  const handlePreviousProduct = () => {
    if (currentProductIndex > 0) {
      setCurrentProductIndex(currentProductIndex - 1);
    }
  };

  const handleNextLetter = () => {
    if (currentLetterIndex < generatedLetterContents.length - 1) {
      setCurrentLetterIndex(currentLetterIndex + 1);
    }
  };

  const handlePreviousLetter = () => {
    if (currentLetterIndex > 0) {
      setCurrentLetterIndex(currentLetterIndex - 1);
    }
  };

  const currentProduct = selectedProducts[currentProductIndex];
  const currentLetter = generatedLetterContents[currentLetterIndex];

  return (
    <>
      <h2 className="text-2xl font-semibold text-black mb-1">
        5. Revisar e Validar
      </h2>
      <p className="text-base text-gray-700 mb-6">
        Revise os dados preenchidos e o conteúdo da carta gerada antes de finalizar.
      </p>

      {/* Container principal para a carta e botões de navegação */}
      <div className="relative flex items-center justify-center mb-6">
        
        {/* Botão de Navegação Anterior (posicionado absolutamente à esquerda) */}
        {generatedLetterContents.length > 1 && (
          <Button
            type="button"
            className="absolute left-0 z-10 p-2 bg-white rounded-full shadow-md text-[#8D44AD] hover:bg-[#f3eaff] disabled:opacity-50 transition-colors duration-200 -translate-y-1/2 top-1/2"
            onClick={handlePreviousLetter}
            disabled={currentLetterIndex === 0 || loadingPdf}
            aria-label="Carta anterior"
          >
            <ChevronLeftIcon className="h-6 w-6" aria-hidden="true" />
          </Button>
        )}

        {/* Exibir Conteúdo da Carta Atual */}
        {generatedLetterContents.length > 0 && (
          <div className="flex-grow max-w-full px-12 py-4"> {/* Removed gray background and border classes */}
            <h4 className="font-semibold text-black mb-2">
              Carta: {currentLetter.type}
              {generatedLetterContents.length > 1 && ` (${currentLetterIndex + 1} de ${generatedLetterContents.length})`}
            </h4>
            {
              currentLetter.type === 'Finnet' && (
                <FinnetLetterDisplay data={currentLetter} />
              )
            }
            {
              currentLetter.type === 'Nexxera' && (
                <NexxeraLetterDisplay data={currentLetter} />
              )
            }
            {/* Fallback para tipos desconhecidos - exibir conteúdo simples */}
            {!['Finnet', 'Nexxera'].includes(currentLetter.type) && (
              <div className="whitespace-pre-wrap text-sm text-gray-800">
                {currentLetter.content}
              </div>
            )}
          </div>
        )}

        {/* Botão de Navegação Próximo (posicionado absolutamente à direita) */}
        {generatedLetterContents.length > 1 && (
          <Button
            type="button"
            className="absolute right-0 z-10 p-2 bg-white rounded-full shadow-md text-[#8D44AD] hover:bg-[#f3eaff] disabled:opacity-50 transition-colors duration-200 -translate-y-1/2 top-1/2"
            onClick={handleNextLetter}
            disabled={currentLetterIndex === generatedLetterContents.length - 1 || loadingPdf}
            aria-label="Próxima carta"
          >
            <ChevronRightIcon className="h-6 w-6" aria-hidden="true" />
          </Button>
        )}

      </div> {/* Fim do Container principal */}


      {loadingData ? (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-gray-600">Carregando informações para revisão...</p>
        </div>
      ) : dataError ? (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <p className="text-red-600 mb-4">{dataError}</p>
          <button
            onClick={() => {
              if (selectedBank) {
                setLoadingData(true);
                setDataError(null);
                 Promise.all([
                  getVanTypes(selectedBank.toString()),
                  getProducts(selectedBank.toString()),
                ])
                  .then(([vanTypesData, productsData]) => {
                    setVanTypes(vanTypesData);
                    setProducts(productsData);
                  })
                  .catch((error) => {
                    console.error('Erro ao carregar dados para revisão:', error);
                    setDataError('Erro ao carregar informações para revisão. Por favor, tente novamente.');
                  })
                  .finally(() => {
                    setLoadingData(false);
                  });
              }
            }}
            className="text-[#8D44AD] hover:text-[#7d379c] font-medium"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-black mb-2">Produtos Selecionados</h3>
            <div className="space-y-2">
              {selectedProducts.length === 0 ? (
                <p className="text-gray-600">Nenhum produto selecionado.</p>
              ) : (
                selectedProducts.map((productId) => {
                  const product = products.find(p => p.id.toString() === productId);
                  return (
                    <div key={productId} className="flex items-center">
                      <span className="w-2 h-2 bg-[#8D44AD] rounded-full mr-2"></span>
                      <span className="text-gray-700">{product?.name || 'Produto desconhecido'}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-black mb-2">Tipos de VAN Selecionados</h3>
            <div className="space-y-2">
               {selectedVanTypes.length === 0 ? (
                <p className="text-gray-600">Nenhum tipo de VAN selecionado.</p>
              ) : (
                selectedVanTypes.map((vanTypeId) => {
                  const vanType = vanTypes.find(vt => vt.id.toString() === vanTypeId);
                  return (
                    <div key={vanTypeId} className="flex items-center">
                      <span className="w-2 h-2 bg-[#8D44AD] rounded-full mr-2"></span>
                      <span className="text-gray-700">{vanType?.type || 'Tipo de VAN desconhecido'}</span>
                    </div>
                  );
                })
               )}
            </div>
          </div>
        </div>
      )}

      {/* Botões de Ação: Voltar, Gerar PDF, Confirmar e Enviar */}
      <div className="flex justify-between items-center mt-8">
        <Button
          type="button"
          className="border-2 border-[#8D44AD] text-[#8D44AD] bg-white rounded-full px-10 py-2 font-semibold transition hover:bg-[#f3eaff] hover:text-[#8D44AD] disabled:opacity-50 shadow-none"
          onClick={onBack}
          disabled={loadingData || loadingPdf}
        >
          Voltar
        </Button>

        {/* Botão Confirmar e Enviar Carta */}
        <Button
          type="button"
          className="bg-[#8D44AD] text-white rounded-full px-10 py-2 font-semibold shadow-md hover:bg-[#7d379c] transition disabled:opacity-50"
          onClick={onConfirmAndSend}
          disabled={loadingData || generatedLetterContents.length === 0 || loadingConfirmAndSend}
        >
          {loadingConfirmAndSend ? 'Enviando...' : 'Confirmar e Enviar Carta'}
        </Button>
      </div>
    </>
  );
}); 