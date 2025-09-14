import React from "react";
import { type UseFormReturn } from "react-hook-form";
import { z } from "zod";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, CircleX } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { leadsFormSchema } from "./leads-form-schema";

interface LeadsFieldsEditProps {
  onCancel: () => void;
  form: UseFormReturn<z.infer<typeof leadsFormSchema>>;
  onSubmit: (values: z.infer<typeof leadsFormSchema>) => void;
}

export const LeadsFieldsEdit: React.FC<LeadsFieldsEditProps> = ({ onCancel, form, onSubmit }) => {
  const isSubmitting = form.formState.isSubmitting;

  const handleSave = () => {
    form.handleSubmit((values) => {
      onSubmit(values);
    })();
  };

  return (
    <TableRow>
      <TableCell>
        <></>
      </TableCell>

      <TableCell>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>

      <TableCell>
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Company" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>

      <TableCell>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>

      <TableCell>
        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Source" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>

      <TableCell>
        <FormField
          control={form.control}
          name="score"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Score"
                  type="number"
                  min="0"
                  max="100"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>

      <TableCell>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Contacted">Contacted</SelectItem>
                  <SelectItem value="Qualified">Qualified</SelectItem>
                  <SelectItem value="Converted">Converted</SelectItem>
                  <SelectItem value="Lost">Lost</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>

      <TableCell className="text-right">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleSave}
            disabled={isSubmitting}
          >
            <Save />
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <CircleX />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
