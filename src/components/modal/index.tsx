"use client";

import FocusTrap from "focus-trap-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from "react";

import useWindowSize from "~/lib/hooks/useWindowSize";

import Leaflet from "./leaflet";
import { useModal } from "./provider";

export default function Modal({
  children,
  showModal,
  setShowModal,
}: {
  children: React.ReactNode;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const modal = useModal();
  const desktopModalRef = useRef(null);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        modal?.hide();
      }
    },
    [modal],
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  const { isMobile, isDesktop } = useWindowSize();

  return (
    <AnimatePresence>
      {showModal && (
        <>
          {isMobile && (
            <Leaflet setShowModal={setShowModal}>{children}</Leaflet>
          )}
          {isDesktop && (
            <>
              <FocusTrap focusTrapOptions={{ initialFocus: false }}>
                <motion.div
                  ref={desktopModalRef}
                  key="desktop-modal"
                  className="fixed inset-0 z-40 min-h-screen items-center justify-center md:flex"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={modalVariants}
                  onMouseDown={(e) => {
                    if (desktopModalRef.current === e.target) {
                      modal?.hide();
                    }
                  }}
                >
                  <div className="min-w-[320px] rounded-2xl bg-white p-4 shadow-xl">
                    {children}
                  </div>
                </motion.div>
              </FocusTrap>
              <motion.div
                key="desktop-backdrop"
                className="fixed inset-0 z-30 bg-black/20 backdrop-blur"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => modal?.hide()}
              />
            </>
          )}
        </>
      )}
    </AnimatePresence>
  );
}

const modalVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};
