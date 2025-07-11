'use client';

import { get, has } from 'lodash';
import { cloneElement, useContext } from 'react';

import { combineCallbacks } from 'src/utils';
import { useAction } from 'src/hooks';

import { ValueContext, UpdateContext } from './context';
import { EBehavior, CustomQueryFieldParams, MultipleQueriesFieldRule, UpdateQueryOptions } from './types';
import Provider from './Provider';
import ConfigProvider from './ConfigProvider';

// ----------

export interface QueryFieldProps extends UpdateQueryOptions {
  query: string | MultipleQueriesFieldRule;
  shouldForwardError?: boolean;
  shouldForwardLoading?: boolean | { prop: string };
  defaultValue?: unknown;
  updateProp?: string;
  valueProp?: string;
  schema?: Zod.ZodTypeAny;
  valueExtractor?: (...args: any[]) => any;
  children: React.ReactElement | ((params: CustomQueryFieldParams) => React.ReactElement);
}

export default function QueryField({
  query: queryFieldRule,
  children,
  shouldForwardError = false,
  shouldForwardLoading = false,
  behavior = EBehavior.PUSH,
  defaultValue,
  updateProp = 'onChange',
  valueProp = 'value',
  schema,
  valueExtractor = getEventValueExtractor(),
  childFields = [],
}: QueryFieldProps) {
  const query = useContext(ValueContext);
  const update = useContext(UpdateContext);

  const fieldValue = getFieldValue(query, queryFieldRule, defaultValue)
  const validatedValue = schema ? schema.catch(defaultValue).parse(fieldValue) : fieldValue;

  // --- HANDLERS ---

  const handleChange = useAction(async (...args: unknown[]) => {
    const value = schema ? schema.parse(valueExtractor(...args)) : valueExtractor(...args);
    await update(getValueEntries(queryFieldRule, value, defaultValue), { behavior, childFields });
  });

  if (typeof children === 'function') {
    return children({
      value: validatedValue,
      error: handleChange.getError(),
      loading: handleChange.isLoading(),
      update: handleChange,
    });
  }

  const childrenProps = children.props as Record<string, unknown>;
  return cloneElement(children, {
    ...childrenProps,
    ...{
      [valueProp]: has(childrenProps, valueProp) ? get(childrenProps, valueProp) : validatedValue,
      error: shouldForwardError
        ? get(childrenProps, 'error') || !!handleChange.getError()
        : undefined,
      [updateProp]: combineCallbacks(handleChange, get(childrenProps, updateProp) as never),
    },
    ...(shouldForwardLoading
      ? {
        [typeof shouldForwardLoading === 'object' ? shouldForwardLoading.prop : 'loading']:
          handleChange.isLoading(),
      }
      : {}),
  });
}

QueryField.Provider = Provider;
QueryField.ConfigProvider = ConfigProvider;

// ----- HELPERS -----

function getEventValueExtractor() {
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

function getValueEntries(
  queryFieldRule: string | MultipleQueriesFieldRule,
  value: unknown,
  defaultValue?: unknown,
): [string, unknown][] {
  if (typeof queryFieldRule === 'string') {
    return [[queryFieldRule, value ?? defaultValue]];
  }

  if (Array.isArray(queryFieldRule)) {
    return queryFieldRule.map((key, index) => [key, get(value, index, get(defaultValue, index))]);
  }

  if (typeof queryFieldRule === 'object') {
    return Object.entries(queryFieldRule).map(([valueKey, queryKey]) => [
      queryKey,
      get(value, valueKey, get(defaultValue, valueKey)),
    ]);
  }

  return [[queryFieldRule, value]];
}

function getFieldValue(
  query: Record<string, unknown>,
  queryFieldRule: string | MultipleQueriesFieldRule,
  defaultValue?: unknown,
): unknown {
  if (typeof queryFieldRule === 'string') {
    return get(query, queryFieldRule, defaultValue);
  }

  if (Array.isArray(queryFieldRule)) {
    return queryFieldRule.map((key) => get(query, key, get(defaultValue, key)));
  }

  if (typeof queryFieldRule === 'object') {
    return Object.fromEntries(getValueEntries(queryFieldRule, query, defaultValue));
  }

  return get(query, queryFieldRule);
}
