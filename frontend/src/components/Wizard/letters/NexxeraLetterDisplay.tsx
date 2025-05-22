import React, { memo } from 'react';

interface NexxeraLetterDisplayProps {
  data: { 
    type: string;
    content: string; 
    formData: any; 
    bankInfo: any; 
    productInfo: any[]; 
    vanTypeInfo: any[]; 
  };
}

export const NexxeraLetterDisplay = memo(({
  data,
}: NexxeraLetterDisplayProps) => {
  const { formData, bankInfo, productInfo, vanTypeInfo } = data;

  // Agora use formData, bankInfo, productInfo, etc. diretamente para preencher o template JSX
  const bancoNome = bankInfo?.name || '[NOME DO BANCO]';
  const bancoAgencia = formData.branch_number || '[AGÊNCIA]';
  const cidadebanco = formData.branch_city || '[CIDADE DO BANCO]';
  const ufBanco = formData.branch_state || '[UF DO BANCO]';

  const gerenteNome = formData.manager_name || '[NOME DO GERENTE DO BANCO]';
  const gerenteTelefone = formData.manager_cellphone || '[TELEFONE GERENTE]';
  const gerenteEmail = formData.manager_email || '[E-MAIL GERENTE DO BANCO]';

  const razaoSocialContratante = formData.corporate_name || '[NOME EMPRESA]';
  const cnpjContratante = formData.cnpj || '[CNPJ EMPRESA]';
  const nomeRespEmpresa = formData.responsible_person_name || '[NOME RESP EMPRESA]';
  const cargoRespEmpresa = formData.responsible_person_position || '[CARGO RESP. EMPRESA]';
  const telefoneEmpresa = formData.responsible_person_cellphone || '[TELEFONE EMPRESA]';
  const emailRespEmpresa = formData.responsible_person_email || '[E-MAIL RESP EMPRESA]';

  // Placeholder para Responsável Técnico - Não vem da API ou form
  const respTecnospeedNome = '[RESP TECNOSPEED]';
  const respTecnospeedEmail = '[RESP. TECNOSPEED]';

  // TODO: Continuar preenchendo o restante dos campos e estruturando a tabela de produtos e outras seções

  return (
    <div className="nexxera-letter-container p-8 border border-gray-300 rounded-lg shadow-lg bg-white text-gray-800 text-base leading-relaxed font-sans print:p-0 print:border-0 print:shadow-none print:text-[10pt] print:leading-tight text-left">
      {/* Cabeçalho */}
      <div className="text-center mb-6 pb-6 border-b-2 border-gray-400 print:mb-4 print:pb-4 print:border-b print:border-gray-800">
        <h3 className="text-xl font-bold mb-4 uppercase">CARTA DE ABERTURA DE RELACIONAMENTO</h3> {/* Ajustado tamanho, peso e uppercase */}
        {/* Logo do Plugbank */}
        <div className="mb-4 py-4 flex items-center justify-center">
          <img 
            src="/logo.png" 
            alt="Logo Plugbank" 
            className="h-20 print:h-10 object-contain"
          />
        </div>
        <div className="text-lg font-semibold mb-1">{razaoSocialContratante}</div> {/* Ajustado tamanho */} 
        <p className="text-sm text-gray-600">Carta Circular</p>
      </div>

      {/* Dados do Banco */}
      <div className="mb-6 pb-6 border-b-2 border-gray-400 print:pb-4 print:border-b print:border-gray-800">
        <h4 className="font-bold mb-3 text-lg text-gray-900">Dados do Banco:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 text-gray-700">
           <p><strong>Banco:</strong> {bankInfo?.code || '[CODIGO DO BANCO]'} - {bancoNome}</p> {/* Incluído código do banco com placeholder */}
           <p><strong>Agência:</strong> {formData?.branch_number || '[AGÊNCIA DO BANCO]'} - {bancoAgencia}</p> {/* Placeholder */}
           <p><strong>Cidade:</strong> {formData?.branch_city || '[CIDADE DO BANCO]'} - {cidadebanco}</p> {/* Placeholder */}
           <p><strong>UF:</strong>{formData?.branch_state || '[UF DO BANCO]'} - {ufBanco}</p> {/* Placeholder */}
        </div>
      </div>

      {/* Dados do gerente responsável */}
      <div className="mb-6 pb-6 border-b-2 border-gray-400 print:pb-4 print:border-b print:border-gray-800">
        <h4 className="font-bold mb-3 text-lg text-gray-900">Dados do gerente responsável pela abertura (ou setor responsável pela abertura do processo) (OBRIGATÓRIO):</h4>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 text-gray-700">
            <p><strong>Nome:</strong> {gerenteNome}</p>
            <p><strong>Telefone/Celular:</strong> {gerenteTelefone}</p>
            <p><strong>E-mail:</strong> {gerenteEmail}</p>
         </div>
         {/* Preferência por contato */}
         <div className="mt-4 text-gray-700">
           <p className="font-semibold mb-2">Preferência por contato:</p>
           <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
             <span>[ ] E-mail</span>
             <span>[ ] Telefone</span>
             <span>[ ] Whatsapp</span>
             <span>Outro: _______</span>
           </div>
         </div>
         <p className="mt-2 text-sm text-gray-500">*** Este contato será utilizado apenas caso haja problemas ou atrasos no processo de liberação do relacionamento</p>
      </div>

      {/* Assunto */}
      <div className="mb-6 pb-6 border-b-2 border-gray-400 print:pb-4 print:border-b print:border-gray-800">
        <h4 className="font-bold mb-3 text-lg text-gray-900">Assunto:</h4>
        <p className="text-gray-700">Solicitação de Alteração do Processo EDI – Troca Eletrônica de Dados</p> {/* Texto Fixo */}
      </div>

      {/* Corpo do texto principal */}
      <div className="mb-6 text-gray-700 text-justify print:text-sm">
        <p className="mb-4">Prezados Senhores,</p>
        <p className="mb-4">
          Avaliando os processos eletrônicos existentes na <strong>{razaoSocialContratante}</strong>,
          percebemos a necessidade de alterarmos a forma de entrega e recebimento de arquivos eletrônicos com bancos, implantando em nossa empresa maior padronização e controle nestes processos.
          Em função de atender estas necessidades de integração, informamos que a VAN NEXXERA TECNOLOGIA E SERVIÇOS S/A ficará responsável pelo tráfego de dados entre a <strong>{razaoSocialContratante}</strong> e o Banco, para os arquivos da tabela abaixo, em substituição ao atual meio de comunicação.
        </p>
      </div>

      {/* Tabela Serviço no Banco */}
      <div className="mb-6 pb-6 border-b-2 border-gray-400 print:pb-4 print:border-b print:border-gray-800">
        <h4 className="font-bold mb-3 text-lg text-gray-900">Serviço no Banco:</h4>
        {productInfo.length === 0 ? (
           <p className="text-gray-700">Nenhum produto selecionado.</p>
        ) : (
           <table className="w-full text-left border-collapse border border-gray-400 print:border-gray-800">
             <thead>
               <tr className="bg-gray-100 print:bg-gray-300 print:text-gray-900">
                 <th className="border border-gray-400 print:border-gray-800 px-4 py-2 font-semibold text-gray-800 print:text-gray-900">Serviço no Banco</th>
                 <th className="border border-gray-400 print:border-gray-800 px-4 py-2 font-semibold text-gray-800 print:text-gray-900">Serviço no Banco</th> {/* Coluna duplicada conforme template */}
                 <th className="border border-gray-400 print:border-gray-800 px-4 py-2 font-semibold text-gray-800 print:text-gray-900">Serviço no Banco</th> {/* Coluna duplicada conforme template */}
               </tr>
             </thead>
             <tbody>
               <tr>
                 {/* Renderizar produtos selecionados, limitando a 3 colunas na primeira linha */}
                 {productInfo.slice(0, 3).map((product, prodIndex) => (
                   <td key={prodIndex} className="border border-gray-400 print:border-gray-800 px-4 py-2 text-gray-700 align-top">[{product.name.toUpperCase()}]</td>
                 ))}
                 {/* Preencher células vazias se menos de 3 produtos para manter o formato */}
                 {[...Array(Math.max(0, 3 - productInfo.length))].map((_, emptyIndex) => (
                   <td key={`empty-${emptyIndex}`} className="border border-gray-400 print:border-gray-800 px-4 py-2 text-gray-700 align-top">[SERVIÇO DO BANCO]</td>
                 ))}
               </tr>
                {/* Adicionar linhas adicionais para produtos > 3 */}
                {productInfo.length > 3 && (
                   <tr>
                      {productInfo.slice(3, 6).map((product, prodIndex) => (
                         <td key={`add-${prodIndex}`} className="border border-gray-400 print:border-gray-800 px-4 py-2 text-gray-700 align-top">[{product.name.toUpperCase()}]</td>
                      ))}
                       {[...Array(Math.max(0, 3 - productInfo.slice(3, 6).length))].map((_, emptyIndex) => (
                         <td key={`empty-add-${emptyIndex}`} className="border border-gray-400 print:border-gray-800 px-4 py-2 text-gray-700 align-top">[SERVIÇO DO BANCO]</td>
                       ))}
                   </tr>
                )}
                 {/* Adicionar mais linhas se necessário (por exemplo, para produtos 7-9) */}
                {productInfo.length > 6 && (
                   <tr>
                      {productInfo.slice(6, 9).map((product, prodIndex) => (
                         <td key={`add2-${prodIndex}`} className="border border-gray-400 print:border-gray-800 px-4 py-2 text-gray-700 align-top">[{product.name.toUpperCase()}]</td>
                      ))}
                       {[...Array(Math.max(0, 3 - productInfo.slice(6, 9).length))].map((_, emptyIndex) => (
                         <td key={`empty-add2-${emptyIndex}`} className="border border-gray-400 print:border-gray-800 px-4 py-2 text-gray-700 align-top">[SERVIÇO DO BANCO]</td>
                       ))}
                   </tr>
                )}
                {/* Pode continuar adicionando linhas conforme necessário */}
             </tbody>
           </table>
        )}
      </div>

       {/* Continuação Corpo do texto */}
      <div className="mb-6 text-gray-700 text-justify print:text-sm">
         <p className="mb-4">
            Este processo faz parte de um novo projeto que está sendo implementado na área financeira de nossa empresa, e por essa razão necessitamos da liberação dos arquivos solicitados, em Ambiente de Produção.
            Desta forma, solicitamos que o Banco disponibilize à Nexxera os arquivos com periodicidade diária, através do meio de comunicação já utilizado com a Nexxera.
         </p>
         <p className="mb-4">Informamos que os custos de Troca Eletrônica de Informações - EDI será 100% empresa.</p>
         <p className="mb-4">
            Os contatos na Nexxera serão através da equipe de Relacionamentos no e-mail implantacao@nexxera.com. Sendo assim, solicitamos seu empenho em liberar este acesso com a maior brevidade possível, sob pena de impactar o cronograma do projeto.
            Contamos com sua habitual atenção e desde já agradecemos.
         </p>
      </div>


      {/* Assinatura */}
      <div className="mt-10 text-right print:mt-6">
        <p className="font-semibold mb-6 text-gray-900 print:mb-4">Atenciosamente,</p>

        {/* Contratante Detalhes para Assinatura - Usando tabela para melhor fidelidade ao design de duas colunas */}
        <table className="border border-gray-400 print:border-gray-800 inline-block text-left text-gray-800 print:text-gray-900 text-sm leading-normal border-collapse w-full"> {/* Alterado w-auto para w-full */}
          <tbody>
            <tr>
              <td className="border border-gray-400 print:border-gray-800 py-1 px-2 font-bold">RAZÃO SOCIAL:</td> {/* Ajustado padding */}
              <td className="border border-gray-400 print:border-gray-800 py-1 px-2 pr-4">{razaoSocialContratante}</td> {/* Ajustado padding */}
              <td className="border border-gray-400 print:border-gray-800 py-1 px-2 font-bold">CNPJ:</td> {/* Ajustado padding */}
              <td className="border border-gray-400 print:border-gray-800 py-1 px-2">{cnpjContratante}</td> {/* Ajustado padding */}
            </tr>
            <tr>
              <td className="border border-gray-400 print:border-gray-800 py-1 px-2 font-bold">NOME:</td> {/* Ajustado padding */}
              <td className="border border-gray-400 print:border-gray-800 py-1 px-2 pr-4">{nomeRespEmpresa}</td> {/* Ajustado padding */}
              <td className="border border-gray-400 print:border-gray-800 py-1 px-2 font-bold">CARGO:</td> {/* Ajustado padding */}
              <td className="border border-gray-400 print:border-gray-800 py-1 px-2">{cargoRespEmpresa}</td> {/* Ajustado padding */}
            </tr>
            <tr>
              <td className="border border-gray-400 print:border-gray-800 py-1 px-2 font-bold">TELEFONE:</td> {/* Ajustado padding */}
              <td className="border border-gray-400 print:border-gray-800 py-1 px-2 pr-4">{telefoneEmpresa}</td> {/* Ajustado padding */}
              <td className="border border-gray-400 print:border-gray-800 py-1 px-2 font-bold">E-MAIL:</td> {/* Ajustado padding */}
              <td className="border border-gray-400 print:border-gray-800 py-1 px-2">{emailRespEmpresa}</td> {/* Ajustado padding */}
            </tr>
            {/* Responsável Técnico - Placeholder */}
            <tr>
              <td className="border border-gray-400 print:border-gray-800 py-1 px-2 font-bold">RESPONSÁVEL:</td> {/* Ajustado padding */}
              <td className="border border-gray-400 print:border-gray-800 py-1 px-2 pr-4">{respTecnospeedNome}</td> {/* Ajustado padding */}
              <td className="border border-gray-400 print:border-gray-800 py-1 px-2 font-bold">E-MAIL RESP TEC:</td> {/* Ajustado padding */}
              <td className="border border-gray-400 print:border-gray-800 py-1 px-2">{respTecnospeedEmail}</td> {/* Ajustado padding */}
            </tr>
          </tbody>
        </table>
      </div>

       
    </div>
  );
}); 