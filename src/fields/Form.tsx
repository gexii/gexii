'use client';

import { noop } from 'lodash';
import React, { forwardRef } from 'react';
import { UseFormReturn, FormProvider, SubmitHandler } from 'react-hook-form';
import { combineCallbacks } from 'src/utils';

// ----------

export interface FormProps {
  children: React.ReactNode;
  methods: UseFormReturn<any>;
  onBeforeSubmit?: SubmitHandler<any>;
  onSubmit?: SubmitHandler<any>;
  onSubmitError?: (error: unknown, event?: React.BaseSyntheticEvent) => void;
}

export default forwardRef(function Form(
  { children, methods, onBeforeSubmit, onSubmit = noop, onSubmitError }: FormProps,
  ref: React.ForwardedRef<HTMLFormElement>,
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
      <form
        onSubmit={combineCallbacks.sequential(
          onBeforeSubmit && methods.handleSubmit(onBeforeSubmit),
          methods.handleSubmit(handleMethodSubmit, onSubmitError),
        )}
        ref={ref}
      >
        {children}
      </form>
    </FormProvider>
  );
});
