import { useEffect, useState } from "react";
import "./Styling/Employees.css";

function App() {
  const [employeeCount, setEmployeeCount] = useState<number>(0);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [sum, setSum] = useState<number>(0);

  const minimumSumValue = 11171;

  useEffect(() => {
    checkConnectivity();
  }, []);

  async function checkConnectivity() {
    const response = await fetch("api/employees");
    const data = await response.json();
    setEmployees(data);
    setEmployeeCount(data.length);
  }

  const updateEmployeeData = async () => {
    const response = await fetch("api/employees");
    const data = await response.json();

    setEmployees(data);
    getEmployeeSum();
  };

  const increaseEmployeesValues = async () => {
    await fetch("api/employees/increase-values", { method: "POST" });
    updateEmployeeData();
  };

  // Added decrease to make testing the conditional rendering easier
  const decreaseEmployeesValues = async () => {
    await fetch("api/employees/decrease-values", { method: "POST" });
    updateEmployeeData();
  };

  const getEmployeeSum = async () => {
    const sumResponse = await fetch("api/employees/get-sum", {
      method: "GET",
    });
    const sumData = await sumResponse.json();
    setSum(sumData);
  };

  if (!employees || employees.length === 0) {
    return <div>No Employees Found.</div>;
  }

  return (
    <>
      <h1>{employeeCount} Employees</h1>
      {sum >= minimumSumValue ? (
        <h1>
          {sum} is the sum of all Employee values whose name start with either
          A, B or C
        </h1>
      ) : (
        <h1>
          The sum of all Employee values whose name start with either A, B or C
          is less than {minimumSumValue}
        </h1>
      )}

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
      <button onClick={increaseEmployeesValues}>Increment</button>
      <button onClick={decreaseEmployeesValues}>Decrement</button>
    </>
  );
}

export default App;
