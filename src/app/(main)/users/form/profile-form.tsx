"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "react-toastify";

type Gender = {
  value: string;
  label: string;
};
type BloodGrp = {
  value: string;
  label: string;
};
const genders: Gender[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const bloodgrps: BloodGrp[] = [
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
];

const items = [
  { id: "General", label: "General" },
  { id: "Special", label: "Special" },
] as const;

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const fileSchema = z
  .instanceof(File)
  .refine(
    (file) => ALLOWED_FILE_TYPES.includes(file.type),
    "Only JPEG, PNG, and WebP files are allowed."
  );

const userschema = z.object({
  rollingno: z
    .string()
    .min(5, { message: "Enter at least 5 characters" })
    .max(15, { message: "Maximum 15 characters" }),
  FullName: z
    .string()
    .min(2, { message: "Full Name must be at least 2 characters" })
    .max(30, { message: "Full Name must not be longer than 30 characters" }),
  Mobno: z
    .number()
    .max(10000000000, { message: "Enter valid 10 digit number" }),
  EMobno: z
    .number()
    .max(10000000000, { message: "Enter valid 10 digit number" }),
  Address: z
    .string()
    .min(10, { message: "Enter at least 10 characters" })
    .max(50, { message: "Maximum 50 characters" }),
  BloodGrp: z.string({ required_error: "Please select your Blood Group" }),
  Gender: z.string({ required_error: "Please select your Gender" }),
  Age: z
    .number()
    .min(18, { message: "Age must be at least 18" })
    .max(100, { message: "Maximum 100" }),
  disease: z.string().min(5, { message: "Enter valid disease" }),
  Aadhaar: z
    .number()
    .max(1000000000000, { message: "Enter valid Aadhaar number" }),
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  type: z.enum(["Reader", "Reader and Volunteer", "Volunteer"], {
    required_error: "You need to select a notification type.",
  }),
  profileImage: fileSchema.nullable(),
  aadhaarImage: fileSchema.nullable(),
});

type UserFormValues = Omit<z.infer<typeof userschema>, 'profileImage' | 'aadhaarImage'> & {
  profileImage: File | null;
  aadhaarImage: File | null;
};

export function Profileform() {
  const [profiles, setProfiles] = useState<UserFormValues[]>([]);
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userschema),
    mode: "onChange",
    defaultValues: {
      rollingno: "",
      FullName: "",
      Mobno: 0,
      EMobno: 0,
      Address: "",
      BloodGrp: "",
      Gender: "",
      Age: 0,
      disease: "",
      Aadhaar: 0,
      items: [],
      type: "Reader",
      profileImage: null,
      aadhaarImage: null,
    },
  });

  const uploadFile = async (file: File, folder: string) => {
    const { data, error } = await supabase.storage
      .from('images')
      .upload(`${folder}/${file.name}`, file);

    if (error) {
      console.error(`Error uploading file to ${folder}:`, error);
      return null;
    }

    const fileUrl = `https://your-supabase-url/storage/v1/object/public/images/${folder}/${file.name}`;
    return fileUrl;
  };

  const addUser  = async (data: UserFormValues) => {
    try {
      const profileImageUrl = data.profileImage ? await uploadFile(data.profileImage, 'profileimages') : null;
      const aadhaarImageUrl = data.aadhaarImage ? await uploadFile(data.aadhaarImage, 'aadhaarimages') : null;

      const userData: UserFormValues = {
        rollingno: data.rollingno,
        FullName: data.FullName,
        Mobno: data.Mobno,
        EMobno: data.EMobno,
        Address: data.Address,
        BloodGrp: data.BloodGrp,
        Gender: data.Gender,
        Age: data.Age,
        disease: data.disease,
        Aadhaar: data.Aadhaar,
        items: data.items,
        type: data.type,
        profileImage: data.profileImage,
        aadhaarImage: data.aadhaarImage,
      };

      const updatedData = [...profiles, userData];
      setProfiles(updatedData);

      const { error } = await supabase
        .from("users")
        .insert([userData]);

      if (error) {
        throw error;
      }

      alert("User  added successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add user!");
      setProfiles(profiles);
    }
  };

  const [opengender, setOpengender] = useState(false);
  const [openbloodgrp, setOpenbloodgrp] = useState(false);

  return (
    <Card className="mx-auto w-full">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(addUser )} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="rollingno"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rolling Number</FormLabel>
                    <FormControl>
                      <Input
                        maxLength={15}
                        placeholder="Enter Rolling Number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="FullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Full Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your Postal Address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Mobno"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        maxLength={10}
                        placeholder="Enter Mobile Number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="EMobno"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Mobile Number</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        maxLength={10}
                        placeholder="Enter Emergency Mobile Number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
                        placeholder="Enter Age"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Aadhaar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aadhaar Number</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        maxLength={12}
                        placeholder="Enter Aadhaar Number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <br />
                    <FormControl>
                      <Popover open={opengender} onOpenChange={setOpengender}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-[150px] justify-start"
                          >
                            {field.value ? (
                              <>{genders.find(gender => gender.value === field.value)?.label}</>
                            ) : (
                              <>+ Change Gender</>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[270px] p-0"
                          side="right"
                          align="start"
                        >
                          <Command>
                            <CommandInput placeholder="Change Gender..." />
                            <CommandList>
                              <CommandEmpty>No results found.</CommandEmpty>
                              <CommandGroup>
                                {genders.map((gender) => (
                                  <CommandItem
                                    key={gender.value}
                                    value={gender.value}
                                    onSelect={(value) => {
                                      field.onChange(value);
                                      setOpengender(false);
                                    }}
                                  >
                                    {gender.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="BloodGrp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Group</FormLabel>
                    <br />
                    <FormControl>
                      <Popover
                        open={openbloodgrp}
                        onOpenChange={setOpenbloodgrp}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-[170px] justify-start"
                          >
                            {field.value ? (
                              <>{bloodgrps.find(bloodgrp => bloodgrp.value === field.value)?.label}</>
                            ) : (
                              <> Change Blood Group</>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[270px] p-0"
                          side="right"
                          align="start"
                        >
                          <Command>
                            <CommandInput placeholder="Change Blood Group..." />
                            <CommandList>
                              <CommandEmpty>No results found.</CommandEmpty>
                              <CommandGroup>
                                {bloodgrps.map((bloodgrp) => (
                                  <CommandItem
                                    key={bloodgrp.value}
                                    value={bloodgrp.value}
                                    onSelect={(value) => {
                                      field.onChange(value);
                                      setOpenbloodgrp(false);
                                    }}
                                  >
                                    {bloodgrp.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="disease"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel >Disease</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the Disease" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="items"
                render={({ field }) => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">
                        Stay Arrangement
                      </FormLabel>
                    </div>
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-row items-start space-x-3"
                      >
                        <Checkbox
                          checked={field.value.includes(item.id)}
                          onCheckedChange={(checked) => {
                            const updatedValue = checked
                              ? [...field.value, item.id]
                              : field.value.filter(
                                  (value) => value !== item.id
                                );
                            field.onChange(updatedValue);
                          }}
                        />
                        <FormLabel className="text-sm font-normal">
                          {item.label}
                        </FormLabel>
                      </div>
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Reader" />
                          </FormControl>
                          <FormLabel className="font-normal">Reader</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Reader and Volunteer" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Reader and Volunteer
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Volunteer" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Volunteer
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="profileImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Profile Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files && files.length > 0) {
                            field.onChange(files[0]); // Set the first file
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aadhaarImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Aadhaar Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files && files.length > 0) {
                            field.onChange(files[0]); // Set the first file
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Add User</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}