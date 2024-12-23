"use client"
import { useForm } from "react-hook-form";
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,

} from "@/components/ui/dialog"
import React, { useEffect,useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import GlobalApis from "@/app/_services/GlobalApis";
import { toast } from "sonner";
const AddNewStudent = ({refreshData}) => {
  const { register, handleSubmit, setValue,reset, formState: { errors } } = useForm();
  const [open, setOpen] = useState(false)
const [grades,setGrades] = useState([])
const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    setLoading(true);
    try {
      
      await GlobalApis.createNewStudent(data);
      
      reset();
      await refreshData();
      toast.success("Student created successfully");

       // Call createNewStudent with form data
      console.log("Student created successfully");
    } catch (error) {
      console.error("Error creating student:", error);
      toast.error("Failed to create student");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  useEffect(() => {
    async function getAllGradesList() {
      try {
        const data = await GlobalApis.GetAllGrades();
        
        console.log("data", data);
        setGrades(data)
   
      } catch (error) {
        console.error("Error fetching grades:", error);
      }
    }
    getAllGradesList();
  }, []);

  
  

  

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Add new Student</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription className='space-y-2'>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <Label>Grade</Label>
                  <select {...register("grade", { required: true })} >
                    <option value="">Select Grade</option>
                    {grades.map((grade) => (
                      <option key={grade.id} value={grade.grade}>
                        {grade.grade}
                      </option>
                    ))}
                  </select>
                  {errors.grade && <span>This field is required</span>}
                </div>
                <div>
                  <Label>Full Name</Label>
                  <Input  {...register("name", { required: true, maxLength: 20 })} placeholder='archit' />
                  {errors.name && <span>This field is required</span>}
                </div>
                <div>
                  <Label >Contact No</Label>
                  <Input type="number" {...register("contact")} placeholder='1234567890' />
                  {errors.contact && <span>This field is required</span>}
                </div>
                <div>
                  <Label>Address</Label>
                  <Input {...register("address", {  maxLength: 50 })}   placeholder='xyz' />
                </div>
                
                <div className="flex gap-2 justify-end mt-4">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save"}
                  </Button>
                </div>
                {loading && <div className="text-center mt-2">Loading...</div>}
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddNewStudent