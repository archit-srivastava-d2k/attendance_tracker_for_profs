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
import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import GlobalApis from "@/app/_services/GlobalApis";
import { toast } from "sonner";
import { UserPlus, User, Phone, MapPin, GraduationCap, Loader2 } from "lucide-react";

const AddNewStudent = ({ refreshData }) => {
  const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm();
  const [open, setOpen] = useState(false)
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState('');

  const watchedFields = watch();

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    setLoading(true);
    try {
      await GlobalApis.createNewStudent(data);
      reset();
      setSelectedGrade('');
      await refreshData();
      toast.success("Student created successfully!", {
        description: `${data.name} has been added to ${data.grade}`,
      });
    } catch (error) {
      console.error("Error creating student:", error);
      toast.error("Failed to create student", {
        description: "Please try again later",
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  useEffect(() => {
    async function getAllGradesList() {
      try {
        const data = await GlobalApis.GetAllGrades();
       
        setGrades(data)
      } catch (error) {
        console.error("Error fetching grades:", error);
      }
    }
    getAllGradesList();
  }, []);

  const handleGradeChange = (value) => {
    setSelectedGrade(value);
    setValue("grade", value);
  };

  return (
    <div>
      <Button 
        onClick={() => setOpen(true)} 
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Add New Student
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-0 shadow-2xl">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-lg">
                  <UserPlus className="h-6 w-6" />
                </div>
                Add New Student
              </DialogTitle>
              <DialogDescription className="text-blue-100 mt-2">
                Fill in the student information below to add them to the system
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Grade Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Grade Level
                </Label>
                <Select onValueChange={handleGradeChange} value={selectedGrade}>
                  <SelectTrigger className="w-full border-2 focus:border-blue-500 transition-colors">
                    <SelectValue placeholder="Select a grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade.id} value={grade.grade}>
                        Grade {grade.grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" {...register("grade", { required: "Grade is required" })} />
                {errors.grade && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.grade.message}
                  </p>
                )}
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                <Input 
                  {...register("name", { 
                    required: "Name is required",
                    maxLength: { value: 50, message: "Name must be less than 50 characters" },
                    pattern: {
                      value: /^[a-zA-Z\s]+$/,
                      message: "Name should only contain letters and spaces"
                    }
                  })} 
                  placeholder="Enter student's full name"
                  className="border-2 focus:border-blue-500 transition-colors"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Contact Number */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Contact Number
                </Label>
                <Input 
                  type="tel" 
                  {...register("contact", {
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Please enter a valid 10-digit phone number"
                    }
                  })} 
                  placeholder="1234567890"
                  className="border-2 focus:border-blue-500 transition-colors"
                />
                {errors.contact && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.contact.message}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>
                <Input 
                  {...register("address", {
                    maxLength: { value: 100, message: "Address must be less than 100 characters" }
                  })} 
                  placeholder="Enter student's address"
                  className="border-2 focus:border-blue-500 transition-colors"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* Preview Card */}
              {(watchedFields.name || watchedFields.grade) && (
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-700 mb-2">Preview:</h4>
                    <div className="space-y-1 text-sm">
                      {watchedFields.name && (
                        <p className="flex items-center gap-2">
                          <User className="h-3 w-3 text-blue-600" />
                          <span className="font-medium">{watchedFields.name}</span>
                        </p>
                      )}
                      {selectedGrade && (
                        <p className="flex items-center gap-2">
                          <GraduationCap className="h-3 w-3 text-blue-600" />
                          <span>Grade {selectedGrade}</span>
                        </p>
                      )}
                      {watchedFields.contact && (
                        <p className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-blue-600" />
                          <span>{watchedFields.contact}</span>
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpen(false)}
                  className="flex-1 border-2 hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Student
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddNewStudent