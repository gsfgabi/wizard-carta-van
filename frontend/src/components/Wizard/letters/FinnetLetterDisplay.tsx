import React, { memo } from 'react';
import { type BankData, type CNABData } from '../../../services/api';

interface FinnetLetterDisplayProps {
  data: {
    type: string;
    content: string;
    formData: any;
    bankInfo: BankData | undefined;
    productInfo: any[];
    vanTypeInfo: any[];
    cnabs: CNABData[];
  };
}

export const FinnetLetterDisplay = memo(({
  data,
}: FinnetLetterDisplayProps) => {
  const { formData, bankInfo, productInfo, vanTypeInfo, cnabs } = data;

  const bancoNome = bankInfo?.name || 'Banco não encontrado';
  const gerenteNome = formData.manager_name || 'Não informado';

  const razaoSocialContratante = formData.corporate_name || 'Não informado';
  const cnpjContratante = formData.cnpj || 'Não informado';
  const agenciaConta = `${formData.branch_number || ''} / ${formData.account_number || ''}`;
  const convenio = formData.agreement_number || 'Não informado';

  const nomeRespEmpresa = formData.responsible_person_name || 'Não informado';
  const emailRespEmpresa = formData.responsible_person_email || 'Não informado';
  const telefoneRespEmpresa = formData.responsible_person_cellphone || 'Não informado';

  const nomeGerenteConta = formData.manager_name || 'Não informado';
  const emailGerenteConta = formData.manager_email || 'Não informado';
  const telefoneGerenteConta = formData.manager_cellphone || 'Não informado';

  return (
    <div className="finnet-letter-container p-8 border border-gray-300 rounded-lg shadow-lg bg-white text-gray-800 text-base leading-relaxed font-sans print:p-0 print:border-0 print:shadow-none print:text-[10pt] print:leading-tight text-left">
      {/* Cabeçalho */}
      <div className="text-center mb-6 pb-6 border-b-2 border-gray-400 print:mb-4 print:pb-4 print:border-b print:border-gray-800">
        <p className="text-xl font-bold mb-4 uppercase text-gray-900">Carta de Abertura de Relacionamento</p>
        
        <p className="mb-2 text-gray-700">Ao BANCO <span className="font-semibold">{bancoNome}</span></p>
        <p className="mb-6 text-gray-700">A/C <span className="font-semibold">{gerenteNome}</span></p>
      </div>
      
      <p className="font-bold mb-4 text-lg text-gray-900">Assunto: Intercâmbio de Arquivos – {razaoSocialContratante}</p>

      <p className="mb-6 text-justify text-gray-700">
        Comunicamos que nossa empresa passou a operar os relacionamentos de EDI, transferência eletrônica de arquivos, através da VAN FINNET.
        Solicitamos que esta Instituição disponibilize o suporte necessário para viabilizar esta implantação, onde as ações necessárias para esta migração serão conduzidas juntamente com a FINNET.
      </p>

      {/* Informações do Contratante */}
      <div className="mb-6 pb-6 border-b-2 border-gray-400 print:pb-4 print:border-b print:border-gray-800">
        <h4 className="font-bold mb-3 text-lg text-gray-900">Contratante</h4>
        <p className="mb-1 text-gray-700">Razão Social: <span className="font-semibold">{razaoSocialContratante}</span></p>
        <p className="mb-1 text-gray-700">CNPJ: <span className="font-semibold">{cnpjContratante}</span></p>
        <p className="mb-1 text-gray-700">Agência / Conta Corrente: <span className="font-semibold">{agenciaConta}</span></p>
        <p className="text-gray-700">Convênio: <span className="font-semibold">{convenio}</span></p>
      </div>

      {/* Informações da VAN Contratada */}
      <div className="mb-6 pb-6 border-b-2 border-gray-400 print:pb-4 print:border-b print:border-gray-800">
        <h4 className="font-bold mb-3 text-lg text-gray-900">Van Contratada</h4>
        <p className="mb-1 text-gray-700">Razão Social: <span className="font-semibold">FINNET S/A Tecnologia</span></p>
        <p className="text-gray-700">CNPJ: <span className="font-semibold">05.607.266/0001-10</span></p>
      </div>

      {/* Produtos Financeiros */}
      <div className="mb-6 pb-6 border-b-2 border-gray-400 print:pb-4 print:border-b print:border-gray-800">
        <h4 className="font-bold mb-3 text-lg text-gray-900">Produtos Financeiros</h4>
        {productInfo.length === 0 ? (
          <p className="text-gray-700">Nenhum produto selecionado.</p>
        ) : (
          <ul>
            {productInfo.map(product => (
              <li key={product.id} className="flex items-center mb-1 text-gray-700">
                <span className="mr-2">(&nbsp;)</span>{product.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Ambiente */}
      <div className="mb-6 pb-6 border-b-2 border-gray-400 print:pb-4 print:border-b print:border-gray-800">
        <h4 className="font-bold mb-3 text-lg text-gray-900">Ambiente</h4>
        <p className="text-gray-700">(X) Arquivo em produção</p>
      </div>

      {/* CNAB */}
      <div className="mb-6 pb-6 border-b-2 border-gray-400 print:pb-4 print:border-b print:border-gray-800">
        <h4 className="font-bold mb-3 text-lg text-gray-900">Cnab</h4>
        <ul>
          {cnabs.map(cnab => (
             <li key={cnab.id} className="flex items-center mb-1 text-gray-700">
              <span className="mr-2">{formData.cnab === cnab.name ? '(X)' : '( )'}</span>{cnab.name}
            </li>
          ))}
        </ul>
      </div>

      <p className="mb-6 text-gray-700">Os custos serão assumidos 100% pela Empresa (alterar para 100% Banco se assim for negociado entre Empresa e Banco)</p>

      <p className="mb-4 text-gray-700">Qualquer dúvida contatar:</p>

      {/* Contatos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 mb-6 text-gray-700">
        <div>
          <h4 className="font-bold mb-1 text-lg text-gray-900">Contato da Empresa</h4>
          <p className="mb-1">Nome: <span className="font-semibold">{nomeRespEmpresa}</span></p>
          <p className="mb-1">E-mail: <span className="font-semibold">{emailRespEmpresa}</span></p>
          <p>Telefone: <span className="font-semibold">{telefoneRespEmpresa}</span></p>
        </div>
        <div>
          <h4 className="font-bold mb-1 text-lg text-gray-900">Contato da VAN FINNET</h4>
          <p className="mb-1">Nome: <span className="font-semibold">Bianca e João</span></p>
          <p className="mb-1">E-mail: <span className="font-semibold">pis.posvenda@finnet.com.br</span></p>
          <p>Telefone: <span className="font-semibold">(11) 94457-8493 (11) 99189-2213</span></p>
        </div>
         <div>
          <h4 className="font-bold mb-1 text-lg text-gray-900">Contato do responsável técnico</h4>
          <p className="mb-1">Nome: <span className="font-semibold">[VARIÁVEL NOME RESPONSÁVEL TECNOSPEED]</span></p>
          <p>E-mail: <span className="font-semibold">[VARIÁVEL E-MAIL RESPONSÁVEL TECNOSPEED]</span></p>
        </div>
        <div>
          <h4 className="font-bold mb-1 text-lg text-gray-900">Contato do gerente de conta</h4>
          <p className="mb-1">Nome: <span className="font-semibold">{nomeGerenteConta}</span></p>
          <p className="mb-1">E-mail: <span className="font-semibold">{emailGerenteConta}</span></p>
          <p>Telefone: <span className="font-semibold">{telefoneGerenteConta}</span></p>
        </div>
      </div>

       {/* Parte inferior */}
      <div className="mt-8 text-center">
        <p className="mb-6 text-gray-700">Colocamo-nos à disposição para quaisquer esclarecimentos adicionais.</p>
        <p className="font-semibold mb-12 text-gray-900">Atenciosamente,</p>
        <div className="border-t border-black mx-auto w-64 mb-2"></div>
        <p className="text-xs text-gray-700">Assinatura do Responsável pela empresa</p>
      </div>
    </div>
  );
}); 