"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Delete",
  loading = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onCancel}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-white p-7 text-center"
          >
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red/10 text-red">
              <AlertTriangle size={20} strokeWidth={1.8} />
            </span>
            <h3 className="mt-5 font-display text-lg font-semibold text-ink">{title}</h3>
            <p className="mt-2 whitespace-pre-line text-[14px] leading-relaxed text-ink/55">{description}</p>

            <div className="mt-7 flex items-center gap-3">
              <button
                onClick={onCancel}
                disabled={loading}
                className="flex-1 rounded-full border border-ink/12 px-5 py-3 text-[13.5px] font-semibold text-ink transition-colors hover:border-ink/30 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-red px-5 py-3 text-[13.5px] font-semibold text-white transition-colors hover:bg-red/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading && <Loader2 size={14} className="animate-spin" strokeWidth={2} />}
                {loading ? "Deleting..." : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
