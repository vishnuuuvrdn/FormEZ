import { useEffect, useState } from "react";

import api from "../api/axios";

import NavBar from "../components/NavBar";
import DocumentCard from "../components/DocumentCard";

export default function HomePage(){
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDocuments = async () => {
            try{
                const response = await api.get("/documents");
                setDocuments(response.data)
            }
            catch(error){
                setError("Failed to fetch documents!")
            }finally{
                setLoading(false);
            }
        }

        fetchDocuments();
    }, []);

    return (
      <div>
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="mb-10">
            <h1 className="text-4xl font-bold">
              Government Documents Made Simple
            </h1>

            <p className="text-gray-500 mt-3">
              Step-by-step guidance for Indian government processes.
            </p>
          </div>
          {loading && <p>Loading documents...</p>}

          {error && <p className="text-red-500">{error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map((document) => (
                    <DocumentCard
                        key={document.docId}
                        document={document}
                    />
                ))}

            </div>
        </div>
      </div>
    );
}

