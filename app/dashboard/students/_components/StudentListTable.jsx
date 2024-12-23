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
provideGlobalGridOptions({ theme: "legacy"});
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const StudentListTable = ({ students = [] , refreshData}) => {
 

  const deleteStudent = async(id) => {
    try {
      await GlobalApis.DeleteStudent(id);
      toast.success("Student deleted successfully");
      refreshData();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
    }


  const customButton =(props)=>{
    return <AlertDialog>
    <AlertDialogTrigger>
      <Button variant="destructive">
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your account
          and remove your data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={() => deleteStudent(props.data.id)}>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  
  }
  const [rowData, setRowData] = useState([]);
  const [colDefs] = useState([
    { field: "id", headerName: "ID", sortable: true, filter: true },
    { field: "name", headerName: "Name", sortable: true, filter: true },
    { field: "contact", headerName: "Contact", sortable: true, filter: true },
    { field: "address", headerName: "Address", sortable: true, filter: true },
    {field:"action",headerName:"Action",cellRenderer:customButton}
  ]);

  const [input, setInput] = useState("");

  // Update row data when students prop changes
  useEffect(() => {
    if (students && Array.isArray(students)) {
      setRowData(students);
    }
  }, [students]);

  return (
    <div
      className="ag-theme-alpine"
      style={{ height: "500px", }}
    >
      <div>
        <Input onChange={(e) => setInput(e.target.value)} type="text" placeholder="Search"
         />


      </div>
      <Suspense fallback={<div>Loading...</div>}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        animateRows={true}
        pagination={true}
        paginationPageSize={10}
        quickFilterText={input}
      />
      </Suspense>
    </div>
  );
};

export default StudentListTable;
