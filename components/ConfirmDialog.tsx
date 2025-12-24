"use client";

import Modal from "./Modal";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  onConfirmAction: () => void;
  onCancelAction: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Confirm",
  onConfirmAction,
  onCancelAction,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onCloseAction={onCancelAction}>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="mb-4 text-sm text-stone-600">{message}</p>

      <div className="flex justify-end gap-2">
        <button
          onClick={onCancelAction}
          className="rounded px-3 py-1 hover:bg-stone-100"
        >
          Cancel
        </button>
        <button
          onClick={onConfirmAction}
          className="rounded bg-red-600 px-3 py-1 text-white"
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
