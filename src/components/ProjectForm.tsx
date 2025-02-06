import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plus, Save } from 'lucide-react';

type ProjectFormData = {
  name: string;
  deadline: string;
  client: string;
  description: string;
  notes: string;
  driveLink: string;
};

type ProjectFormProps = {
  onSubmit: (data: ProjectFormData) => void;
  initialData?: {
    name: string;
    deadline: Date;
    client: string;
    description: string;
    notes?: string;
    driveLink?: string;
  } | null;
};

const ProjectForm = ({ onSubmit, initialData }: ProjectFormProps) => {
  const form = useForm<ProjectFormData>({
    defaultValues: initialData ? {
      name: initialData.name,
      deadline: initialData.deadline.toISOString().split('T')[0],
      client: initialData.client,
      description: initialData.description,
      notes: initialData.notes || '',
      driveLink: initialData.driveLink || '',
    } : undefined
  });

  const handleSubmit = (data: ProjectFormData) => {
    onSubmit(data);
    if (!initialData) {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter project name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deadline</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="client"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter client name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter project description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add any additional notes or comments" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="driveLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Google Drive Folder Link</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter Google Drive folder URL" 
                  type="url"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full sm:w-auto">
          {initialData ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ProjectForm;