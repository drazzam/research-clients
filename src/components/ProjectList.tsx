import React, { useState } from 'react';
import { format } from 'date-fns';
import { ArrowUpDown, Calendar, User, FileText, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProjectForm from './ProjectForm';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { toast } from './ui/use-toast';

type Project = {
  id: string;
  name: string;
  deadline: Date;
  client: string;
  description: string;
  isCompleted: boolean;
};

const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'E-commerce Platform',
      deadline: new Date('2024-05-15'),
      client: 'TechCorp Inc.',
      description: 'Building a modern e-commerce platform with React and Node.js',
      isCompleted: false
    },
    {
      id: '2',
      name: 'Analytics Dashboard',
      deadline: new Date('2024-04-30'),
      client: 'DataViz Solutions',
      description: 'Real-time analytics dashboard for business metrics',
      isCompleted: false
    },
    {
      id: '3',
      name: 'Mobile App',
      deadline: new Date('2024-06-01'),
      client: 'StartupX',
      description: 'Cross-platform mobile application for task management',
      isCompleted: false
    }
  ]);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Project;
    direction: 'asc' | 'desc';
  } | null>(null);

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
    const newProject = {
      id: (projects.length + 1).toString(),
      name: formData.name,
      deadline: new Date(formData.deadline),
      client: formData.client,
      description: formData.description,
      isCompleted: false
    };
    setProjects([...projects, newProject]);
    toast({
      title: "Project added",
      description: "New project has been successfully added.",
    });
  };

  const toggleProjectStatus = (projectId: string) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        const newStatus = !project.isCompleted;
        toast({
          title: newStatus ? "Project completed" : "Project reopened",
          description: `Project "${project.name}" has been ${newStatus ? 'marked as complete' : 'moved back to ongoing projects'}.`,
        });
        return { ...project, isCompleted: newStatus };
      }
      return project;
    }));
  };

  const ProjectTable = ({ projects, title }: { projects: Project[], title: string }) => (
    <div className="bg-card rounded-lg shadow-sm border overflow-x-auto mt-8">
      <h2 className="text-xl font-semibold p-4 border-b">{title}</h2>
      <div className="min-w-[800px]">
        <div className="grid grid-cols-6 gap-4 p-4 font-medium border-b">
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
            Description
          </div>
          <div className="flex items-center justify-center">
            Status
          </div>
        </div>
        <div className="divide-y">
          {projects.map((project) => (
            <div key={project.id} className="grid grid-cols-6 gap-4 p-4 project-row hover:bg-muted/50 transition-colors">
              <div className="font-medium text-primary">{project.name}</div>
              <div>{format(project.deadline, 'MMM dd, yyyy')}</div>
              <div>{project.client}</div>
              <div className="col-span-2 text-muted-foreground">{project.description}</div>
              <div className="flex items-center justify-center">
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
      
      <ProjectForm onSubmit={handleAddProject} />

      <ProjectTable projects={ongoingProjects} title="Ongoing Projects" />
      <ProjectTable projects={completedProjects} title="Completed Projects" />
    </div>
  );
};

export default ProjectList;