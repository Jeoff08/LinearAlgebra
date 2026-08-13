import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../lib/api";
import type { PdfItem } from "../types/models";

export default function PdfModal({
  pdf,
  onClose,
}: {
  pdf: PdfItem | null;
  onClose: () => void;
}) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;
    let alive = true;

    async function load() {
      if (!pdf) {
        setFileUrl(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await api.getPdfData(pdf.id);
        const binary = atob(data.base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const blob = new Blob([bytes], { type: data.mime });
        objectUrl = URL.createObjectURL(blob);
        if (alive) setFileUrl(objectUrl);
      } catch (err) {
        if (alive)
          setError(err instanceof Error ? err.message : "Failed to open PDF");
      } finally {
        if (alive) setLoading(false);
      }
    }

    void load();
    return () => {
      alive = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [pdf]);

  return (
    <AnimatePresence>
      {pdf && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,40,30,0.55)] p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="flex max-h-[90vh] w-full max-w-4xl flex-col border border-[var(--line)] bg-[#f4f7f2] shadow-[var(--shadow)]"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] px-5 py-4">
              <div>
                <h3 className="m-0 font-[Fraunces] text-xl">{pdf.title}</h3>
                <p className="m-0 text-sm text-[var(--muted)]">
                  {pdf.file_name}
                </p>
              </div>
              <button type="button" className="btn ghost" onClick={onClose}>
                Close
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {loading && <p className="text-[var(--muted)]">Loading PDF…</p>}
              {error && <p className="text-[var(--danger)]">{error}</p>}
              {fileUrl && (
                <div className="flex flex-col gap-3">
                  <div className="book-wrap">
                    <div className="book" role="document">
                      <div className="book-page book-page-left">
                        <div>
                          <div
                            style={{
                              fontFamily: "Fraunces",
                              fontWeight: 700,
                              fontSize: "1rem",
                            }}
                          >
                            Preview
                          </div>
                          <div className="mt-2 text-sm text-[var(--muted)]">
                            Use the cover to flip open the book.
                          </div>
                        </div>
                      </div>

                      <div className="book-page book-page-right">
                        <iframe
                          title={pdf.file_name}
                          src={fileUrl}
                          className="book-iframe"
                        />
                      </div>

                      <div className="book-spine-shadow" />

                      <motion.div
                        className="book-cover"
                        initial={{ rotateY: 0 }}
                        animate={{ rotateY: -160 }}
                        exit={{ rotateY: 0 }}
                        transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
                      >
                        <div>{pdf.title.split(" ")[0] || "Book"}</div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
