interface Props {
 status: number;
 type?: "job" | "milestone";
}

const statusMap = {
 job: ["Created", "In Progress", "Completed", "Cancelled"],
 milestone: ["Not Started", "In Progress", "Completed", "Disputed"],
};

const colorMap = {
 job: [
  "bg-yellow-100 text-yellow-800",
  "bg-blue-100 text-blue-800",
  "bg-green-100 text-green-800",
  "bg-red-100 text-red-800",
 ],
 milestone: [
  "bg-gray-100 text-gray-800",
  "bg-blue-100 text-blue-800",
  "bg-green-100 text-green-800",
  "bg-red-100 text-red-800",
 ],
};

const StatusBadge = ({ status, type = "job" }: Props) => {
 const label = statusMap[type][status] || "Unknown";
 const classes = colorMap[type][status] || "bg-gray-100 text-gray-800";

 return (
  <span className={`px-2 py-1 text-xs rounded-full ${classes}`}>
   {label}
  </span>
 );
};

export default StatusBadge;
