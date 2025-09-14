import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { z } from "zod";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createOpportunity } from "@/services/opportunities/create-opportunities";
import { updateLead } from "@/services/leads/update-leads";
import { useErrorToast } from "@/hooks/error-toast";
import { opportunitiesFormSchema } from "./shared/opportunities-form-schema";

interface Lead {
  id: number;
  name: string;
  company: string;
  email: string;
  source: string;
  score: number;
  status: string;
}

interface ConvertLeadSidebarProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onOpportunityCreated: () => void;
}

const stageOptions = [
  "Prospecting",
  "Qualification",
  "Proposal",
  "Negotiation",
  "Closed Won",
  "Closed Lost"
] as const;

export const ConvertLeadSidebar = ({
  lead,
  isOpen,
  onClose,
  onOpportunityCreated,
}: ConvertLeadSidebarProps) => {
  const { showError } = useErrorToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof opportunitiesFormSchema>>({
    resolver: zodResolver(opportunitiesFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      stage: "Prospecting",
      amount: undefined,
      accountName: "",
    },
  });

  React.useEffect(() => {
    if (lead) {
      form.reset({
        name: `${lead.name} - Opportunity`,
        stage: "Prospecting",
        amount: undefined,
        accountName: lead.company,
      });
    }
  }, [lead, form]);

  const handleConvert = async (values: z.infer<typeof opportunitiesFormSchema>) => {
    if (!lead) return;

    setIsSubmitting(true);
    try {
      await createOpportunity({
        name: values.name,
        stage: values.stage,
        amount: values.amount,
        accountName: values.accountName,
      });

      await updateLead({
        id: lead.id,
        status: "Converted"
      });

      toast.success("Lead converted to opportunity successfully!");
      onOpportunityCreated();
      onClose();
    } catch (error) {
      showError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (!lead) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[100vw] sm:w-[400px] md:w-[540px]">
        <SheetHeader>
          <SheetTitle>Convert Lead to Opportunity</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-2">
              Data
            </h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Name:</span> {lead.name}</p>
              <p><span className="font-medium">Company:</span> {lead.company}</p>
              <p><span className="font-medium">Email:</span> {lead.email}</p>
              <p><span className="font-medium">Source:</span> {lead.source}</p>
              <p><span className="font-medium">Score:</span> {lead.score}</p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleConvert)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accountName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Account Name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stage</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {stageOptions.map((stage) => (
                          <SelectItem key={stage} value={stage}>
                            {stage}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <SheetFooter className="flex flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="flex-1 text-black"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={form.handleSubmit(handleConvert)}
            className="flex-1 !bg-green-600 hover:!bg-green-700 !text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Converting..." : "Convert"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
