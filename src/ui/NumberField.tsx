import MuiTextField, { StandardTextFieldProps } from '@mui/material/TextField';
import { isNumber, noop } from 'lodash';
import React, { ForwardedRef, forwardRef, useState } from 'react';
import { useBoolean, useUpdateEffect } from 'react-use';

import { combineCallbacks } from 'src/utils';

// ----------

export interface TextFieldProps extends Omit<StandardTextFieldProps, 'value' | 'onChange'> {
  value?: number | string | null;
  defaultValue?: number;
  min?: number;
  max?: number;
  decimal?: number;
  onChange?: (value: number | null, event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default forwardRef(function NumberField(
  { value, defaultValue = 0, min, max, decimal, onChange = noop, ...props }: TextFieldProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const [text, setText] = useState(() => getFixedValue(value));
  const [isFocus, setFocus] = useBoolean(false);

  // --- FUNCTIONS ---

  const blurActiveElement = () => {
    const input = document.activeElement as HTMLInputElement;
    input?.blur?.();
  };

  const syncText = () => {
    setText(getFixedValue(value));
  };

  function getFixedValue(value: TextFieldProps['value']) {
    const number = Number(value ?? defaultValue);
    return isNumber(decimal) ? number.toFixed(decimal) : number.toString();
  }

  // --- HANDLERS ---

  const handleKeyDown: React.KeyboardEventHandler = (event) => {
    if (event.key === 'Enter') syncText();
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setText(event.target.value);

    const number = event.target.value && Number(getFixedValue(event.target.value));

    if (number === '') return onChange(defaultValue, event);

    if (Number.isNaN(number)) return;

    if (isNumber(max) && number > max) return onChange(max, event);

    if (isNumber(min) && number < min) return onChange(min, event);

    onChange(number, event);
  };

  // --- EFFECTS ---

  useUpdateEffect(syncText, [min, max, decimal]);

  useUpdateEffect(() => {
    if (!isFocus) syncText();
  }, [value]);

  return (
    <MuiTextField
      {...props}
      ref={ref}
      type="number"
      value={text}
      onChange={handleChange}
      onWheel={combineCallbacks(blurActiveElement, props.onWheel)}
      onBlur={combineCallbacks(syncText, () => setFocus(false), props.onBlur)}
      onFocus={combineCallbacks(() => setFocus(true), props.onFocus)}
      onKeyDown={combineCallbacks(handleKeyDown, props.onKeyDown)}
    />
  );
});
