import React, { useState, useEffect, memo } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import Button from "../../Button/Button";
import { getProducts, getCNABs, getVanTypes, type ProductData, type CNABData, type VanTypeData, type BankData } from '../../../services/api';
import { ErrorModal } from '../../Modal/ErrorModal';

interface BankSelectionProps {
  onSelect: (bankId: number | null) => void;
  selectedBank: number | null;
  onNext: () => void;
  onBack: () => void;
  banks: BankData[];
  loading: boolean;
  error: string | null;
}

export const BankSelection = memo(({
  onSelect,
  selectedBank,
  onNext,
  onBack,
  banks,
  loading,
  error,
}: BankSelectionProps) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [cnabs, setCNABs] = useState<CNABData[]>([]);
  const [vanTypes, setVanTypes] = useState<VanTypeData[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    if (selectedBank) {
      setLoadingDetails(true);
      Promise.all([
        getProducts(selectedBank.toString()),
        getCNABs(selectedBank.toString()),
        getVanTypes(selectedBank.toString())
      ])
        .then(([productsData, cnabsData, vanTypesData]) => {
          setProducts(productsData);
          setCNABs(cnabsData);
          setVanTypes(vanTypesData);
        })
        .catch(error => {
          console.error('Erro ao carregar detalhes do banco:', error);
        })
        .finally(() => {
          setLoadingDetails(false);
        });
    } else {
      setProducts([]);
      setCNABs([]);
      setVanTypes([]);
    }
  }, [selectedBank]);

  const filteredBanks =
    query === ""
      ? banks
      : banks.filter((bank) =>
          `${bank.code} - ${bank.name}`
            .toLowerCase()
            .includes(query.toLowerCase())
        );

  function SaveSelectedBank() {
    const finalBankSelected = banks.find(bank => bank.id === selectedBank);
    localStorage.setItem('selectedBank', JSON.stringify(finalBankSelected));
    console.log("Banco armazenado:", finalBankSelected);
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-2">
      <h2 className="text-2xl font-bold mb-2 text-black text-left">
        1. Selecionar um Banco (Instituição Bancária)
      </h2>
      <p className="text-base text-black mb-6 text-left">
        Selecione um banco para criar uma nova carta de VAN
      </p>
      <div className="mb-12 relative">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <Combobox
            value={banks.find((bank) => bank.id === selectedBank) || null}
            onChange={(bank) => {
              if (bank && bank.id === selectedBank) {
                onSelect(null);
              } else if (bank) {
                onSelect(bank.id);
              }
            }}
          >
            {({ open: comboboxOpen }) => {
              if (open !== comboboxOpen) setTimeout(() => setOpen(comboboxOpen), 0);
              return (
                <div className="relative">
                  <ComboboxInput
                    className="w-full border border-[#E0E0E0] rounded-lg py-2 px-3 xs:py-3 xs:px-4 sm:py-4 sm:px-5 pr-12 text-gray-900 bg-white focus:ring-2 focus:ring-[#D1B3E0] focus:border-[#D1B3E0] focus:outline-none transition placeholder:text-gray-400 shadow-md text-base"
                    onChange={(event) => setQuery(event.target.value)}
                    displayValue={(bank: BankData) =>
                      bank ? `${bank.code} - ${bank.name}` : ""
                    }
                    placeholder="Selecione um banco"
                  />
                  <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2 xs:pr-4 bg-transparent focus:outline-none border-none shadow-none">
                    {open ? (
                      <ChevronUpIcon className="h-5 w-5 xs:h-6 xs:w-6 text-gray-400" aria-hidden="true" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 xs:h-6 xs:w-6 text-gray-400" aria-hidden="true" />
                    )}
                  </ComboboxButton>
                  <ComboboxOptions className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg border border-[#D1B3E0] focus:outline-none sm:text-sm">
                    {loading ? (
                      <div key="loading" className="relative cursor-default select-none py-2 px-4 text-gray-700">
                        Carregando...
                      </div>
                    ) : filteredBanks.length === 0 ? (
                      <div key="no-results" className="relative cursor-default select-none py-2 px-4 text-gray-700">
                        Banco não localizado
                      </div>
                    ) : (
                      filteredBanks.map((bank) => (
                        <ComboboxOption
                          key={bank.id}
                          className={({ active, selected }) =>
                            `relative cursor-pointer select-none py-4 pl-12 pr-4 text-lg border-b border-[#ECECEC] last:border-b-0
                              ${active ? "bg-[#E0D7F3] text-[#8B3DFF] font-semibold" : selected ? "bg-[#f3eaff] text-[#8B3DFF] font-semibold" : "text-gray-900 hover:bg-[#f3eaff]"}
                              transition-colors duration-150`
                          }
                          value={bank}
                        >
                          {({ selected, active }) => (
                            <React.Fragment>
                              <span
                                className={`block truncate ${
                                  selected ? "font-semibold" : "font-normal"
                                }`}
                              >
                                {bank.code} - {bank.name}
                              </span>
                              {selected && (
                                <span
                                  className={`absolute inset-y-0 left-0 flex items-center pl-4 ${
                                    active ? "text-white" : "text-[#8B3DFF]"
                                  }`}
                                >
                                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                              )}
                            </React.Fragment>
                          )}
                        </ComboboxOption>
                      ))
                    )}
                  </ComboboxOptions>
                </div>
              );
            }}
          </Combobox>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <Button
          type="button"
          className="border-2 border-[#8D44AD] text-[#8D44AD] bg-white rounded-full px-10 py-2 font-semibold transition hover:bg-[#f3eaff] hover:text-[#8D44AD] disabled:opacity-50 shadow-none w-full sm:w-auto"
          onClick={onBack}
        >
          Voltar
        </Button>
        <Button
          type="button"
          className="bg-[#8D44AD] text-white rounded-full px-10 py-2 font-semibold shadow-md hover:bg-[#7d379c] transition disabled:opacity-50 w-full sm:w-auto"
          onClick={() => {
            if (selectedBank) {
              SaveSelectedBank();
              onNext();
            }
          }}
          disabled={!selectedBank}
        >
          Próximo
        </Button>
      </div>

      <ErrorModal 
        isOpen={showErrorModal} 
        onClose={() => setShowErrorModal(false)} 
      />
    </div>
  );
});
