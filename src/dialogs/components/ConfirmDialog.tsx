import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
} from '@mui/material';
import { noop } from 'lodash';

// ----------

export interface OpenConfirmDialogOptions {
  okText?: React.ReactNode;
  cancelText?: React.ReactNode;
  color?: ButtonProps['color'];
  maxWidth?: DialogProps['maxWidth'];
}

export interface ConfirmDialogProps extends OpenConfirmDialogOptions {
  open: boolean;
  title: React.ReactNode;
  message: React.ReactNode;
  onClose: (confirmed: boolean) => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  color,
  okText = 'Ok',
  cancelText = 'Cancel',
  maxWidth = 'xs',
  onClose: close = noop,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} maxWidth={maxWidth} onClose={() => close(false)}>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color={color} onClick={() => close(false)}>
          {cancelText}
        </Button>
        <Button variant="contained" color={color} onClick={() => close(true)}>
          {okText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
