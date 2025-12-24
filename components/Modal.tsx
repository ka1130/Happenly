"use client";
import { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onCloseAction: () => void;
  children: ReactNode;
};

export default function Modal({ open, onCloseAction, children }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onCloseAction}
    >
      <div
        className="rounded-lg bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
