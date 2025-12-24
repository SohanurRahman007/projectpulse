"use client";

export default function EmployeeDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Employee Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600">As an employee, you can:</p>
        <ul className="list-disc pl-5 mt-4 space-y-2">
          <li>View assigned projects</li>
          <li>Submit weekly progress updates</li>
          <li>Report risks and blockers</li>
          <li>Track project timelines</li>
        </ul>
      </div>
    </div>
  );
}
