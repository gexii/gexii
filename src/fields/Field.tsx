'use client';

import { cloneElement, useMemo } from 'react';
import { includes, isObject } from 'lodash';
import { useController, UseControllerProps, useFormContext } from 'react-hook-form';
import {
  Collapse,
  FormHelperText,
  FormHelperTextProps,
  FormLabel,
  FormLabelProps,
  Stack,
  StackProps,
  styled,
} from '@mui/material';

import { useLastValidValue, useUpdateEffect } from 'src/hooks';
import { combineCallbacks } from 'src/utils';

import { TransformableType, transform } from './helpers';

// ----------

const VARIANT = {
  STANDARD: 'standard', // render with standard form
  PURE: 'pure', // render without container, label, helper, and other addition features
} as const;

interface FieldPropsBase extends UseControllerProps {
  shouldForwardError?: boolean;
  dependencies?: string[];
  type?: TransformableType | ((...args: unknown[]) => unknown);
  children?:
    | null
    | React.ReactElement
    | ((control: ReturnType<typeof useController>) => React.ReactElement);
}

export interface FieldProps extends FieldPropsBase {
  variant?: (typeof VARIANT)[keyof typeof VARIANT];
  label?: React.ReactNode;
  helper?: React.ReactNode;
  fullWidth?: boolean;
  orientation?: EOrientation;
  errorMessageGetter?: (error: Error) => React.ReactNode;
  slotProps?: {
    root?: StackProps;
    label?: FormLabelProps;
    helperText?: FormHelperTextProps;
    before?: FormLabelProps;
    after?: FormLabelProps;
  };
}

export default function Field({
  // based props
  variant = VARIANT.STANDARD,
  children: findChildren,
  shouldForwardError = true,
  dependencies = [],
  type,

  // standard props
  label,
  helper,
  fullWidth = false,
  orientation = EOrientation.VERTICAL,
  errorMessageGetter = (error) => error.message,
  slotProps,

  // controller configs
  ...controlOptions
}: FieldProps) {
  const { watch: useWatch } = useFormContext();
  const control = useController(controlOptions);

  const childNode = typeof findChildren === 'function' ? findChildren(control) : findChildren;

  const childrenProps = (childNode?.props || {}) as Record<string, never>;

  const hasError = Boolean(childrenProps.error || control.fieldState.error);
  const lastError = useLastValidValue<Error>(
    isObject,
    () => childrenProps.error || control.fieldState.error,
  );

  const lastHelper = useLastValidValue(Boolean, () => helper);

  // --- FUNCTIONS ---

  const valueTransform = useMemo(() => {
    if (!type) return <T,>(value: T) => value;

    if (typeof type === 'function') return type;

    return <T,>(value: T) => transform(value, type);
  }, [type]);

  const renderField = () => {
    if (!childNode) return null;

    if (typeof findChildren === 'function') return childNode;

    return cloneElement(childNode, {
      ...childrenProps,
      error: shouldForwardError ? hasError : undefined,
      value: childrenProps.value ?? control.field.value,
      name: childrenProps.name ?? control.field.name,
      disabled: childrenProps.disabled || control.field.disabled,
      onChange: (...args: unknown[]) =>
        combineCallbacks(control.field.onChange, childrenProps.onChange)(valueTransform(...args)),
      onBlur: combineCallbacks(control.field.onBlur, childrenProps.onBlur),
    } as never);
  };

  const getRootDirection = () => {
    return orientation === EOrientation.HORIZONTAL ? 'row' : 'column';
  };

  // --- EFFECTS ---

  // force trigger onChange event if the value of dependencies changed
  useUpdateEffect(() => {
    control.field.onChange(control.field.value);
  }, useWatch(dependencies));

  if (variant === VARIANT.PURE) return renderField();

  return (
    <Root {...slotProps?.root} direction={getRootDirection()} fullWidth={fullWidth}>
      {label && <FormLabel {...slotProps?.label}>{label}</FormLabel>}

      <Stack direction="row">{renderField()}</Stack>

      <Collapse in={hasError} mountOnEnter unmountOnExit>
        <FormHelperText {...slotProps?.helperText} error>
          {lastError && errorMessageGetter(lastError)}
        </FormHelperText>
      </Collapse>

      <Collapse in={!hasError && Boolean(helper)} mountOnEnter unmountOnExit>
        <FormHelperText {...slotProps?.helperText}>{lastHelper}</FormHelperText>
      </Collapse>
    </Root>
  );
}

// ----- STYLED -----

const Root = styled(Stack, { shouldForwardProp: (prop) => !includes(['fullWidth'], prop) })<
  Pick<FieldProps, 'fullWidth'>
>(({ fullWidth }) => ({
  width: fullWidth ? '100%' : undefined,
}));

// ----- TYPES -----

const EOrientation = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal',
} as const;

type EOrientation = (typeof EOrientation)[keyof typeof EOrientation];
