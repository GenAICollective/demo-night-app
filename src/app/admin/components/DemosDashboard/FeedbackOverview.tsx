import { type Feedback } from "@prisma/client";

export default function FeedbackOverview({
  feedback,
}: {
  feedback: Feedback[];
}) {
  const { stars, rating, claps, wantToAccess, wantToInvest, wantToWork } =
    feedback.reduce(
      (acc, f) => ({
        stars: acc.stars + (f.star ? 1 : 0),
        rating: acc.rating + (f.rating ?? 0),
        claps: acc.claps + f.claps,
        wantToAccess: acc.wantToAccess + (f.wantToAccess ? 1 : 0),
        wantToInvest: acc.wantToInvest + (f.wantToInvest ? 1 : 0),
        wantToWork: acc.wantToWork + (f.wantToWork ? 1 : 0),
      }),
      {
        stars: 0,
        rating: 0,
        claps: 0,
        wantToAccess: 0,
        wantToInvest: 0,
        wantToWork: 0,
      },
    );
  return (
    <div className="flex h-14 w-full flex-row gap-2">
      <div className="flex basis-1/6 flex-col items-center justify-center rounded-xl bg-white py-2">
        <p className="font-bold text-gray-400">Tot</p>
        <p className="-mt-1 text-xl font-bold">{feedback.length}</p>
      </div>
      <div className="flex basis-1/6 flex-col items-center justify-center rounded-xl bg-white py-2">
        <p className="text-gray-400">⭐️</p>
        <p className="-mt-1 text-xl font-bold">{stars}</p>
      </div>
      <div className="flex basis-1/6 flex-col items-center justify-center rounded-xl bg-white py-2">
        <p className="text-gray-400">#️⃣</p>
        <p className="-mt-1 text-xl font-bold">
          {feedback.length > 0 ? (rating / feedback.length).toFixed(1) : "-"}
        </p>
      </div>
      <div className="flex basis-1/6 flex-col items-center justify-center rounded-xl bg-white py-2">
        <p className="text-gray-400">👏</p>
        <p className="-mt-1 text-xl font-bold">{claps}</p>
      </div>
      <div className="flex basis-2/6 flex-col items-center justify-center rounded-xl bg-white py-2">
        <p className="line-clamp-1 text-gray-400">📬 • 💰 • 🧑‍💻</p>
        <p className="-mt-1 line-clamp-1 text-xl font-bold">
          {`${wantToAccess} • ${wantToInvest} • ${wantToWork}`}
        </p>
      </div>
    </div>
  );
}
