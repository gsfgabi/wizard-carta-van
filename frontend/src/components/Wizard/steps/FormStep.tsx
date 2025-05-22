import React, { memo } from 'react';
import { Formik, Form, Field } from 'formik';
import { IMaskInput } from 'react-imask';
import InputField from '../../Form/InputField';
import Button from '../../Button/Button';
import type { CNABData, BankData, ProductData } from '../../../services/api';
import { formValidationSchema, isValidCNPJ, validatePhone } from '../../../utils/validation';
import { maskCNPJ, maskPhone, maskAccount, maskAccountDV, maskBranch, maskBranchDV, maskAgreement } from '../../../utils/mask';
import * as Yup from 'yup';

interface FormData {
  cnpj: string;
  corporate_name: string;
  responsible_person_name: string;
  responsible_person_position: string;
  responsible_person_cellphone: string;
  responsible_person_email: string;
  branch_number: string;
  branch_dv: string;
  account_number: string;
  account_dv: string;
  agreement_number: string;
  cnab: string;
  manager_name: string;
  manager_cellphone: string;
  manager_email: string;
}

interface FormStepProps {
  formData: FormData;
  onUpdate: (data: FormData) => void;
  onNext: () => void;
  onBack: () => void;
  selectedBank: number | null;
  cnabs: CNABData[];
  banks: BankData[];
  products: ProductData[];
  selectedProducts: string[];
}

export const FormStep = memo(({
  formData,
  onUpdate,
  onNext,
  onBack,
  selectedBank,
  cnabs,
  banks,
  products,
  selectedProducts,
}: FormStepProps) => {
  const initialValues: FormData = {
    cnpj: formData.cnpj || '',
    corporate_name: formData.corporate_name || '',
    responsible_person_name: formData.responsible_person_name || '',
    responsible_person_position: formData.responsible_person_position || '',
    responsible_person_cellphone: formData.responsible_person_cellphone || '',
    responsible_person_email: formData.responsible_person_email || '',
    branch_number: formData.branch_number || '',
    branch_dv: formData.branch_dv || '',
    account_number: formData.account_number || '',
    account_dv: formData.account_dv || '',
    agreement_number: formData.agreement_number || '',
    cnab: formData.cnab || '',
    manager_name: formData.manager_name || '',
    manager_cellphone: formData.manager_cellphone || '',
    manager_email: formData.manager_email || '',
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-black mb-1">
        3. Preencher dados da empresa e conta
      </h2>
      <p className="text-base text-gray-700 mb-6">
        A seguir precisamos coletar alguns dados que utilizaremos para elaborar a carta de VAN para o banco desejado.
      </p>

      {/* Exibir Banco Selecionado */}
      {
        selectedBank !== null && (
          <div className="mb-4 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold text-black mb-2">Banco Selecionado:</h4>
            <p className="text-base text-gray-700">
              {banks.find(bank => bank.id === selectedBank)?.code} - {banks.find(bank => bank.id === selectedBank)?.name}
            </p>
          </div>
        )
      }

      {/* Exibir Produtos Selecionados */}
      {
        selectedProducts.length > 0 && (
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold text-black mb-2">Produtos Selecionados:</h4>
            <ul className="list-disc list-inside text-base text-gray-700">
              {selectedProducts.map(productId => {
                const product = products.find(p => p.id.toString() === productId);
                return product ? <li key={productId}>{product.name}</li> : null;
              })}
            </ul>
          </div>
        )
      }

      <Formik
        initialValues={initialValues}
        validationSchema={formValidationSchema}
        onSubmit={(values) => {
          console.log('Formulário submetido com sucesso:', values);
          onUpdate(values);
          onNext();
        }}
        validateOnMount={true}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ errors, touched, setFieldValue, values, isValid, handleSubmit }) => {
          console.log('Formik State:', { errors, touched, isValid, values });
          return (
            <Form onSubmit={handleSubmit}>
              {/* EMPRESA */}
              <div className="mb-6">
                <h3 className="font-semibold text-black mb-2">Empresa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field name="corporate_name">
                    {({ field }: any) => (
                      <InputField
                        label="Razão Social"
                        placeholder="Inserir razão social da empresa"
                        error={touched.corporate_name && errors.corporate_name ? errors.corporate_name : ''}
                        {...field}
                      />
                    )}
                  </Field>
                  <Field name="cnpj">
                    {({ field }: any) => (
                      <InputField
                        label="CNPJ"
                        placeholder="Inserir número do CNPJ"
                        error={touched.cnpj && errors.cnpj ? errors.cnpj : ''}
                        {...field}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const maskedValue = maskCNPJ(e.target.value);
                          field.onChange({
                            target: {
                              name: field.name,
                              value: maskedValue
                            }
                          });
                        }}
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                          field.onBlur(e);
                        }}
                      />
                    )}
                  </Field>
                </div>
              </div>

              {/* RESPONSÁVEL */}
              <div className="mb-6">
                <h3 className="font-semibold text-black mb-2">Responsável pela Empresa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field name="responsible_person_position">
                    {({ field }: any) => (
                      <InputField
                        label="Cargo"
                        placeholder="Inserir cargo do responsável da empresa"
                        error={touched.responsible_person_position && errors.responsible_person_position ? errors.responsible_person_position : ''}
                        {...field}
                      />
                    )}
                  </Field>
                  <Field name="responsible_person_name">
                    {({ field }: any) => (
                      <InputField
                        label="Nome"
                        placeholder="Inserir nome do responsável pela empresa"
                        error={touched.responsible_person_name && errors.responsible_person_name ? errors.responsible_person_name : ''}
                        {...field}
                      />
                    )}
                  </Field>
                  <Field name="responsible_person_email">
                    {({ field }: any) => (
                      <InputField
                        label="E-mail"
                        placeholder="Inserir email do responsável pela empresa"
                        type="email"
                        error={touched.responsible_person_email && errors.responsible_person_email ? errors.responsible_person_email : ''}
                        {...field}
                      />
                    )}
                  </Field>
                  <Field name="responsible_person_cellphone">
                    {({ field }: any) => (
                      <InputField
                        label="Telefone"
                        placeholder="Inserir telefone do responsável pela empresa"
                        error={touched.responsible_person_cellphone && errors.responsible_person_cellphone ? errors.responsible_person_cellphone : ''}
                        {...field}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const maskedValue = maskPhone(e.target.value);
                          field.onChange({
                            target: {
                              name: field.name,
                              value: maskedValue
                            }
                          });
                        }}
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                          field.onBlur(e);
                        }}
                      />
                    )}
                  </Field>
                </div>
              </div>

              {/* CONTA */}
              <div className="mb-6">
                <h3 className="font-semibold text-black mb-2">Conta</h3>

                {/* Linha com Banco, Conta+DV e Agência+DV */}
                <div className="w-full flex justify-center gap-4">
                  {/* Conta + DV */}
                  <div className="flex gap-2 flex-grow">
                    <Field name="account_number">
                      {({ field }: any) => (
                        <InputField
                          label="Conta"
                          placeholder="Inserir o número da conta"
                          error={touched.account_number && errors.account_number ? errors.account_number : ''}
                          {...field}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const maskedValue = maskAccount(e.target.value);
                            field.onChange({
                              target: {
                                name: field.name,
                                value: maskedValue
                              }
                            });
                          }}
                        />
                      )}
                    </Field>
                    <Field name="account_dv">
                      {({ field }: any) => (
                        <InputField
                          label="DV"
                          placeholder="DV"
                          error={touched.account_dv && errors.account_dv ? errors.account_dv : ''}
                          {...field}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const maskedValue = maskAccountDV(e.target.value);
                            field.onChange({
                              target: {
                                name: field.name,
                                value: maskedValue
                              }
                            });
                          }}
                        />
                      )}
                    </Field>
                  </div>

                  {/* Agência + DV */}
                  <div className="flex gap-2 flex-grow">
                    <Field name="branch_number">
                      {({ field }: any) => (
                        <InputField
                          label="Agência"
                          placeholder="Inserir o número da agência"
                          error={touched.branch_number && errors.branch_number ? errors.branch_number : ''}
                          {...field}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const maskedValue = maskBranch(e.target.value);
                            field.onChange({
                              target: {
                                name: field.name,
                                value: maskedValue
                              }
                            });
                          }}
                        />
                      )}
                    </Field>
                    <Field name="branch_dv">
                      {({ field }: any) => (
                        <InputField
                          label="DV"
                          placeholder="DV"
                          error={touched.branch_dv && errors.branch_dv ? errors.branch_dv : ''}
                          {...field}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const maskedValue = maskBranchDV(e.target.value);
                            field.onChange({
                              target: {
                                name: field.name,
                                value: maskedValue
                              }
                            });
                          }}
                        />
                      )}
                    </Field>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Field name="agreement_number">
                    {({ field }: any) => (
                      <InputField
                        label="Convênio"
                        placeholder="Inserir número do convênio"
                        error={touched.agreement_number && errors.agreement_number ? errors.agreement_number : ''}
                        {...field}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const maskedValue = maskAgreement(e.target.value);
                          field.onChange({
                            target: {
                              name: field.name,
                              value: maskedValue
                            }
                          });
                        }}
                      />
                    )}
                  </Field>
                  <div>
                    <label className="font-semibold text-black mb-2">CNAB</label>
                    <div className="flex flex-wrap gap-4 mt-2">
                      {cnabs.length === 0 ? (
                        <p className="text-gray-600">Nenhum CNAB disponível para este banco.</p>
                      ) : (
                        cnabs.map(cnab => (
                          <label 
                            key={cnab.id} 
                            className={
                              `flex items-center gap-2 p-3 rounded-lg ${(values.cnab === cnab.name) ? 'bg-[#f3eaff]' : 'bg-white hover:bg-[#f3eaff]'} ${!cnab.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} transition-colors duration-200`
                            }
                          >
                            <Field
                              type="radio"
                              name="cnab"
                              value={cnab.name}
                              className="accent-[#8D44AD]"
                              disabled={!cnab.available}
                            />
                            <span className={`text-base ${!cnab.available ? 'text-gray-400' : 'text-gray-700'}`}>
                              {cnab.name}
                            </span>
                          </label>
                        ))
                      )}
                    </div>
                    {touched.cnab && errors.cnab && (
                      <span className="text-red-500 text-xs mt-1">{errors.cnab}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* GERENTE CONTA */}
              <div className="mb-8">
                <h3 className="font-semibold text-black mb-2">Gerente Conta</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field name="manager_name">
                    {({ field }: any) => (
                      <InputField
                        label="Nome"
                        placeholder="Inserir nome do gerente da conta bancária"
                        error={touched.manager_name && errors.manager_name ? errors.manager_name : ''}
                        {...field}
                      />
                    )}
                  </Field>
                  <Field name="manager_email">
                    {({ field }: any) => (
                      <InputField
                        label="E-mail"
                        placeholder="Inserir email do gerente da conta bancária"
                        type="email"
                        error={touched.manager_email && errors.manager_email ? errors.manager_email : ''}
                        {...field}
                      />
                    )}
                  </Field>
                  <Field name="manager_cellphone">
                    {({ field }: any) => (
                      <InputField
                        label="Telefone"
                        placeholder="Inserir telefone do gerente da conta bancária"
                        error={touched.manager_cellphone && errors.manager_cellphone ? errors.manager_cellphone : ''}
                        {...field}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const maskedValue = maskPhone(e.target.value);
                          field.onChange({
                            target: {
                              name: field.name,
                              value: maskedValue
                            }
                          });
                        }}
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                          field.onBlur(e);
                        }}
                      />
                    )}
                  </Field>
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
                  type="submit"
                  className="bg-[#8D44AD] text-white rounded-full px-10 py-2 font-semibold shadow-md hover:bg-[#7d379c] transition disabled:opacity-50"
                  disabled={!isValid}
                  onClick={() => {
                    console.log('Botão Revisar clicado');
                    console.log('Formulário é válido:', isValid);
                    console.log('Erros atuais:', errors);
                  }}
                >
                  Revisar
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
});