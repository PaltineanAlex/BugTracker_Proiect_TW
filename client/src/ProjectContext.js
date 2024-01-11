import { createContext, useContext, useState } from 'react';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [bugs, setBugs] = useState([]);

  const setProjectAndBugs = (project, bugs) => {
    //setSelectedProject(project);
    setSelectedProject((prevProject) => {
      // Actualizare doar dacă proiectul selectat este diferit de noul proiect
      return prevProject && prevProject.id === project.id ? prevProject : project;
    });
    setBugs(bugs);
  };

  return (
    <ProjectContext.Provider value={{ selectedProject, bugs, setProjectAndBugs }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
    const context = useContext(ProjectContext);
    if (!context) {
      throw new Error('useProjectContext must be used within a ProjectProvider');
    }
    return context;
  };