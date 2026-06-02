import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

function FormPage() {
  const username = useSelector(
    (state) => state.user.username
  );

  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const handleSubmit = async () => {
    const payload = {
      formName: "EmployeeForm",
      username: username,
      formData: {
        name,
        age
      }
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/submit-form",
        payload
      );

      alert(response.data.message);
    } catch (error) {
      alert("Submission failed");
    }
  };

  return (
    <div>
      <h1>Employee Form</h1>

      <h3>User: {username}</h3>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br />
      <br />

      <input
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />

      <br />
      <br />

      <button onClick={handleSubmit}>
        Submit Form
      </button>
    </div>
  );
}

export default FormPage;