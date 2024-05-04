import { type Feedback } from "@prisma/client";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import "./custom.css";

export default function RatingSlider({
  feedback,
  setFeedback,
}: {
  feedback: Feedback;
  setFeedback: (feedback: Feedback) => void;
}) {
  return (
    <Slider
      min={1}
      max={7}
      marks={{
        1: "🤮",
        2: "😕",
        3: "😐",
        4: "🙂",
        5: "😀",
        6: "😁",
        7: "🤩",
      }}
      // @ts-ignore
      value={feedback?.rating}
      onChange={(value) => {
        setFeedback({ ...feedback, rating: value as number });
      }}
      styles={{
        track: { backgroundColor: "rgb(249 115 22)" },
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
        borderColor: "#ddd",
        borderWidth: "3px",
        height: "12px",
        width: "12px",
        bottom: "-4px",
      }}
      activeDotStyle={{ borderColor: "rgb(249 115 22)" }}
    />
  );
}
