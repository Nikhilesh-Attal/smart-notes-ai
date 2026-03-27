# Setup Guide

## Environment Configuration

### Backend Environment Variables

Create `backend/.env` with:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# Optional: Additional configuration
NODE_ENV=development
```

### Frontend Environment Variables

Create `frontend/.env` with:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Getting Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the following:
   - **Project URL** (for both frontend and backend)
   - **anon public** key (for frontend)
   - **service_role** key (for backend only - keep this secret!)

## Database Setup

Make sure you have the following tables in your Supabase database:

```sql
-- ==========================================
-- 0. ENABLE EXTENSIONS
-- ==========================================
CREATE EXTENSION IF NOT EXISTS vector;

-- ==========================================
-- 1. CREATE TABLES (With user_id for isolation)
-- ==========================================

-- Documents table
CREATE TABLE public.documents (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  constraint documents_pkey primary key (id)
);

-- Conversations table  
CREATE TABLE public.conversations (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  constraint conversations_pkey primary key (id)
);

-- Conversation-Documents link table
CREATE TABLE public.conversation_documents (
  conversation_id uuid not null,
  document_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  constraint conversation_documents_pkey primary key (conversation_id, document_id),
  constraint conversation_documents_conversation_id_fkey foreign key (conversation_id) references conversations (id) on delete cascade,
  constraint conversation_documents_document_id_fkey foreign key (document_id) references documents (id) on delete cascade
);

-- Messages table
CREATE TABLE public.conversation_messages (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  conversation_id uuid not null,
  role text not null,
  content text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  constraint conversation_messages_pkey primary key (id),
  constraint conversation_messages_conversation_id_fkey foreign key (conversation_id) references conversations (id) on delete cascade
);

-- Documents embedding table (for vector search)
CREATE TABLE public.documents_embedding (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  content text null,
  metadata jsonb null,
  document_id uuid GENERATED ALWAYS as (((metadata ->> 'documentId'::text))::uuid) STORED null,
  embedding vector(384) null,
  user_id uuid not null references auth.users(id) on delete cascade,
  constraint documents_embedding_pkey primary key (id)
);

-- ==========================================
-- 2. ENABLE ROW LEVEL SECURITY (RLS)
-- ==========================================
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents_embedding ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 3. CREATE SECURITY POLICIES
-- ==========================================
-- These ensure users can only interact with rows that match their auth token

CREATE POLICY "Users can manage their own documents" ON public.documents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own conversations" ON public.conversations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own conversation_documents" ON public.conversation_documents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own messages" ON public.conversation_messages FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own embeddings" ON public.documents_embedding FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 4. SECURE THE VECTOR SEARCH FUNCTION
-- ==========================================
-- SECURITY INVOKER forces the function to respect the RLS policies above

CREATE OR REPLACE FUNCTION match_documents(
    query_embedding vector(384),
    match_count int DEFAULT 5,
    filter jsonb DEFAULT '{}'
)
RETURNS TABLE(
    id uuid,
    content text,
    metadata jsonb,
    similarity float
)
LANGUAGE plpgsql
SECURITY INVOKER 
AS $$
DECLARE
    doc_uuid_array uuid[];
BEGIN
    IF query_embedding IS NULL THEN
        RAISE EXCEPTION 'query_embedding cannot be NULL';
    END IF;

    -- Expect document_ids array in filter JSON
    IF NOT (filter ? 'document_ids') THEN
        RAISE EXCEPTION 'Missing document_ids array in filter JSON';
    END IF;

    -- Convert JSON array → uuid[]
    doc_uuid_array := (
        SELECT array_agg(elem::uuid)
        FROM jsonb_array_elements_text(filter->'document_ids') elem
    );

    IF doc_uuid_array IS NULL OR array_length(doc_uuid_array, 1) = 0 THEN
        RAISE EXCEPTION 'document_ids array is empty or invalid';
    END IF;

    RETURN QUERY
    SELECT
        ed.id,
        ed.content,
        ed.metadata,
        1 - (ed.embedding <=> query_embedding) AS similarity
    FROM documents_embedding ed
    WHERE ed.document_id = ANY(doc_uuid_array)
    ORDER BY ed.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- 1. Temporarily remove the RLS policy
DROP POLICY IF EXISTS "Users can manage their own embeddings" ON public.documents_embedding;

-- 2. Drop and recreate the user_id column as a generated column
ALTER TABLE public.documents_embedding DROP COLUMN user_id;
ALTER TABLE public.documents_embedding 
ADD COLUMN user_id uuid GENERATED ALWAYS AS (((metadata ->> 'userId'::text))::uuid) STORED NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. Put the exact same RLS policy back
CREATE POLICY "Users can manage their own embeddings" ON public.documents_embedding FOR ALL USING (auth.uid() = user_id);

```

## Running the Application

1. Start the backend:
```bash
cd backend
npm install
npm run dev
```

2. Start the frontend:
```bash
cd frontend  
npm install
npm run dev
```

## Troubleshooting

### Common Issues

1. **"fetch failed" error**: Check your Supabase URL and keys in the .env files
2. **Connection timeout**: Ensure your Supabase project is active and not paused
3. **Vector embedding errors**: Make sure the `vector` extension is enabled in your Supabase database
4. **Python embedding errors**: Ensure `embed.py` and required Python packages are installed in the backend folder

### Debug Steps

1. Check browser console for frontend errors
2. Check backend terminal logs for detailed error messages  
3. Verify Supabase connection by testing a simple query in the SQL Editor
4. Test the YouTube URL manually to ensure it has available transcripts
