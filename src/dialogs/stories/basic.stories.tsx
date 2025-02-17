import React from 'react';
import { Button, Stack } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { useDialogs } from '../hooks';
import { OpenAlertDialogOptions, OpenConfirmDialogOptions } from '../components';
import DialogsProvider from '../Provider';

// ----- META -----

const meta = {
  title: 'Dialogs/Basic',
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
  message: string;
  options?: OpenAlertDialogOptions & OpenConfirmDialogOptions;
}

function Demo({ title, message, options }: DemoProps) {
  const dialogs = useDialogs();
  return (
    <Stack direction="row" spacing={2}>
      <Button variant="contained" onClick={() => dialogs.alert(title, message, options)}>
        Open Alert
      </Button>

      <Button variant="contained" onClick={() => dialogs.confirm(title, message, options)}>
        Open Confirm
      </Button>
    </Stack>
  );
}

// ----- STORIES -----

type Story = StoryObj<typeof meta>;

export const Example1: Story = {
  args: {
    title: 'Notice',
    message: 'Here you can put on your custom content',
    options: {
      okText: 'Ok',
      cancelText: 'Cancel',
      color: 'primary',
      maxWidth: 'xs',
    },
  },
};
