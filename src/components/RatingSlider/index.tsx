import { type LocalFeedback } from "../../app/(attendee)/components/DemosWorkspace/hooks/useFeedback";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import "./custom.css";

export const RATING_EMOJIS: Record<number, string> = {
  1: "😐",
  2: "🙂",
  3: "😀",
  4: "😁",
  5: "🤩",
};

export default function RatingSlider({
  feedback,
  setFeedback,
}: {
  feedback: LocalFeedback;
  setFeedback?: (feedback: LocalFeedback) => void;
}) {
  return (
    <Slider
      min={1}
      max={5}
      marks={RATING_EMOJIS}
      // @ts-ignore
      value={feedback?.rating}
      onChange={(value) => {
        setFeedback?.({ ...feedback, rating: value as number });
      }}
      styles={{
        track: { backgroundColor: "rgb(249 115 22)" },
        rail: { backgroundColor: setFeedback ? "#ddd" : "#ccc" },
        handle: {
          opacity: 1,
          backgroundColor: "white",
          borderColor: "rgb(249 115 22)",
          borderWidth: "3px",
          height: "20px",
          width: "20px",
          bottom: "-2px",
        },
      }}
      dotStyle={{
        borderColor: setFeedback ? "#ddd" : "#ccc",
        borderWidth: "3px",
        height: "12px",
        width: "12px",
        bottom: "-4px",
      }}
      activeDotStyle={{ borderColor: "rgb(249 115 22)" }}
    />
  );
}
