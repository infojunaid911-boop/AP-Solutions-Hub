import PageHeader from "@/components/admin/PageHeader";
import ProjectForm from "@/components/admin/portfolio/ProjectForm";

export default function AddProjectPage() {
  return (
    <div>
      <PageHeader
        title="Add Project"
        description="Upload a new project to the public portfolio."
      />
      <div className="mt-8 max-w-3xl">
        <ProjectForm />
      </div>
    </div>
  );
}
