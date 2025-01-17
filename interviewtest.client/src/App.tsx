import { useEffect, useState } from "react";
import "./Styling/Employees.css";

function App() {
  const [employeeCount, setEmployeeCount] = useState<number>(0);
  const [employees, setEmployees] = useState<Employee[]>();

  useEffect(() => {
    checkConnectivity();
  }, []);

  async function checkConnectivity() {
    const response = await fetch("api/employees");
    const data = await response.json();
    setEmployees(data);
    setEmployeeCount(data.length);
  }

  const updateEmployees = async () => {
    await fetch("api/employees/update-values", { method: "POST" });

    const response = await fetch("api/employees");
    const data = await response.json();
    setEmployees(data);
  };

  if (!employees || employees.length === 0) {
    return <div>No Employees Found.</div>;
  }
  return (
    <>
      <div>
        Connectivity check:{" "}
        {employeeCount > 0 ? `OK (${employeeCount})` : `NOT READY`}
      </div>

      <div>Complete your app here</div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr key={`${employee.name}-${employee.value}-${index}`}>
                <td>{employee.name}</td>
                <td>{employee.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={updateEmployees}>Increment</button>
    </>
  );
}

export default App;
