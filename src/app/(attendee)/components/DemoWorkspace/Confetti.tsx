import { type Feedback } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";

import useWindowSize from "~/lib/hooks/useWindowSize";

export function StarConfetti({ feedback }: { feedback: Feedback }) {
  const { windowSize } = useWindowSize();
  const [_active, _setActive] = useState(false);
  const [previousFeedbackId, setPreviousFeedbackId] = useState<string>("");
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (feedback.id !== previousFeedbackId) {
      setPreviousFeedbackId(feedback.id);
      _setActive(false);
      return;
    }
    if (feedback.star) {
      _setActive(true);
      timeoutId.current = setTimeout(() => {
        _setActive(false);
      }, 1000);
    } else {
      _setActive(false);
    }
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [feedback.star]); // eslint-disable-line react-hooks/exhaustive-deps

  const drawShape = (ctx: CanvasRenderingContext2D) => {
    ctx.font = "20px sans-serif";
    ctx.fillText("⭐", 0, 0);
  };

  return (
    <Confetti
      className="selection-none"
      width={windowSize.width}
      height={windowSize.height}
      drawShape={drawShape}
      tweenDuration={1000}
      gravity={0.05}
      numberOfPieces={_active ? 500 : 0}
    />
  );
}

export function ClapsConfetti({ feedback }: { feedback: Feedback }) {
  const { windowSize } = useWindowSize();
  const [_active, _setActive] = useState(false);
  const [previousFeedbackId, setPreviousFeedbackId] = useState<string>("");
  const [previousClaps, setPreviousClaps] = useState(0);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (feedback.id !== previousFeedbackId) {
      setPreviousFeedbackId(feedback.id);
      setPreviousClaps(feedback.claps);
      _setActive(false);
      return;
    }
    if (feedback.claps > previousClaps) {
      _setActive(true);
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      timeoutId.current = setTimeout(
        () => {
          _setActive(false);
        },
        100 * (feedback.claps - previousClaps),
      );
    }
    setPreviousClaps(feedback.claps);
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [feedback.id, feedback.claps]); // eslint-disable-line react-hooks/exhaustive-deps

  const drawShape = (ctx: CanvasRenderingContext2D) => {
    ctx.font = "40px sans-serif";
    ctx.fillText("👏", 0, 0);
  };

  return (
    <Confetti
      className="selection-none"
      width={windowSize.width}
      height={windowSize.height}
      drawShape={drawShape}
      tweenDuration={10000}
      gravity={0.05}
      numberOfPieces={_active ? 50 : 0}
    />
  );
}
