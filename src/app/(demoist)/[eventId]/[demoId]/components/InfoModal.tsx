import {
  QUICK_ACTIONS_ICON,
  QUICK_ACTIONS_TITLE,
  type QuickAction,
} from "~/lib/types/quickAction";
import { cn } from "~/lib/utils";

import Button from "~/components/Button";
import { useModal } from "~/components/modal/provider";

type ActionItem = {
  icon: string;
  title?: string;
  description?: string;
  indent?: boolean;
};

const actionItems: ActionItem[] = [
  {
    icon: "👏",
    title: "Claps:",
    description:
      "Attendees were able to clap as many times as they liked! The more, the merrier!",
  },
  {
    icon: "📬",
    title: "Email me:",
    description: "Send them an email with more info!",
  },
  {
    icon: QUICK_ACTIONS_ICON,
    title: `The attendee answered "${QUICK_ACTIONS_TITLE}"`,
  },
];

export default function InfoModal({
  quickActions,
}: {
  quickActions: QuickAction[];
}) {
  const modal = useModal();

  const allActionItems: ActionItem[] = [
    ...actionItems,
    ...quickActions.map((action) => ({
      icon: action.icon,
      description: action.description,
      indent: true,
    })),
  ];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        modal?.hide();
      }}
      className="flex w-full flex-col items-center gap-8 font-medium"
    >
      <div>
        <h1 className="line-clamp-1 text-center font-kallisto text-4xl font-bold tracking-tight">
          Time to Connect!
        </h1>
        <p className="text-md max-w-[330px] pt-2 text-center font-medium leading-5 text-gray-500">
          Now&apos;s your chance to engage with the attendees! See more info
          about the type of feedback attendees left and how to best connect with
          them!
        </p>
      </div>
      <ul className="text-md flex w-full flex-col gap-2 font-semibold leading-6 text-gray-700">
        {allActionItems.map((item) => (
          <li
            key={item.icon}
            className={cn("flex items-center gap-3", item.indent && "pl-6")}
          >
            <span className="text-4xl">{item.icon}</span>
            <p>
              <span className="font-bold text-black">{item.title} </span>
              {item.description}
            </p>
          </li>
        ))}
      </ul>
      <Button pending={false}>Got it!</Button>
    </form>
  );
}
