import { cn } from "~/lib/utils";

import SubmitButton from "~/components/SubmitButton";
import { useModal } from "~/components/modal/provider";

export default function InfoModal() {
  const modal = useModal();

  const actionItems = [
    {
      icon: "⭐️",
      title: "Super star:",
      description:
        "Show special interest by giving it a super star! Beware: you can only star one demo!",
    },
    {
      icon: "👏",
      title: "Clap:",
      description: "Clap as many times as your heart desires!",
    },
    {
      icon: "🤝",
      title: "I want to...",
      description: "",
    },
    {
      icon: "📬",
      title: "Learn more:",
      description: "Email me with more info!",
      indent: true,
    },
    {
      icon: "💰",
      title: "Invest:",
      description: "Show your interest in investing!",
      indent: true,
    },
    {
      icon: "🧑‍💻",
      title: "Work:",
      description: "Show your interest in working for them!",
      indent: true,
    },
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
          About Actions
        </h1>
        <p className="text-md max-w-[330px] pt-2 text-center font-medium leading-5 text-gray-500">
          Now&apos;s your chance to show some love to the demoists! Here are the
          actions you can take to show your appreciation and follow up:
        </p>
      </div>
      <ul className="text-md flex w-full flex-col gap-2 font-semibold leading-6 text-gray-700">
        {actionItems.map((item) => (
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
      <SubmitButton title="Got it!" pending={false} />
    </form>
  );
}
