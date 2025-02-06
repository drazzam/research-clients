
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ArrowUpDown, Calendar, User, FileText, Paperclip, Download, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProjectForm from './ProjectForm';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner';

type Project = {
  id: string;
  name: string;
  deadline: Date;
  client: string;
  description: string;
  isCompleted: boolean;
  notes?: string;
  files: File[];
};

const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'E-commerce Platform',
      deadline: new Date('2024-05-15'),
      client: 'TechCorp Inc.',
      description: 'Building a modern e-commerce platform with React and Node.js',
      isCompleted: false,
      notes: 'Initial planning phase completed. Waiting for design approval.',
      files: []
    },
    {
      id: '2',
      name: 'Analytics Dashboard',
      deadline: new Date('2024-04-30'),
      client: 'DataViz Solutions',
      description: 'Real-time analytics dashboard for business metrics',
      isCompleted: false,
      notes: 'API integration in progress',
      files: []
    },
    {
      id: '3',
      name: 'Mobile App',
      deadline: new Date('2024-06-01'),
      client: 'StartupX',
      description: 'Cross-platform mobile application for task management',
      isCompleted: false,
      notes: 'UI/UX design phase',
      files: []
    }
  ]);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Project;
    direction: 'asc' | 'desc';
  } | null>(null);

  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Sort projects by deadline by default
  const sortedProjects = [...projects].sort((a, b) => a.deadline.getTime() - b.deadline.getTime());
  
  const ongoingProjects = sortedProjects.filter(project => !project.isCompleted);
  const completedProjects = sortedProjects.filter(project => project.isCompleted);

  const sortProjects = (key: keyof Project) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sorted = [...projects].sort((a, b) => {
      if (key === 'deadline') {
        return direction === 'asc' 
          ? a[key].getTime() - b[key].getTime()
          : b[key].getTime() - a[key].getTime();
      }
      
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setProjects(sorted);
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Project) => {
    if (sortConfig?.key === key) {
      return <ArrowUpDown className={cn(
        "h-4 w-4",
        sortConfig.direction === 'desc' ? "transform rotate-180" : ""
      )} />;
    }
    return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
  };

  const handleAddProject = (formData: any) => {
    const fileArray = Array.from(formData.files || []).map((file: any) => {
      return new File([file], file.name, {
        type: file.type,
        lastModified: file.lastModified,
      });
    });

    const newProject: Project = {
      id: editingProject ? editingProject.id : (projects.length + 1).toString(),
      name: formData.name,
      deadline: new Date(formData.deadline),
      client: formData.client,
      description: formData.description,
      isCompleted: editingProject ? editingProject.isCompleted : false,
      notes: formData.notes,
      files: fileArray
    };
    
    if (editingProject) {
      setProjects(projects.map(p => p.id === editingProject.id ? newProject : p));
      setEditingProject(null);
      toast.success(`Project "${formData.name}" updated successfully!`);
    } else {
      setProjects([...projects, newProject]);
      toast.success(`Project "${formData.name}" added successfully!`);
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
  };

  const toggleProjectStatus = (projectId: string) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        const newStatus = !project.isCompleted;
        const projectName = project.name;
        toast.success(
          newStatus 
            ? `Project "${projectName}" marked as complete`
            : `Project "${projectName}" moved back to ongoing projects`
        );
        return { ...project, isCompleted: newStatus };
      }
      return project;
    }));
  };

  const exportProjects = (projectType: 'ongoing' | 'completed') => {
    const projectsToExport = projectType === 'ongoing' ? ongoingProjects : completedProjects;
    const exportData = projectsToExport.map(project => ({
      name: project.name,
      deadline: format(project.deadline, 'MMM dd, yyyy'),
      client: project.client,
      description: project.description,
      notes: project.notes || 'No notes',
      attachments: project.files.length,
      status: project.isCompleted ? 'Completed' : 'Ongoing'
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectType}-projects-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`${projectType === 'ongoing' ? 'Ongoing' : 'Completed'} projects exported successfully!`);
  };

  const ProjectTable = ({ projects, heading }: { projects: Project[], heading: string }) => (
    <div className="bg-card rounded-lg shadow-sm border overflow-x-auto mt-8">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">{heading}</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => exportProjects(heading.toLowerCase().includes('ongoing') ? 'ongoing' : 'completed')}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export {heading}
        </Button>
      </div>
      <div className="min-w-[800px]">
        <div className="grid grid-cols-7 gap-4 p-4 font-medium border-b">
          <button onClick={() => sortProjects('name')} className="sort-button">
            Project Name {getSortIcon('name')}
          </button>
          <button onClick={() => sortProjects('deadline')} className="sort-button">
            <Calendar className="h-4 w-4" />
            Deadline {getSortIcon('deadline')}
          </button>
          <button onClick={() => sortProjects('client')} className="sort-button">
            <User className="h-4 w-4" />
            Client {getSortIcon('client')}
          </button>
          <div className="col-span-2 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Description & Notes
          </div>
          <div className="flex items-center justify-center">
            Attachments
          </div>
          <div className="flex items-center justify-center">
            Actions
          </div>
        </div>
        <div className="divide-y">
          {projects.map((project) => (
            <div key={project.id} className="grid grid-cols-7 gap-4 p-4 project-row hover:bg-muted/50 transition-colors">
              <div className="font-medium text-primary">{project.name}</div>
              <div>{format(project.deadline, 'MMM dd, yyyy')}</div>
              <div>{project.client}</div>
              <div className="col-span-2">
                <p className="text-muted-foreground">{project.description}</p>
                {project.notes && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    <span className="font-medium">Notes:</span> {project.notes}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-center">
                {project.files && project.files.length > 0 ? (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Paperclip className="h-3 w-3" />
                    {project.files.length}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">No files</span>
                )}
              </div>
              <div className="flex items-center justify-center gap-2">
                <Dialog open={editingProject?.id === project.id} onOpenChange={(open) => !open && setEditingProject(null)}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditProject(project)}
                      className="flex items-center gap-2"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Project</DialogTitle>
                    </DialogHeader>
                    <ProjectForm onSubmit={handleAddProject} initialData={editingProject} />
                  </DialogContent>
                </Dialog>
                <Switch
                  checked={project.isCompleted}
                  onCheckedChange={() => toggleProjectStatus(project.id)}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Projects</h1>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-8">Add New Project</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
          </DialogHeader>
          <ProjectForm onSubmit={handleAddProject} />
        </DialogContent>
      </Dialog>

      <ProjectTable projects={ongoingProjects} heading="Ongoing Projects" />
      <ProjectTable projects={completedProjects} heading="Completed Projects" />
    </div>
  );
};

export default ProjectList;
