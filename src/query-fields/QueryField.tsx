'use client';

import { get, has } from 'lodash';
import { cloneElement, useContext } from 'react';

import { combineCallbacks } from 'src/utils';
import { useAction } from 'src/hooks';

import { ValueContext, UpdateContext } from './context';
import { CustomQueryFieldParams, EBehavior, UpdateQueryOptions } from './types';
import Provider from './Provider';
import ConfigProvider from './ConfigProvider';

// ----------

export interface QueryFieldProps extends UpdateQueryOptions {
  query?: string;
  shouldForwardError?: boolean;
  shouldForwardLoading?: boolean | { prop: string };
  defaultValue?: unknown;
  children: React.ReactElement | ((params: CustomQueryFieldParams) => React.ReactElement);
}

export default function QueryField({
  query: key,
  children,
  shouldForwardError = false,
  shouldForwardLoading = false,
  behavior = EBehavior.PUSH,
  defaultValue,
  childFields = [],
}: QueryFieldProps) {
  const value = useContext(ValueContext)[key || ''] ?? defaultValue;
  const update = useContext(UpdateContext);

  // --- FUNCTIONS ---

  const getValue = getValueExtractor();

  const updateField = useAction(async (value: unknown) => {
    await update(key, value, { behavior, childFields });
  });

  // --- HANDLERS ---

  const handleChange = async (...args: unknown[]) => {
    const value = getValue(...args);
    await updateField(value);
  };

  if (typeof children === 'function') {
    return children({
      value,
      error: updateField.getError(),
      loading: updateField.isLoading(),
      update: updateField,
    });
  }

  const childrenProps = children.props as Record<string, unknown>;
  return cloneElement(children, {
    ...childrenProps,
    ...{
      value: get(childrenProps, 'value') ?? value,
      error: shouldForwardError
        ? get(childrenProps, 'error') || !!updateField.getError()
        : undefined,
      onChange: combineCallbacks(handleChange, get(childrenProps, 'onChange') as never),
    },
    ...(shouldForwardLoading
      ? {
          [typeof shouldForwardLoading === 'object' ? shouldForwardLoading.prop : 'loading']:
            updateField.isLoading(),
        }
      : {}),
  });
}

QueryField.Provider = Provider;
QueryField.ConfigProvider = ConfigProvider;

// ----- HELPERS -----

function getValueExtractor() {
  return (...args: unknown[]) => {
    // Return the target value if the first argument is an event with a target value
    if (args[0] && typeof args[0] === 'object' && has(args[0], 'target.value'))
      return get(args[0], 'target.value');

    // Return the target checked if the first argument is an event with a target checked
    if (args[0] && typeof args[0] === 'object' && has(args[0], 'target.checked'))
      return get(args[0], 'target.checked');

    // Return the second argument if it exists
    if (args.length === 2) return args[1];

    // Return the first argument if it exists
    return args[0];
  };
}
