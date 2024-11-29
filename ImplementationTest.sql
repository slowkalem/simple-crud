1. select * from employees

2. select COUNT(*) as total_manager from employees where job_title = 'Manager'

3. select "name", salary, department from employees where department in ('Sales', 'Marketing')

4. SELECT AVG(salary) AS average_salary
FROM employees
WHERE joined_date >= CURRENT_DATE - INTERVAL '5 years';

5. select e."name", sum(sd.sales) as total_sales from employees e
join sales_data sd on e.employee_id = sd.employee_id
group by e."name" 
order by total_sales desc
limit 5

6. SELECT 
    e."name", 
    e.salary, 
    d.avg_salary
FROM 
    public.employees e
JOIN (
    SELECT 
        department, 
        AVG(salary) AS avg_salary
    FROM 
        public.employees
    GROUP BY 
        department
    HAVING 
        AVG(salary) > (SELECT AVG(salary) FROM public.employees)
) d ON e.department = d.department;

7. select e."name", sum(sd.sales) as total_sales,
CONCAT('Peringkat ', ROW_NUMBER() OVER (ORDER BY SUM(sd.sales) DESC)) AS ranking
from employees e
join sales_data sd on e.employee_id = sd.employee_id
group by e."name" 
order by total_sales desc

8. CREATE OR REPLACE FUNCTION get_employee_salary_by_department(
    department_name VARCHAR
)
RETURNS TABLE("name" VARCHAR, salary INT, total_salary BIGINT) -- Define return type
LANGUAGE plpgsql
AS $$
BEGIN
    -- Query to return the list of employees and total salary for the department
    RETURN QUERY
    SELECT 
        e."name",
        e.salary,
        SUM(e.salary) OVER (PARTITION BY e.department) AS total_salary
    FROM 
        public.employees e
    WHERE 
        e.department = department_name;
END;
$$;


select * from get_employee_salary_by_department('Sales')