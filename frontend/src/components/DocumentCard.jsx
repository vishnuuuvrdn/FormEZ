import { Link } from "react-router-dom";
import iconMap from "../utils/iconMap";

export default function DocumentCard({ document }) {
  const Icon = iconMap[document.icon]
  return (
    <Link to={`/document/${document.docId}`}>
      <div
        className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition cursor-pointer">
        <div className="flex items-center justify-between">
          <span className="text-4xl">{Icon && <Icon size={40} />}</span>

          <span
            className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
            {document.category}
          </span>
        </div>

        <h2 className="text-xl font-semibold mt-4">{document.info.title}</h2>

        <h4 className="text-gray-800 mt-2">{document.info.tagline}</h4>
        <p className="text-gray-500 mt-2">{document.info.description}</p>
      </div>
    </Link>
  );
}
