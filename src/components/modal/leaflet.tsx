import { type PanInfo, motion, useAnimation } from "framer-motion";
import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useEffect,
  useRef,
} from "react";

export default function Leaflet({
  setShowModal,
  children,
}: {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
}) {
  const leafletRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const transitionProps = { type: "spring", stiffness: 500, damping: 30 };
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    controls.start({ y: 0, transition: transitionProps });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleDragEnd(_: any, info: PanInfo) {
    const offset = info.offset.y;
    const velocity = info.velocity.y;
    const height = leafletRef.current?.getBoundingClientRect().height ?? 0;
    if (offset > height / 2 || velocity > 800) {
      controls.start({ y: "100%", transition: transitionProps });
      setShowModal(false);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      controls.start({ y: 0, transition: transitionProps });
    }
  }

  return (
    <>
      <motion.div
        ref={leafletRef}
        key="leaflet"
        className="group fixed inset-x-0 bottom-0 z-40 -mb-20 w-screen cursor-grab rounded-t-[30px] bg-white/60 pb-20 shadow-xl backdrop-blur-lg backdrop-brightness-150 active:cursor-grabbing md:hidden"
        initial={{ y: "100%" }}
        animate={controls}
        exit={{ y: "100%" }}
        transition={transitionProps}
        drag="y"
        dragDirectionLock
        onDragEnd={handleDragEnd}
        dragElastic={{ top: 0.05, bottom: 1 }}
        dragConstraints={{ top: 0, bottom: 0 }}
      >
        <div className={`-mb-4 flex h-7 w-full items-center justify-center`}>
          <div className="-mr-1 h-1 w-6 rounded-full bg-gray-400 transition-all group-active:rotate-12" />
          <div className="h-1 w-6 rounded-full bg-gray-400 transition-all group-active:-rotate-12" />
        </div>
        <div className="p-4">{children}</div>
      </motion.div>
      <motion.div
        key="leaflet-backdrop"
        className="fixed inset-0 z-30 bg-black/20 backdrop-blur"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowModal(false)}
      />
    </>
  );
}
