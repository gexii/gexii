'use client';

import { noop } from 'lodash';
import React, { createElement, forwardRef } from 'react';
import { UseFormReturn, FormProvider, SubmitHandler } from 'react-hook-form';
import { combineCallbacks } from 'src/utils';

// ----------

type ComponentType = React.ComponentType<any> | React.HTMLElementType;

export interface FormProps<TForm extends ComponentType = any> {
  children: React.ReactNode;
  methods: UseFormReturn<any>;
  component?: TForm;
  onBeforeSubmit?: SubmitHandler<any>;
  onSubmit?: SubmitHandler<any>;
  onSubmitError?: (error: unknown, event?: React.BaseSyntheticEvent) => void;
}

function Form<TForm extends ComponentType = 'form'>(
  {
    children,
    methods,
    component = 'form' as TForm,
    onBeforeSubmit,
    onSubmit = noop,
    onSubmitError,
    ...props
  }: FormProps<TForm> & Omit<React.ComponentProps<TForm>, keyof FormProps<any>>,
  ref: React.ForwardedRef<React.ComponentRef<TForm>>,
) {
  const handleMethodSubmit: SubmitHandler<any> = async (data, event) => {
    try {
      return await onSubmit(data, event);
    } catch (error) {
      if (onSubmitError && error instanceof Error) {
        onSubmitError(error, event);
      }
    }
  };

  return (
    <FormProvider {...methods}>
      {createElement(
        component,
        {
          ...props,
          ref,
          onSubmit: combineCallbacks.sequential(
            onBeforeSubmit && methods.handleSubmit(onBeforeSubmit),
            methods.handleSubmit(handleMethodSubmit, onSubmitError),
          ),
        },
        children,
      )}
    </FormProvider>
  );
}

export default forwardRef(Form as never) as unknown as typeof Form;
