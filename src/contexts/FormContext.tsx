import React, { createContext, useContext } from "react";
import {
  useForm,
  FormProvider as RHFFormProvider,
  FieldValues,
  DefaultValues,
  UseFormReturn,
} from "react-hook-form";
import { ajvResolver } from "@hookform/resolvers/ajv";

interface FormContextType<T extends FieldValues> {
  formData: T;
  methods: UseFormReturn<T>; // Explicitly specify the type for `methods`
}

const FormContext = createContext<FormContextType<any> | undefined>(undefined);

export const useFormContextData = <T extends FieldValues>() => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContextData must be used within a FormProvider");
  }
  return context as FormContextType<T>;
};

export const FormProvider = <T extends FieldValues>({
  initialData,
  schema,
  children,
}: {
  initialData: T;
  schema: any;
  children: React.ReactNode;
}) => {
  const methods = useForm<T>({
    resolver: ajvResolver(schema, { allErrors: true }),
    mode: "onTouched",
    defaultValues: initialData as DefaultValues<T>,
  });

  return (
    <RHFFormProvider {...methods}>
      <FormContext.Provider value={{ formData: methods.getValues(), methods }}>
        {children}
      </FormContext.Provider>
    </RHFFormProvider>
  );
};
