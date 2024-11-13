import { type Feedback } from "@prisma/client";
import { useMemo } from "react";

import * as QuickActions from "~/lib/types/quickActions";

export default function FeedbackOverview({
  feedback,
}: {
  feedback: Feedback[];
}) {
  const agg = useMemo(() => {
    const agg = {
      stars: 0,
      rating: 0,
      claps: 0,
      tellMeMores: 0,
      quickActions: Object.fromEntries(
        QuickActions.visibleActions.map(([id]) => [id, 0]),
      ),
    };
    for (const f of feedback) {
      agg.rating += f.rating ?? 0;
      agg.claps += f.claps;
      agg.tellMeMores += f.tellMeMore ? 1 : 0;
      for (const action of f.quickActions) {
        agg.quickActions[action]! += 1;
      }
    }
    return agg;
  }, [feedback]);

  return (
    <div className="flex h-14 w-full flex-row gap-2">
      <div className="flex basis-1/6 flex-col items-center justify-center rounded-xl bg-white py-2">
        <p className="-mt-1 line-clamp-1 h-7 font-bold text-gray-400">Tot</p>
        <p className="line-clamp-1 text-xl font-bold">{feedback.length}</p>
      </div>
      <div className="flex basis-1/6 flex-col items-center justify-center rounded-xl bg-white py-2">
        <p className="-mt-1 line-clamp-1 h-7 text-gray-400">#️⃣</p>
        <p className="line-clamp-1 text-xl font-bold">
          {feedback.length > 0
            ? (agg.rating / feedback.length).toFixed(1)
            : "-"}
        </p>
      </div>
      <div className="flex basis-1/6 flex-col items-center justify-center rounded-xl bg-white py-2">
        <p className="-mt-1 line-clamp-1 h-7 text-gray-400">👏</p>
        <p className="line-clamp-1 text-xl font-bold">{agg.claps}</p>
      </div>
      <div className="flex basis-1/6 flex-col items-center justify-center rounded-xl bg-white py-2">
        <p className="-mt-1 line-clamp-1 h-7  text-gray-400">📬</p>
        <p className="line-clamp-1 text-xl font-bold">{agg.tellMeMores}</p>
      </div>
      <div className="flex basis-2/6 flex-col items-center justify-center rounded-xl bg-white py-2">
        <p className="-mt-1 line-clamp-1 h-7 text-gray-400">
          {QuickActions.visibleActions.map(([_, a]) => a.icon).join(" • ")}
        </p>
        <p className="line-clamp-1 text-xl font-bold">
          {Object.values(agg.quickActions).join(" • ")}
        </p>
      </div>
    </div>
  );
}
