"use client";

import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, provideGlobalGridOptions } from 'ag-grid-community';
import { AllEnterpriseModule, LicenseManager } from 'ag-grid-enterprise';
import { Suspense } from "react";
LicenseManager.setLicenseKey('your License Key');

// Register all enterprise features
ModuleRegistry.registerModules([AllEnterpriseModule]);

// Mark all grids as using legacy themes
provideGlobalGridOptions({ theme: "legacy" });
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Trash2, Search, User, Phone, MapPin, GraduationCap, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import GlobalApis from "@/app/_services/GlobalApis";
import { toast } from "sonner";

const StudentListTable = ({ students = [], refreshData }) => {
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const deleteStudent = async (id, studentName) => {
    try {
      setLoading(true);
      await GlobalApis.DeleteStudent(id);
      toast.success("Student deleted successfully", {
        description: `${studentName} has been removed from the system`,
      });
      refreshData();
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("Failed to delete student", {
        description: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  }

  // Custom cell renderers
  const IdCellRenderer = (props) => {
    return (
      <div className="flex items-center h-full">
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-mono">
          #{String(props.value).padStart(3, '0')}
        </Badge>
      </div>
    );
  };

  const NameCellRenderer = (props) => {
    return (
      <div className="flex items-center gap-2 h-full">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {props.value?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <span className="font-medium text-gray-900">{props.value || 'Unknown'}</span>
      </div>
    );
  };

  const GradeCellRenderer = (props) => {
    const gradeColors = {
      '1': 'bg-green-100 text-green-800',
      '2': 'bg-blue-100 text-blue-800',
      '3': 'bg-purple-100 text-purple-800',
      '4': 'bg-orange-100 text-orange-800',
      '5': 'bg-red-100 text-red-800',
      '6': 'bg-pink-100 text-pink-800',
      '7': 'bg-indigo-100 text-indigo-800',
      '8': 'bg-yellow-100 text-yellow-800',
      '9': 'bg-gray-100 text-gray-800',
      '10': 'bg-emerald-100 text-emerald-800',
    };

    const colorClass = gradeColors[props.value] || 'bg-gray-100 text-gray-800';

    return (
      <div className="flex items-center h-full">
        <Badge className={`${colorClass} flex items-center gap-1`}>
          <GraduationCap className="h-3 w-3" />
          Grade {props.value}
        </Badge>
      </div>
    );
  };

  const ContactCellRenderer = (props) => {
    return (
      <div className="flex items-center gap-2 h-full text-gray-600">
        {props.value ? (
          <>
            <Phone className="h-4 w-4 text-gray-400" />
            <span className="font-mono">{props.value}</span>
          </>
        ) : (
          <span className="text-gray-400 italic">No contact</span>
        )}
      </div>
    );
  };

  const AddressCellRenderer = (props) => {
    return (
      <div className="flex items-center gap-2 h-full text-gray-600">
        {props.value ? (
          <>
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="truncate max-w-xs" title={props.value}>{props.value}</span>
          </>
        ) : (
          <span className="text-gray-400 italic">No address</span>
        )}
      </div>
    );
  };

  const ActionCellRenderer = (props) => {
    return (
      <div className="flex items-center h-full">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              disabled={loading} 
              variant="destructive" 
              size="sm"
              className="bg-red-500 hover:bg-red-600 transition-colors shadow-sm"
            >
              <Trash2 className="mr-1 h-3 w-3" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="sm:max-w-[425px]">
            <AlertDialogHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <AlertDialogTitle className="text-lg">Delete Student</AlertDialogTitle>
                </div>
              </div>
              <AlertDialogDescription className="mt-4 text-gray-600">
                Are you sure you want to delete <strong>{props.data.name}</strong>? 
                This action cannot be undone and will permanently remove the student from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6">
              <AlertDialogCancel className="border-2">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => deleteStudent(props.data.id, props.data.name)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Student
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  };

  const [rowData, setRowData] = useState([]);
  const [colDefs] = useState([
    { 
      field: "id", 
      headerName: "ID", 
      width: 100,
      sortable: true, 
      filter: true,
      cellRenderer: IdCellRenderer,
      headerClass: 'ag-header-cell-text-center'
    },
    { 
      field: "name", 
      headerName: "Student Name", 
      width: 200,
      sortable: true, 
      filter: true,
      cellRenderer: NameCellRenderer,
      flex: 1
    },
    { 
      field: "grade", 
      headerName: "Grade", 
      width: 120,
      sortable: true, 
      filter: true,
      cellRenderer: GradeCellRenderer
    },
    { 
      field: "contact", 
      headerName: "Contact", 
      width: 150,
      sortable: true, 
      filter: true,
      cellRenderer: ContactCellRenderer
    },
    { 
      field: "address", 
      headerName: "Address", 
      width: 200,
      sortable: true, 
      filter: true,
      cellRenderer: AddressCellRenderer,
      flex: 1
    },
    {
      field: "action",
      headerName: "Actions",
      width: 120,
      cellRenderer: ActionCellRenderer,
      sortable: false,
      filter: false,
      pinned: 'right'
    }
  ]);

  // Update row data when students prop changes
  useEffect(() => {
    if (students && Array.isArray(students)) {
      setRowData(students);
    }
  }, [students]);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input 
          onChange={(e) => setSearchInput(e.target.value)} 
          type="text" 
          placeholder="Search students by name, grade, contact..." 
          className="pl-10 border-2 focus:border-blue-500 transition-colors bg-white shadow-sm"
          value={searchInput}
        />
      </div>

      {/* Table */}
      <div className="ag-theme-alpine border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading students...</span>
          </div>
        }>
          {students.length === 0 && (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-400">No students found.</p>
              </div>
            </div>
          )}
          {students.length > 0 && (
            <div className="w-full" style={{ minHeight: 400 }}>
              <AgGridReact
                rowData={rowData.filter(
                  (row) =>
                    row.name?.toLowerCase().includes(searchInput.toLowerCase()) ||
                    row.grade?.toString().includes(searchInput) ||
                    row.contact?.toLowerCase().includes(searchInput.toLowerCase()) ||
                    row.address?.toLowerCase().includes(searchInput.toLowerCase())
                )}
                columnDefs={colDefs}
                domLayout="autoHeight"
                suppressRowClickSelection={true}
                rowSelection="single"
                animateRows={true}
                pagination={true}
                paginationPageSize={10}
                overlayNoRowsTemplate={
                  '<span class="text-gray-400">No students match your search.</span>'
                }
              />
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default StudentListTable;