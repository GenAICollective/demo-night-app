"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type Demo } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { TAGLINE_MAX_LENGTH } from "~/lib/types/taglineMaxLength";
import { cn } from "~/lib/utils";
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
import { Textarea } from "~/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  id: z.string().optional(),
  description: z
    .string()
    .min(1, "Tagline is required")
    .max(
      TAGLINE_MAX_LENGTH,
      `Tagline must be less than ${TAGLINE_MAX_LENGTH} characters`,
    ),
  email: z.string().email("Invalid email address"),
  url: z.string().url("Invalid URL"),
});

type FormValues = z.infer<typeof formSchema>;

export default function DemoSheet({
  demo,
  eventId,
  onSubmit,
  open,
  onOpenChange,
}: {
  demo?: Demo;
  eventId: string;
  onSubmit: (demo: Demo) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const upsertMutation = api.demo.upsert.useMutation();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: demo ?? {
      name: "",
      description: "",
      email: "",
      url: "",
    },
  });

  const onFormSubmit = async (data: FormValues) => {
    try {
      const result = await upsertMutation.mutateAsync({
        originalId: demo?.id,
        id: data.id!,
        eventId: eventId,
        name: data.name,
        description: data.description,
        email: data.email,
        url: data.url,
      });
      onOpenChange(false);
      toast.success(`Successfully ${demo ? "updated" : "created"} demo!`);
      onSubmit(result);
    } catch (error) {
      toast.error(
        `Failed to ${demo ? "update" : "create"} demo: ${(error as Error).message}`,
      );
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>{demo ? "Edit" : "Add"} Demo</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="flex flex-col gap-4 pt-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Apple"
                      autoComplete="off"
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {demo && (
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Demo ID</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        className="font-mono"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between">
                    <FormLabel>Tagline</FormLabel>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        field.value?.length > TAGLINE_MAX_LENGTH
                          ? "text-destructive"
                          : "text-muted-foreground",
                      )}
                    >
                      {`(${field.value?.length ?? 0} / ${TAGLINE_MAX_LENGTH})`}
                    </span>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Think different. Inspiring creativity, connecting the world"
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="tim@apple.com"
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
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://apple.com"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={upsertMutation.isPending}>
              {demo ? "Update" : "Add"} Demo
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
