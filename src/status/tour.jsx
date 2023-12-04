import { GoDotFill } from "react-icons/go";



export function StatusTour(children) {
    const dataChildren = children?.children
    const statusColors = {
        Draft: "bg-yellow-300 text-yellow-900",
        Published: "bg-navy-blue-opacity-5 text-navy-blue",
        Hidden: "bg-red-300 text-red-900",
    };

    const normalizedStatus =
        typeof dataChildren === "string" ? normalizeStatus(dataChildren) : "";
    const statusColorClass =
        typeof dataChildren === "string"
            ? statusColors[normalizedStatus]
            : "bg-gray-300";

    return (
        <div
            className={`flex items-center gap-1 p-1 rounded-lg text-sm ${statusColorClass}`}
        >
            <GoDotFill />
            {normalizedStatus}
        </div>
    );
}

// Hàm xử lý trường hợp cụ thể cho USER_REQUEST_REFUND
function normalizeStatus(status) {
    if (status === "PUBLISHED") {
        return "Published";
    }
    if (status === "DRAFT") {
        return "Draft";
    }
    if (status === "HIDDEN") {
        return "Hidden";
    }

    // Trường hợp mặc định cho các giá trị khác
    return status;
}
