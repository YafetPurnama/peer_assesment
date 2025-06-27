import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "./ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Table from "./Table";

export default function Mahasiswa() {
  return (
    <>
      <PageMeta
        title="Mahasiswa"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Mahasiswa" />
      <div className="space-y-6">
        <ComponentCard title="Mahasiswa">
          <Table />
        </ComponentCard>
      </div>
    </>
  );
}
