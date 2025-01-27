"use client";

import { useDashboardContext } from "../../contexts/DashboardContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { eventConfigSchema } from "~/lib/types/eventConfig";
import { type QuickAction, quickActionSchema } from "~/lib/types/quickAction";
import { api } from "~/trpc/react";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";

export default function QuickActionSheet({
  quickAction,
  eventId,
  onSubmit,
  open,
  onOpenChange,
}: {
  quickAction?: QuickAction;
  eventId: string;
  onSubmit: (quickAction: QuickAction) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { event } = useDashboardContext();
  const upsertMutation = api.event.upsert.useMutation();
  const form = useForm<QuickAction>({
    resolver: zodResolver(quickActionSchema),
    defaultValues: quickAction ?? {
      id: "",
      icon: "",
      description: "",
    },
  });

  const onFormSubmit = async (data: QuickAction) => {
    if (!event) return;
    const config = eventConfigSchema.parse(event.config);
    try {
      await upsertMutation.mutateAsync({
        originalId: eventId,
        config: {
          ...config,
          quickActions: quickAction
            ? // Update existing quick action
              config.quickActions.map((q) =>
                q.id === quickAction.id ? data : q,
              )
            : // Add new quick action
              [...config.quickActions, data],
        },
      });
      onOpenChange(false);
      toast.success(
        `Successfully ${quickAction ? "updated" : "created"} quick action!`,
      );
      onSubmit(data);
    } catch (error) {
      toast.error(
        `Failed to ${quickAction ? "update" : "create"} quick action: ${
          (error as Error).message
        }`,
      );
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>{quickAction ? "Edit" : "Add"} Quick Action</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="flex flex-col gap-4 pt-4"
          >
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon / Emoji</FormLabel>
                  <FormControl>
                    <Input placeholder="🧑‍💻" autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Test the product!"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key / ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="testProduct"
                      autoComplete="off"
                      autoFocus
                      {...field}
                      className="font-mono"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={upsertMutation.isPending}>
              {quickAction ? "Update" : "Add"} Quick Action
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
