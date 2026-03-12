"use client";

import { AnimatePresence, motion } from "framer-motion";

export type LightboxVideo = {
  title: string;
  src: string;
  poster: string;
};

type VideoLightboxProps = {
  open: boolean;
  onClose: () => void;
  video: LightboxVideo | null;
};

export default function VideoLightbox({
  open,
  onClose,
  video,
}: VideoLightboxProps) {
  return (
    <AnimatePresence>
      {open && video ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-black"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <p className="text-sm font-semibold text-ink">{video.title}</p>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-ink-muted transition hover:text-ink"
              >
                Close
              </button>
            </div>
            <video
              controls
              autoPlay
              poster={video.poster}
              className="h-full w-full bg-black"
            >
              <source src={video.src} />
            </video>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
