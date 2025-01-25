import { type Feedback } from "@prisma/client";
import { useMemo } from "react";

import * as QuickActions from "~/lib/types/quickActions";

import { Card } from "~/components/ui/card";

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
    <div className="flex w-full flex-row gap-2">
      <Card className="flex basis-1/6 flex-col items-center justify-center py-2">
        <p className="line-clamp-1 h-5 text-sm font-bold text-muted-foreground">
          Total
        </p>
        <p className="line-clamp-1 text-lg font-bold">{feedback.length}</p>
      </Card>
      <Card className="flex basis-1/6 flex-col items-center justify-center py-2">
        <p className="line-clamp-1 h-5 text-sm text-muted-foreground">#️⃣</p>
        <p className="line-clamp-1 text-lg font-bold">
          {feedback.length > 0
            ? (agg.rating / feedback.length).toFixed(1)
            : "-"}
        </p>
      </Card>
      <Card className="flex basis-1/6 flex-col items-center justify-center py-2">
        <p className="line-clamp-1 h-5 text-sm text-muted-foreground">👏</p>
        <p className="line-clamp-1 text-lg font-bold">{agg.claps}</p>
      </Card>
      <Card className="flex basis-1/6 flex-col items-center justify-center py-2">
        <p className="line-clamp-1 h-5 text-sm text-muted-foreground">📬</p>
        <p className="line-clamp-1 text-lg font-bold">{agg.tellMeMores}</p>
      </Card>
      <Card className="flex basis-2/6 flex-col items-center justify-center py-2">
        <p className="line-clamp-1 h-5 text-sm text-muted-foreground">
          {QuickActions.visibleActions.map(([_, a]) => a.icon).join(" • ")}
        </p>
        <p
          className="line-clamp-1 text-lg font-bold"
          dangerouslySetInnerHTML={{
            __html: Object.values(agg.quickActions).join(
              " <span class='text-xs text-muted-foreground'>•</span> ",
            ),
          }}
        />
      </Card>
    </div>
  );
}
