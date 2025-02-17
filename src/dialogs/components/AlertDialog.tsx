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

export interface OpenAlertDialogOptions {
  okText?: React.ReactNode;
  color?: ButtonProps['color'];
  maxWidth?: DialogProps['maxWidth'];
}

export interface AlertDialogProps extends OpenAlertDialogOptions {
  open: boolean;
  title: React.ReactNode;
  message: React.ReactNode;
  onClose: () => void;
}

export default function AlertDialog({
  open,
  title,
  message,
  color,
  okText = 'Ok',
  maxWidth = 'xs',
  onClose: close = noop,
}: AlertDialogProps) {
  return (
    <Dialog open={open} maxWidth={maxWidth} onClose={() => close()}>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" color={color} onClick={() => close()}>
          {okText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
