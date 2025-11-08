import argparse
import os
from pathlib import Path

from dotenv import load_dotenv

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA


def load_pdfs(paths):
    docs = []
    for p in paths:
        loader = PyPDFLoader(str(p))
        docs.extend(loader.load())
    return docs


def split_docs(docs, chunk_size=1000, chunk_overlap=150):
    splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    return splitter.split_documents(docs)


def build_vector_store(docs, persist_dir, embed_model):
    embeddings = OpenAIEmbeddings(model=embed_model)
    vs = Chroma.from_documents(docs, embedding=embeddings, persist_directory=persist_dir)
    vs.persist()
    return vs


def load_vector_store(persist_dir, embed_model):
    embeddings = OpenAIEmbeddings(model=embed_model)
    return Chroma(persist_directory=persist_dir, embedding_function=embeddings)


def run_query(vs, query, model_name, k):
    llm = ChatOpenAI(model=model_name, temperature=0)
    retriever = vs.as_retriever(search_kwargs={"k": k})
    qa = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True,
    )
    result = qa({"query": query})
    return result


def main():
    load_dotenv()
    parser = argparse.ArgumentParser(description="ChatPDF (RAG) com LangChain")
    parser.add_argument("--pdf", nargs="*", help="Caminhos para PDFs (um ou mais)")
    parser.add_argument("--query", required=True, help="Pergunta a ser respondida")
    parser.add_argument("--persist", default=".chroma", help="Diretório de persistência do índice")
    parser.add_argument("--reuse", action="store_true", help="Reutiliza índice existente, não reprocessa PDFs")
    parser.add_argument("--k", type=int, default=4, help="Número de documentos recuperados")
    parser.add_argument("--model", default="gpt-4o-mini", help="Modelo OpenAI para respostas")
    parser.add_argument("--embed", default="text-embedding-3-small", help="Modelo de embedding")
    args = parser.parse_args()

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise SystemExit("Defina OPENAI_API_KEY no ambiente (ou arquivo .env)")

    persist_dir = Path(args.persist)
    persist_dir.mkdir(parents=True, exist_ok=True)

    if args.reuse and persist_dir.exists() and any(persist_dir.iterdir()):
        vs = load_vector_store(str(persist_dir), args.embed)
    else:
        if not args.pdf:
            raise SystemExit("Informe PDFs com --pdf ao criar/recriar o índice, ou use --reuse")
        paths = [Path(p) for p in args.pdf]
        for p in paths:
            if not p.exists():
                raise SystemExit(f"Arquivo não encontrado: {p}")
        docs = load_pdfs(paths)
        chunks = split_docs(docs)
        vs = build_vector_store(chunks, str(persist_dir), args.embed)

    res = run_query(vs, args.query, args.model, args.k)
    answer = res.get("result", "")
    sources = res.get("source_documents", [])

    print("\n=== RESPOSTA ===\n")
    print(answer)
    if sources:
        print("\n=== FONTES ===")
        for i, doc in enumerate(sources, 1):
            meta = doc.metadata or {}
            page = meta.get("page", "?")
            source = meta.get("source", "")
            print(f"[{i}] {source} (página {page})")


if __name__ == "__main__":
    main()

