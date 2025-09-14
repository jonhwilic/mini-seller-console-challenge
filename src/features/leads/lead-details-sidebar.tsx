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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { updateLead } from "@/services/leads/update-leads";
import { useErrorToast } from "@/hooks/error-toast";
import { leadsFormSchema } from "./shared/leads-form-schema";

interface Lead {
  id: number;
  name: string;
  company: string;
  email: string;
  source: string;
  score: number;
  status: string;
}

interface LeadDetailsSidebarProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onLeadUpdated: () => void;
}

const statusOptions = ["New", "Contacted", "Qualified", "Converted", "Lost"] as const;

export const LeadDetailsSidebar = ({
  lead,
  isOpen,
  onClose,
  onLeadUpdated,
}: LeadDetailsSidebarProps) => {
  const { showError } = useErrorToast();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof leadsFormSchema>>({
    resolver: zodResolver(leadsFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      company: "",
      email: "",
      source: "",
      score: 0,
      status: "New",
    },
  });

  React.useEffect(() => {
    if (lead) {
      form.reset({
        name: lead.name,
        company: lead.company,
        email: lead.email,
        source: lead.source,
        score: lead.score,
        status: lead.status,
      });
      setIsEditing(false);
    }
  }, [lead, form]);

  const handleSave = async (values: z.infer<typeof leadsFormSchema>) => {
    if (!lead) return;

    try {
      await updateLead({
        id: lead.id,
        ...values,
      });
      toast.success("Lead updated successfully!");
      setIsEditing(false);
      onLeadUpdated();
    } catch (error) {
      showError(error);
    }
  };

  const handleCancel = () => {
    if (lead) {
      form.reset({
        name: lead.name,
        company: lead.company,
        email: lead.email,
        source: lead.source,
        score: lead.score,
        status: lead.status,
      });
    }
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800";
      case "Contacted":
        return "bg-yellow-100 text-yellow-800";
      case "Qualified":
        return "bg-green-100 text-green-800";
      case "Converted":
        return "bg-purple-100 text-purple-800";
      case "Lost":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!lead) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[100vw] sm:w-[400px] md:w-[540px]">
        <SheetHeader>
          <SheetTitle>Detalhes do Lead</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Status</Label>
                {!isEditing && (
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                )}
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
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
                        {...field}
                        type="email"
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fonte</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Score</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        max="100"
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isEditing && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </form>
          </Form>
        </div>

        <SheetFooter className="flex flex-row gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="flex-1 text-black">
              Edit
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1 text-black"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={form.handleSubmit(handleSave)}
                className="flex-1 !bg-green-600 hover:!bg-green-700 !text-white"
              >
                Save
              </Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
