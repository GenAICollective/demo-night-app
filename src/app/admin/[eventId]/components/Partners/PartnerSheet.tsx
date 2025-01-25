"use client";

import { useDashboardContext } from "../../contexts/DashboardContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { type Partner, partnerSchema } from "~/lib/types/partner";
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

type FormValues = Partner;

const partnersSchema = z.array(partnerSchema);

export default function PartnerSheet({
  partner,
  eventId,
  onSubmit,
  open,
  onOpenChange,
}: {
  partner?: Partner;
  eventId: string;
  onSubmit: (partner: Partner) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { event } = useDashboardContext();
  const upsertMutation = api.event.upsert.useMutation();
  const form = useForm<FormValues>({
    resolver: zodResolver(partnerSchema),
    defaultValues: partner ?? {
      name: "",
      description: "",
      email: "",
      url: "",
    },
  });

  const onFormSubmit = async (data: FormValues) => {
    if (!event) return;
    const partners = partnersSchema.parse(event.partners);
    try {
      await upsertMutation.mutateAsync({
        originalId: eventId,
        partners: partner
          ? // Update existing partner
            partners.map((p) => (p.name === partner.name ? data : p))
          : // Add new partner
            [...partners, data],
      });
      onOpenChange(false);
      toast.success(`Successfully ${partner ? "updated" : "created"} partner!`);
      onSubmit(data);
    } catch (error) {
      toast.error(
        `Failed to ${partner ? "update" : "create"} partner: ${
          (error as Error).message
        }`,
      );
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>{partner ? "Edit" : "Add"} Partner</SheetTitle>
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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
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
              {partner ? "Update" : "Add"} Partner
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
