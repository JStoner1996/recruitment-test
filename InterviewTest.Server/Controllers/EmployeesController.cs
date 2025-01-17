using InterviewTest.Server.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;

namespace InterviewTest.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        [HttpGet]
        public List<Employee> Get()
        {
            var employees = new List<Employee>();

            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var queryCmd = connection.CreateCommand();
                queryCmd.CommandText = @"SELECT Name, Value FROM Employees";
                using (var reader = queryCmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        employees.Add(new Employee
                        {
                            Name = reader.GetString(0),
                            Value = reader.GetInt32(1)
                        });
                    }
                }
            }

            return employees;
        }

        [HttpPost("increase-values")]
        public IActionResult IncreaseEmployeeValues()
        {
            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var increaseCMD = connection.CreateCommand();
                increaseCMD.CommandText = @"
                UPDATE Employees
                SET Value = CASE
                    WHEN Name LIKE 'E%' THEN Value + 1
                    WHEN Name LIKE 'G%' THEN Value + 10
                    ELSE Value + 100
                END";
                increaseCMD.ExecuteNonQuery();
            }
                return Ok();
        }

        // Added to make testing the conditional render easier
        [HttpPost("decrease-values")]
        public IActionResult DecreaseEmployeeValues()
        {
            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var decreaseCmd = connection.CreateCommand();
                decreaseCmd.CommandText = @"
                UPDATE Employees
                SET Value = CASE
                    WHEN Name LIKE 'A%' OR Name LIKE 'B%' Or Name LIKE 'C%' THEN Value - 100 ELSE Value
                END";
                decreaseCmd.ExecuteNonQuery();
            }
            return Ok();
        }

        [HttpGet("get-sum")]
        public int GetEmployeesSum()
        {
            int sum = 0;

            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var sumCmd = connection.CreateCommand();
                sumCmd.CommandText = @"
                SELECT SUM(Value)
                FROM Employees
                    WHERE Name LIKE 'A%' 
                    OR Name LIKE 'B%' 
                    OR Name LIKE 'C%'";

              var result = sumCmd.ExecuteScalar();             
              sum = result != DBNull.Value ? Convert.ToInt32(result) : 0;
            }
            return sum;
        }
    }
}
