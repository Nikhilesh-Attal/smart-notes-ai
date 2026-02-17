import "./App.css";
import {useState} from "react";
import { v4 as uuidv4 } from "uuid";
import Input from "./components/Input"
import { createSupabaseClient } from './api/api'

interface Message{
  role: "user" | "assistant";
  content: string
}

function App() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)

  const handleStoreDocument = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log(url)

    try{

      setLoading(true)

      //1.generate Ids for conversation and document (i.e video)
      const convId = uuidv4()
      const docId = uuidv4()

      const supabase = createSupabaseClient()

      console.log("convId : ",convId)
      console.log("docId : ",docId)

      //2. generate conversation
      await supabase.from("conversations").insert({
        id: convId,
      })

      //3. generate document
      await supabase.from("documents").insert({
        id: docId,
      })

      //4. link conversation and document
      await supabase.from("conversation_documents").insert({
        conversation_id: convId,
        document_id: docId,
      })

      //5. store the document { the function we have just created }
      const res = await fetch('http://localhost:5000/store-document',{
        method: "Post",
        headers: {
          "Content-type": 'application/json'
        },
        body: JSON.stringify({url, documentId: docId})
      })
      const data = await res.json();
      console.log("backend response: ",data)

    }catch(error){
      console.log("Error in file frontend/src/App.tsx: ", error)
    }finally{
      setLoading(false)
    }
  }

    return (
      <div className="app-comtainer">
        <h1>AI chat with youtube</h1>
        <form onSubmit={handleStoreDocument}>
          <Input placeholder="Drop a youtube url here"
          value={url}
          onChange={setUrl}/>
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? "Processing..." : "Submit"}
          </button>
        </form>
        {loading && <div className="loading-spinner">Loading...</div>}
      </div>
    )
}

export default App;