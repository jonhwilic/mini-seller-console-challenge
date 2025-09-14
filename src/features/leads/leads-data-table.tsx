"use client"
import useDataTable from "@/hooks/data-table";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";
import {
  type ColumnProps,
} from "@/components/data-table/data-table-column-visibility";
import { type SortingProps } from "@/components/data-table/data-table-head";

import { findLeads } from "@/services/leads/find-leads";
import { deleteLead } from "@/services/leads/delete-leads";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertDialogDelete } from "@/components/alert-dialog-delete";
import { Input } from "@/components/ui/input";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import DataTableHeader from "@/components/data-table/data-table-header";
import { SkeletonTableRows } from "@/components/data-table/skeleton-table-rows";
import { ConditionalTableCell } from "@/components/data-table/conditional-table-cell";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeadsFieldsCreate } from "./shared/leads-fields-create";
import { FormProvider, useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadsEditFormSchema, leadsFormSchema } from "./shared/leads-form-schema";
import { z } from "zod";
import { createLead } from "@/services/leads/create-leads";
import { LeadsFieldsEdit } from "./shared/leads-fields-edit";
import { updateLead } from "@/services/leads/update-leads";
import { useErrorToast } from "@/hooks/error-toast";
import { LeadDetailsSidebar } from "./lead-details-sidebar";
import { ConvertLeadSidebar } from "../opportunities/convert-lead-sidebar";
import Pagination from "@/components/pagination";

interface Lead {
  id: number;
  name: string;
  company: string;
  email: string;
  source: string;
  score: number;
  status: string;
}

export const LeadsDataTable: React.FC = () => {
  const { showError } = useErrorToast();
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState("");
  const [search] = useDebounce(searchValue, 500);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [leadToConvert, setLeadToConvert] = useState<Lead | null>(null);
  const [isConvertSidebarOpen, setIsConvertSidebarOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(100);
  const [formAction, setFormAction] = useState<"create" | "edit" | undefined>();
  const [editing, setEditing] = useState<{ id: number; field: "email" | "status" } | null>(null);
  const [inlineValue, setInlineValue] = useState<string>("");
  const statusOptions = ["New", "Contacted", "Qualified", "Converted", "Lost"] as const;

  const initialColumns: ColumnProps[] = [
    { id: "id", label: "ID", visible: true, sorting: true },
    { id: "name", label: "Name", visible: true, sorting: true },
    { id: "company", label: "Company", visible: true, sorting: true },
    { id: "email", label: "Email", visible: true, sorting: true },
    { id: "source", label: "Source", visible: true, sorting: true },
    { id: "score", label: "Score", visible: true, sorting: true },
    { id: "status", label: "Status", visible: true, sorting: true },
    { id: "actions", label: "Actions", visible: true, sorting: false, className: "w-10", },
  ];

  const initialSorting: SortingProps = {
    property: "score",
    direction: "DESC",
  };

  const {
    sorting,
    setSorting,
    columns,
  } = useDataTable(initialColumns, initialSorting);

  const formCreate = useForm<z.infer<typeof leadsFormSchema>>({
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

  const formEdit = useForm<z.infer<typeof leadsEditFormSchema>>({
    resolver: zodResolver(leadsEditFormSchema),
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

  const form = formAction === "edit" ? formEdit : formCreate;

  const {
    data: leads,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["leads", (search || "").trim(), statusFilter],
    queryFn: () => findLeads((search || "").trim()),
  });

  const [localLeads, setLocalLeads] = useState<Lead[]>([]);

  useEffect(() => {
    setLocalLeads(Array.isArray(leads) ? leads : []);
  }, [leads]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const { paginatedLeads, paginationMeta } = useMemo(() => {
    const term = (search || "").trim().toLowerCase();
    let filtered = localLeads;

    if (term) {
      filtered = (localLeads || []).filter((l: { name: string; company: string; }) =>
        (l.name || "").toLowerCase().includes(term) ||
        (l.company || "").toLowerCase().includes(term)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((l: { status: string; }) => l.status === statusFilter);
    }

    const sortedLeads = filtered.sort((a, b) => {
      const aValue = a[sorting.property as keyof Lead];
      const bValue = b[sorting.property as keyof Lead];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sorting.direction === "ASC" ? -1 : 1;
      if (bValue == null) return sorting.direction === "ASC" ? 1 : -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sorting.direction === "ASC"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sorting.direction === "ASC"
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });

    const totalItems = sortedLeads.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = sortedLeads.slice(startIndex, endIndex);

    const meta = {
      totalItems,
      itemsPerPage,
      totalPages,
      currentPage,
    };

    return {
      paginatedLeads: paginated,
      paginationMeta: meta,
    };
  }, [localLeads, search, statusFilter, currentPage, itemsPerPage, sorting]);

  const handleCreateOnSubmit = async (values: z.infer<typeof leadsFormSchema>) => {
    try {
      await createLead(values);
      toast.success("Lead created successfully.");
      refetch();
      setFormAction(undefined);
      resetFormState();
    } catch (error) {
      showError(error);
    }
  };

  const handleEditOnSubmit = async (values: z.infer<typeof leadsFormSchema>) => {
    try {
      await updateLead({
        id: Number(selectedId),
        ...values
      });
      toast.success("Lead updated successfully.");
      refetch();
      setFormAction(undefined);
      resetFormState();
    } catch (error) {
      showError(error);
    }
  };

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleRowClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
    setSelectedLead(null);
  };

  const handleLeadUpdated = () => {
    refetch();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1);
  };

  const handleConvertClick = (lead: Lead) => {
    setLeadToConvert(lead);
    setIsConvertSidebarOpen(true);
  };

  const handleConvertSidebarClose = () => {
    setIsConvertSidebarOpen(false);
    setLeadToConvert(null);
  };

  const handleOpportunityCreated = () => {
    refetch();
  };

  const startInlineEdit = (lead: Lead, field: "email" | "status") => {
    setEditing({ id: lead.id, field });
    setInlineValue(String(lead[field]));
    setFormAction(undefined);
  };

  const commitInlineEdit = async (nextValue?: string) => {
    if (!editing) return;
    try {
      const payload: { id: number; email?: string; status?: string } = { id: editing.id };
      const valueToSave = nextValue ?? inlineValue;
      payload[editing.field] = valueToSave;

      const updated = await updateLead(payload);
      setLocalLeads((prev) => prev.map((lead) => (String(lead.id) === String(editing.id) ? { ...lead, ...updated } : lead)));
      setEditing(null);
      setInlineValue("");
      toast.success("Lead updated successfully.");
    } catch (error) {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      setEditing(null);
      showError(error);
    }
  };

  const handleCreateClick = () => {
    formCreate.reset({
      name: "",
      company: "",
      email: "",
      source: "",
      score: 0,
      status: "New",
    });
    setFormAction("create")
  };


  const handleConfirmDelete = () => {
    if (selectedId !== null) {
      deleteLead(selectedId).then(() => {
        toast.success("Lead deleted successfully.");
        refetch();
      });
      setOpen(false);
      setSelectedId(null);
    }
  };

  const resetFormState = () => {
    form.reset({
      name: "",
      company: "",
      email: "",
      source: "",
      score: 0,
      status: "New",
    });
    setFormAction(undefined);
    setSelectedId(null);
  };

  return (
    <div className="border">
      <AlertDialogDelete
        open={open}
        onOpenChange={setOpen}
        onConfirm={handleConfirmDelete}
      />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 bg-gray-50 dark:bg-transparent gap-2 sm:gap-0">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            name="search"
            placeholder="Filter leads..."
            className="h-8 w-full sm:w-[150px] lg:w-[250px]"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 w-full sm:w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 items-center">
          <Button
            type="button"
            size="sm"
            className="ml-auto hidden h-8 lg:flex"
            onClick={() => handleCreateClick()}
          ><Plus /></Button>
        </div>
      </div>
      <FormProvider {...form}>
        <Form {...form}>
          <form id="leads-form" onSubmit={form.handleSubmit((values) => {
            if (formAction === "create") return handleCreateOnSubmit(values);
            if (formAction === "edit") return handleEditOnSubmit(values);
          })}>
            <div className="overflow-x-auto">
              <Table className="border-0 border-t border-b min-w-[600px]">
                <DataTableHeader
                  columns={columns}
                  sorting={sorting}
                  onSortChange={setSorting}
                />
                <TableBody>
                  {formAction === "create" && (
                    <LeadsFieldsCreate onCancel={() => resetFormState()} />
                  )}
                  {isLoading ? (
                    <SkeletonTableRows columns={columns} rowCount={5} />
                  ) : (
                    paginatedLeads &&
                    paginatedLeads.map((lead: Lead) => {
                      if (formAction === "edit" && selectedId === lead.id) {
                        return (
                          <LeadsFieldsEdit
                            key={lead.id}
                            onCancel={() => resetFormState()}
                            form={form}
                            onSubmit={handleEditOnSubmit}
                          />
                        );
                      }

                      return (
                        <TableRow
                          key={lead.id}
                          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                          onClick={() => handleRowClick(lead)}
                        >
                          <ConditionalTableCell columns={columns} columnId="id">
                            {lead.id}
                          </ConditionalTableCell>
                          <ConditionalTableCell columns={columns} columnId="name">
                            {lead.name}
                          </ConditionalTableCell>
                          <ConditionalTableCell columns={columns} columnId="company">
                            {lead.company}
                          </ConditionalTableCell>
                          <ConditionalTableCell columns={columns} columnId="email">
                            {editing && editing.id === lead.id && editing.field === "email" ? (
                              <input
                                autoFocus
                                className="h-8 w-full rounded border px-2 text-sm"
                                value={inlineValue}
                                onChange={(e) => setInlineValue(e.target.value)}
                                onBlur={() => commitInlineEdit()}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") commitInlineEdit();
                                  if (e.key === "Escape") setEditing(null);
                                }}
                                type="email"
                                placeholder="email@example.com"
                              />
                            ) : (
                              <button
                                type="button"
                                className="text-left w-full"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startInlineEdit(lead, "email");
                                }}
                              >
                                {lead.email}
                              </button>
                            )}
                          </ConditionalTableCell>
                          <ConditionalTableCell columns={columns} columnId="source">
                            {lead.source}
                          </ConditionalTableCell>
                          <ConditionalTableCell columns={columns} columnId="score">
                            {lead.score}
                          </ConditionalTableCell>
                          <ConditionalTableCell columns={columns} columnId="status">
                            {editing && editing.id === lead.id && editing.field === "status" ? (
                              <Select
                                value={inlineValue}
                                onValueChange={(val) => {
                                  setInlineValue(val);
                                  commitInlineEdit(val);
                                }}
                              >
                                <SelectTrigger className="h-8 w-[140px] text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {statusOptions.map((s) => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Button
                                type="button"
                                className={`px-2 py-1 rounded-full text-xs ${lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                                  lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                                    lead.status === 'Qualified' ? 'bg-green-100 text-green-800' :
                                      lead.status === 'Converted' ? 'bg-purple-100 text-purple-800' :
                                        'bg-red-100 text-red-800'
                                  }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startInlineEdit(lead, "status");
                                }}
                              >
                                {lead.status}
                              </Button>
                            )}
                          </ConditionalTableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 sm:gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleConvertClick(lead);
                                }}
                                title="Convert to Opportunity"
                                className="h-8 w-8 p-0"
                              >
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(lead.id);
                                }}
                                title="Delete Lead"
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </form>
        </Form>
      </FormProvider>

      {!isLoading && paginatedLeads && paginatedLeads.length > 0 && (
        <Pagination
          meta={paginationMeta}
          onPageChange={handlePageChange}
          onLimitChange={handleItemsPerPageChange}
        />
      )}

      <LeadDetailsSidebar
        lead={selectedLead}
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        onLeadUpdated={handleLeadUpdated}
      />

      <ConvertLeadSidebar
        lead={leadToConvert}
        isOpen={isConvertSidebarOpen}
        onClose={handleConvertSidebarClose}
        onOpportunityCreated={handleOpportunityCreated}
      />
    </div>
  );
}

export default LeadsDataTable;
