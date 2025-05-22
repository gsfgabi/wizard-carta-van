import React, { useState, useEffect } from "react";
import { BankSelection } from "./steps/BankSelection";
import { ProductSelection } from "./steps/ProductSelection";
import { FormStep } from "./steps/FormStep";
import { ValidationStep } from "./steps/ValidationStep";
import { VanTypeSelection } from "./steps/VanTypeSelection";
import { CompletionStep } from "./steps/CompletionStep";
import Card from "../Card/Card";
// import WizardIntro from "../../pages/WizardIntro";
import Stepper from "../Stepper/StepperSteps";
import { getBanks, getProducts, getCNABs, getVanTypes, type BankData, type ProductData, type CNABData, type VanTypeData } from "../../services/api";
import toast from 'react-hot-toast';

export type WizardStep = "bank" | "products" | "form" | "van-type" | "validation" | "completion";

export const steps = [
  "Banco",
  "Produto",
  "Dados da empresa e conta",
  "Tipo de VAN",
  "Revisão",
  "Encerramento",
];

interface WizardProps {
  onBackToIntro: () => void;
}

export const Wizard: React.FC<WizardProps> = ({ onBackToIntro }) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>("bank");
  const [selectedBank, setSelectedBank] = useState<number | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedVanTypes, setSelectedVanTypes] = useState<string[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [banks, setBanks] = useState<BankData[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [errorBanks, setErrorBanks] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [cnabs, setCNABs] = useState<CNABData[]>([]);
  const [vanTypes, setVanTypes] = useState<VanTypeData[]>([]);
  const [generatedLetterContents, setGeneratedLetterContents] = useState<{ type: string, content: string, formData: any, bankInfo: BankData | undefined, productInfo: ProductData[], vanTypeInfo: VanTypeData[], cnabs: CNABData[] }[]>([]);
  const [ticketDetails, setTicketDetails] = useState<{ number: string; link: string } | null>(null);
  const [loadingConfirmAndSend, setLoadingConfirmAndSend] = useState(false);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        setLoadingBanks(true);
        setErrorBanks(null);
        const data = await getBanks();
        setBanks(data);
      } catch (error) {
        console.error('Erro ao buscar bancos:', error);
        setErrorBanks('Erro ao carregar a lista de bancos. Por favor, tente novamente.');
      } finally {
        setLoadingBanks(false);
      }
    };

    fetchBanks();
  }, []);

  useEffect(() => {
    if (selectedBank) {
      console.log('Iniciando busca de detalhes para o banco:', selectedBank);
      const startTime = Date.now();
      Promise.all([
        getProducts(selectedBank.toString()),
        getCNABs(selectedBank.toString()),
        getVanTypes(selectedBank.toString())
      ])
        .then(([productsData, cnabsData, vanTypesData]) => {
          const endTime = Date.now();
          console.log('Detalhes do banco carregados em', endTime - startTime, 'ms');
          setProducts(productsData);
          setCNABs(cnabsData);
          setVanTypes(vanTypesData);
        })
        .catch(error => {
          const endTime = Date.now();
          console.log('Erro ao carregar detalhes do banco em', endTime - startTime, 'ms', error);
          console.error('Erro ao carregar detalhes do banco:', error);
        });
    } else {
      setProducts([]);
      setCNABs([]);
      setVanTypes([]);
    }
  }, [selectedBank]);

  const handleNext = () => {
    switch (currentStep) {
      case "bank":
        setCurrentStep("products");
        break;
      case "products":
        setCurrentStep("form");
        break;
      case "form":
        const availableVanTypes = vanTypes.filter(vanType => vanType.available);
        if (availableVanTypes.length === 1) {
          setSelectedVanTypes([availableVanTypes[0].id.toString()]);
          handleGenerateLetterAndNext([availableVanTypes[0].id.toString()]);
        } else {
          setCurrentStep("van-type");
        }
        break;
      case "van-type":
        break;
      default:
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case "bank":
        onBackToIntro();
        break;
      case "products":
        setCurrentStep("bank");
        break;
      case "form":
        setCurrentStep("products");
        break;
      case "van-type":
        setCurrentStep("form");
        break;
      case "validation":
        const availableVanTypes = vanTypes.filter(vanType => vanType.available);
        if (availableVanTypes.length === 1) {
          setCurrentStep("form");
        } else {
          setCurrentStep("van-type");
        }
        break;
      default:
        break;
    }
  };

  const handleGenerateLetterAndNext = (vanTypesSelected: string[]) => {
    console.log("handleGenerateLetterAndNext chamado com vanTypesSelected:", vanTypesSelected);
    
    const bankInfo = banks.find(b => b.id === selectedBank);
    const productInfo = products.filter(p => selectedProducts.includes(p.id.toString()));
    const vanTypeInfo = vanTypes.filter(v => vanTypesSelected.includes(v.id.toString()));

    if (!bankInfo) {
      console.error("Banco selecionado não encontrado!");
      return;
    }

    // Gerar cartas baseadas nos tipos de VAN selecionados
    const lettersWithTypes = vanTypeInfo.map(van => ({
      type: van.type,
      content: '', // O conteúdo será gerado pelos componentes específicos
      formData: formData,
      bankInfo: bankInfo,
      productInfo: productInfo,
      vanTypeInfo: vanTypeInfo,
      cnabs: cnabs,
    }));

    setGeneratedLetterContents(lettersWithTypes);
    setCurrentStep("validation");
  };

  const handleConfirmAndSend = async () => {
    setLoadingConfirmAndSend(true);
    try {
      // TODO: Implementar chamada à API para criar ticket no Zendesk
      // TODO: Implementar envio de e-mail
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success('Carta enviada com sucesso!');
      setTicketDetails({ number: '456981', link: 'https://www.zendesk.com.br/tecnospeed/456981' });
      setCurrentStep("completion");
    } catch (error) {
      console.error('Erro ao enviar carta:', error);
      toast.error('Erro ao enviar a carta. Tente novamente.');
    } finally {
      setLoadingConfirmAndSend(false);
    }
  };

  const handleStartOver = () => {
    // Resetar estados 
    setCurrentStep("bank");
    setSelectedBank(null);
    setSelectedProducts([]);
    setSelectedVanTypes([]);
    setFormData({});
    setGeneratedLetterContents([]);
    setTicketDetails(null);
  };

  const renderStep = () => {
    switch (currentStep) {
      case "bank":
        return (
          <BankSelection
            onSelect={setSelectedBank}
            selectedBank={selectedBank}
            onNext={handleNext}
            onBack={handleBack}
            banks={banks}
            loading={loadingBanks}
            error={errorBanks}
          />
        );
      case "products":
        return (
          <ProductSelection
            selectedProducts={selectedProducts}
            onSelect={setSelectedProducts}
            onNext={handleNext}
            onBack={handleBack}
            selectedBank={selectedBank}
            products={products}
          />
        );
      case "form":
        return (
          <FormStep
            formData={formData}
            onUpdate={setFormData}
            onNext={handleNext}
            onBack={handleBack}
            selectedBank={selectedBank}
            cnabs={cnabs}
            banks={banks}
            products={products}
            selectedProducts={selectedProducts}
          />
        );
      case "van-type":
        return (
          <VanTypeSelection
            selectedBank={selectedBank}
            selectedVanTypes={selectedVanTypes}
            onSelect={setSelectedVanTypes}
            onNext={handleGenerateLetterAndNext}
            onBack={handleBack}
          />
        );
      case "validation":
        return (
          <ValidationStep
            selectedProducts={selectedProducts}
            selectedVanTypes={selectedVanTypes}
            onBack={handleBack}
            selectedBank={selectedBank}
            generatedLetterContents={generatedLetterContents}
            onConfirmAndSend={handleConfirmAndSend}
            loadingConfirmAndSend={loadingConfirmAndSend}
          />
        );
      case "completion":
        return (
          <CompletionStep
            ticketNumber={ticketDetails?.number || ''}
            ticketLink={ticketDetails?.link || ''}
            onStartOver={handleStartOver}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#8D44AD] flex flex-col items-center justify-start px-2">
      <Stepper
        currentStep={
          ["bank", "products", "form", "van-type", "validation", "completion"].indexOf(currentStep)
        }
        steps={steps}
      />
      <Card className="w-full max-w-full sm:max-w-2xl md:max-w-3xl mt-4">
        <div className="px-2 sm:px-6 md:px-8 py-6 sm:py-8">{renderStep()}</div>
      </Card>
    </div>
  );
};
