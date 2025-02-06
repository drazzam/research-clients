import React, { useState } from 'react';
import { format } from 'date-fns';
import { ArrowUpDown, Calendar, User, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

type Project = {
  id: string;
  name: string;
  deadline: Date;
  client: string;
  description: string;
};

const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'E-commerce Platform',
      deadline: new Date('2024-05-15'),
      client: 'TechCorp Inc.',
      description: 'Building a modern e-commerce platform with React and Node.js'
    },
    {
      id: '2',
      name: 'Analytics Dashboard',
      deadline: new Date('2024-04-30'),
      client: 'DataViz Solutions',
      description: 'Real-time analytics dashboard for business metrics'
    },
    {
      id: '3',
      name: 'Mobile App',
      deadline: new Date('2024-06-01'),
      client: 'StartupX',
      description: 'Cross-platform mobile application for task management'
    }
  ]);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Project;
    direction: 'asc' | 'desc';
  } | null>(null);

  const sortProjects = (key: keyof Project) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedProjects = [...projects].sort((a, b) => {
      if (key === 'deadline') {
        return direction === 'asc' 
          ? a[key].getTime() - b[key].getTime()
          : b[key].getTime() - a[key].getTime();
      }
      
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setProjects(sortedProjects);
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

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Projects</h1>
      <div className="bg-card rounded-lg shadow-sm border">
        <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b">
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
        </div>
        <div className="divide-y">
          {projects.map((project) => (
            <div key={project.id} className="grid grid-cols-5 gap-4 p-4 project-row">
              <div className="font-medium text-primary">{project.name}</div>
              <div>{format(project.deadline, 'MMM dd, yyyy')}</div>
              <div>{project.client}</div>
              <div className="col-span-2 text-muted-foreground">{project.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectList;