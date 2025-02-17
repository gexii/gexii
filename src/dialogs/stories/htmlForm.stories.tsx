import React, { forwardRef } from 'react';
import { Button, Stack } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { useDialogs } from '../hooks';
import { OpenAlertDialogOptions, OpenConfirmDialogOptions } from '../components';
import DialogsProvider from '../Provider';

// ----- META -----

const meta = {
  title: 'Dialogs/HTML Form',
  component: Demo,
  decorators: (Story) => (
    <DialogsProvider>
      <Story />
    </DialogsProvider>
  ),
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Demo>;

export default meta;

// ----- COMPONENTS -----

interface DemoProps {
  title: string;
  options?: OpenAlertDialogOptions & OpenConfirmDialogOptions;
}

/** Dialog showcase with html form */
function Demo({ title, options }: DemoProps) {
  const dialogs = useDialogs();
  return (
    <Stack direction="row" spacing={2}>
      <Button
        variant="contained"
        onClick={async () => {
          const value = await dialogs.form(DemoForm, title, options);
          if (!value) return;

          dialogs.alert(
            'Notice',
            <>
              <div>Your submit:</div>
              <br />
              <code>{JSON.stringify(value)}</code>
            </>,
          );
        }}
      >
        Open
      </Button>
    </Stack>
  );
}

interface DemoFormProps {
  onSubmit: (value: unknown) => void;
}

const DemoForm = forwardRef(
  ({ onSubmit }: DemoFormProps, ref: React.ForwardedRef<HTMLFormElement>) => {
    return (
      <form
        ref={ref}
        onSubmit={function handleSubmit(event) {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          onSubmit({ text: formData.get('text') });
        }}
      >
        <div style={{ display: 'flex', gap: 10 }}>
          <label>Text:</label>
          <input name="text" required style={{ width: '100%' }} />
        </div>
      </form>
    );
  },
);

// ----- STORIES -----

type Story = StoryObj<typeof meta>;

export const Example1: Story = {
  args: {
    title: 'Example Form',
    options: {
      okText: 'Ok',
      cancelText: 'Cancel',
      color: 'primary',
      maxWidth: 'sm',
    },
  },
};
