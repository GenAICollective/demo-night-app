import { useWorkspaceContext } from "../../contexts/WorkspaceContext";
import { type Award, type Demo } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import ConfettiExplosion from "react-dom-confetti";

import { ResultsConfetti } from "~/components/Confetti";

export default function ResultsWorkspace({
  awards,
  demos,
}: {
  awards: Award[];
  demos: Demo[];
}) {
  const { currentEvent } = useWorkspaceContext();

  const currentAwardIndex = awards.findIndex(
    (award) => award.id === currentEvent.currentAwardId,
  );

  return (
    <div className="flex size-full flex-1 flex-col items-center justify-center gap-2 p-4">
      <div className="absolute bottom-0 w-full max-w-xl p-4">
        <h1 className="text-center font-kallisto text-4xl font-bold tracking-tight">
          Voting Results! 🤩
        </h1>
        <div className="mt-4 grid grid-cols-1 gap-8">
          {awards.map((award) => (
            <AwardWinnerItem
              key={award.id}
              award={award}
              demos={demos}
              currentAwardIndex={currentAwardIndex}
            />
          ))}
        </div>
      </div>
      <ResultsConfetti currentAwardIndex={currentAwardIndex} />
    </div>
  );
}

function AwardWinnerItem({
  award,
  demos,
  currentAwardIndex,
}: {
  award: Award;
  demos: Demo[];
  currentAwardIndex: number | null;
}) {
  const winner =
    currentAwardIndex !== null && currentAwardIndex >= award.index
      ? demos.find((demo) => demo.id === award.winnerId)
      : null;
  const [isExploding, setIsExploding] = useState(false);

  useEffect(() => {
    if (winner !== null) {
      setTimeout(() => {
        setIsExploding(true);
      }, 2000);
    } else {
      setIsExploding(false);
    }
  }, [winner]);

  return (
    <div className="flex flex-col font-medium">
      <h2 className="text-2xl font-bold">{award.name}</h2>
      <p className="text-md pb-2 pl-[2px] text-lg font-semibold italic leading-6 text-gray-500">
        {award.description}
      </p>
      <div className="m-auto w-1 translate-y-20">
        <ConfettiExplosion
          active={isExploding}
          config={{
            elementCount: 500,
            duration: 5000,
            stagger: 2,
          }}
        />
      </div>
      <AnimatePresence initial={false} mode="popLayout">
        {winner ? (
          <motion.div
            key={winner.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { delay: 2.0, duration: 1.5, type: "spring" },
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="group z-10 min-h-24 rounded-xl bg-green-400/50 p-4 shadow-xl backdrop-blur"
          >
            <Link
              href={winner.url}
              target="_blank"
              className="flex size-full flex-col font-medium"
            >
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold group-hover:underline">
                  {winner.name}
                </h2>
                <ArrowUpRight
                  size={24}
                  strokeWidth={3}
                  className="h-5 w-5 flex-none rounded-md bg-green-400/50 p-[2px] text-green-500 group-hover:bg-gray-300 group-hover:text-gray-700"
                />
              </div>
              <p className="font-medium italic text-gray-700">
                {winner.description}
              </p>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
            className="group z-10 flex min-h-24 items-center justify-center rounded-xl bg-gray-300/50 p-4 shadow-xl backdrop-blur"
          >
            <h2 className="text-4xl">🤫</h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
