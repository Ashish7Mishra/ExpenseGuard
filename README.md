# ExpenseGuard - Expense Tracker API

A robust backend service built with Java and Spring Boot to efficiently manage and track personal or business expenses. This API provides endpoints for creating, retrieving, updating, and deleting expense records.

---

## ✨ Features

*   **CRUD Operations:** Full support for Creating, Reading, Updating, and Deleting expenses.
*   **RESTful API:** Clean, predictable, and resource-oriented API endpoints.
*   **Database Integration:** Uses Oracle SQL for persistent data storage with Spring Data JPA.
*   **Validation:** Server-side validation to ensure data integrity.


---

## 🛠️ Built With

*   **Java 21** - Core programming language.
*   **Spring Boot** - Framework for building the application.
*   **Spring Data JPA** - For database interaction.
*   **Maven** - For dependency management and build automation.
*   **SQL Plus** - The database used.
*   **Lombok** - To reduce boilerplate code.

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Java JDK 17 or higher
*   Apache Maven
*   A running instance of [MySQL/PostgreSQL/etc.]
*   Git

### Installation

1.  **Clone the repository**
    ```sh
    git clone https://github.com/Ashish7Mishra/ExpenseGuard.git
    ```

2.  **Navigate to the project directory**
    ```sh
    cd ExpenseGuard
    ```

3.  **Configure the database**
    Open `src/main/resources/application.properties` and update the `spring.datasource` properties with your database URL, username, and password.
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/your_database_name
    spring.datasource.username=your_username
    spring.datasource.password=your_password
    ```

4.  **Run the application**
    ```sh
    mvn spring-boot:run
    ```
    The application will start on `http://localhost:8080`.

---

##  API Endpoints

Here are the primary endpoints available:

| Method | Endpoint              | Description                      |
| ------ | --------------------- | -------------------------------- |
| `GET`    | `/api/expenses`       | Get a list of all expenses.      |
| `GET`    | `/api/expenses/{id}`  | Get a single expense by its ID.  |
| `POST`   | `/api/expenses`       | Create a new expense.            |
| `PUT`    | `/api/expenses/{id}`  | Update an existing expense.      |
| `DELETE` | `/api/expenses/{id}`  | Delete an expense by its ID.     |

#### Example Request Body for `POST /api/expenses`

```json
{
  "itemName": "Office Supplies",
  "amount": 75.50,
  "expenseDate": "2023-10-27",
  "category": "Work"
}
