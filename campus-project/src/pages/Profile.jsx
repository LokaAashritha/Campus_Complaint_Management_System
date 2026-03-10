import { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    setUser(savedUser);
  }, []);

  if (!user) {
    return <p>No user logged in.</p>;
  }

  const avatar =
    user.gender === "boy"
      ? "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
      : "https://cdn-icons-png.flaticon.com/512/4140/4140047.png";

  return (
    <div style={pageStyle}>
      <h2>My Profile</h2>

      <div style={cardStyle}>
        <div style={leftSection}>
          <img src={avatar} alt="Avatar" style={avatarStyle} />
        </div>

        <div style={rightSection}>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Gender:</strong> {user.gender}</p>
          <p><strong>Department:</strong> {user.department}</p>
        </div>
      </div>
    </div>
  );
}

/* Styles */

const pageStyle = {
  padding: "20px"
};

const cardStyle = {
  display: "flex",
  gap: "40px",
  background: "white",
  padding: "30px",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  marginTop: "20px",
  alignItems: "center",
  width: "500px"
};

const leftSection = {
  flex: "0 0 150px"
};

const rightSection = {
  flex: 1,
  fontSize: "16px",
  lineHeight: "30px"
};

const avatarStyle = {
  width: "150px",
  borderRadius: "50%"
};

export default Profile;