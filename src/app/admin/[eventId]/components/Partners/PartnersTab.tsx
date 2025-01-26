import { useDashboardContext } from "../../contexts/DashboardContext";
import CsvButton from "../CsvButton";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { type Partner, partnerSchema } from "~/lib/types/partner";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button, buttonVariants } from "~/components/ui/button";
import { SidebarTrigger } from "~/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

import PartnerSheet from "./PartnerSheet";

const partnersSchema = z.array(partnerSchema);

const PARTNER_CSV_HEADERS = ["name", "description", "url", "email"];

export function PartnersTab() {
  const { event, refetchEvent } = useDashboardContext();
  const [partnerSheetOpen, setPartnerSheetOpen] = useState(false);
  const upsertMutation = api.event.upsert.useMutation();

  if (!event) return null;

  const partners = partnersSchema.parse(event.partners);

  const onUploadPartners = (rows: Record<string, string>[]) => {
    const newPartners = rows.map((row) => {
      if (!row.name || !row.description || !row.url) {
        throw new Error("Name, description, and URL are required fields");
      }
      return {
        name: row.name,
        description: row.description,
        url: row.url,
        email: row.email ?? undefined,
      };
    });

    upsertMutation
      .mutateAsync({
        originalId: event.id,
        partners: newPartners,
      })
      .then(() => {
        toast.success("Partners updated!");
        refetchEvent();
      })
      .catch((e) => {
        toast.error("Failed to update partners: " + e.message);
      });
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-2">
      <div className="flex items-end justify-between">
        <div className="flex items-end justify-start gap-2">
          <SidebarTrigger className="p-5 md:hidden" />
          <h2 className="text-2xl font-semibold">Partners</h2>
        </div>
        <CsvButton
          data={partners}
          headers={PARTNER_CSV_HEADERS}
          filename="partners.csv"
          onUpload={onUploadPartners}
        />
      </div>
      <div className="overflow-x-auto rounded-md border">
        <PartnerSheet
          eventId={event.id}
          open={partnerSheetOpen}
          onOpenChange={setPartnerSheetOpen}
          onSubmit={(_: Partner) => {
            refetchEvent();
            setPartnerSheetOpen(false);
          }}
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead className="max-w-0">Name</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {partners.map((partner, index) => (
                <PartnerRow
                  key={partner.name}
                  partner={partner}
                  index={index}
                  eventId={event.id}
                  refetchEvent={refetchEvent}
                />
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end">
        <Button onClick={() => setPartnerSheetOpen(true)}>
          <Plus className="h-4 w-4" />
          Partner
        </Button>
      </div>
    </div>
  );
}

function PartnerRow({
  partner,
  index,
  eventId,
  refetchEvent,
}: {
  partner: Partner;
  index: number;
  eventId: string;
  refetchEvent: () => void;
}) {
  const { event } = useDashboardContext();
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const upsertMutation = api.event.upsert.useMutation();

  const handleDelete = async () => {
    if (!event) return;
    const partners = partnersSchema.parse(event.partners);
    try {
      await upsertMutation.mutateAsync({
        originalId: eventId,
        partners: partners.filter((p) => p.name !== partner.name),
      });
      setDeleteDialogOpen(false);
      toast.success("Partner successfully deleted");
      refetchEvent();
    } catch (error) {
      toast.error(`Failed to delete partner: ${(error as Error).message}`);
    }
  };

  return (
    <>
      <motion.tr
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={() => setEditSheetOpen(true)}
        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
      >
        <motion.td className="w-[50px] p-4 py-2 font-medium">
          {index + 1}
        </motion.td>
        <motion.td
          layout
          layoutId={`name-${partner.name}`}
          className="w-full p-4 py-2 font-semibold"
        >
          {partner.name}
        </motion.td>
        <motion.td
          layout
          layoutId={`actions-${partner.name}`}
          className="p-4 py-2"
        >
          <div className="flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditSheetOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit partner</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete partner</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </motion.td>
      </motion.tr>
      <PartnerSheet
        partner={partner}
        eventId={eventId}
        open={editSheetOpen}
        onOpenChange={setEditSheetOpen}
        onSubmit={(_) => {
          refetchEvent();
          setEditSheetOpen(false);
        }}
      />
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Partner</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this partner? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={cn(buttonVariants({ variant: "destructive" }))}
              onClick={handleDelete}
              disabled={upsertMutation.isPending}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
