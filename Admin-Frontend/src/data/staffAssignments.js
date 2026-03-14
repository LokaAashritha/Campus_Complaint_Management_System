const DEFAULT_ASSIGNMENTS = {
  Network: "IT Team",
  Hostel: "Maintenance Team",
  Infrastructure: "Admin Team",
  Security: "Security Team",
};

export function getAssignments() {
  const saved = localStorage.getItem("staffAssignments");
  return saved ? JSON.parse(saved) : DEFAULT_ASSIGNMENTS;
}

export function saveAssignments(assignments) {
  localStorage.setItem(
    "staffAssignments",
    JSON.stringify(assignments)
  );
}