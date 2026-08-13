import type { AuthResult, PdfItem, PublicUser } from "../types/models";

const USERS_KEY = "la_users";
const SESSION_KEY = "la_session";
const DB_NAME = "la_storage_db";
const DB_VERSION = 1;
const PDF_STORE = "pdfs";

type LocalUser = PublicUser & { password: string };
type LocalPdf = PdfItem & { base64: string };

const DEFAULT_ADMIN: LocalUser = {
  id: "admin-default",
  email: "Admin@gmail.com",
  name: "Administrator",
  role: "admin",
  created_at: new Date().toISOString(),
  password: "admin123",
};

function readUsers(): LocalUser[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    localStorage.setItem(USERS_KEY, JSON.stringify([DEFAULT_ADMIN]));
    return [DEFAULT_ADMIN];
  }
  const users = JSON.parse(raw) as LocalUser[];
  if (
    !users.some(
      (u) => u.email.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase(),
    )
  ) {
    users.unshift(DEFAULT_ADMIN);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
  return users;
}

function writeUsers(users: LocalUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function openPdfDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(PDF_STORE)) {
        db.createObjectStore(PDF_STORE, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readPdfs(): Promise<LocalPdf[]> {
  const db = await openPdfDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PDF_STORE, "readonly");
    const store = tx.objectStore(PDF_STORE);
    const request = store.getAll();

    request.onsuccess = () => resolve((request.result as LocalPdf[]) ?? []);
    request.onerror = () => reject(request.error);
  });
}

async function writePdfs(pdfs: LocalPdf[]) {
  const db = await openPdfDb();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(PDF_STORE, "readwrite");
    const store = tx.objectStore(PDF_STORE);

    store.clear();
    pdfs.forEach((pdf) => store.put(pdf));

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function toPublic(u: LocalUser): PublicUser {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    created_at: u.created_at,
  };
}

export const localApi = {
  async register(input: {
    email: string;
    password: string;
    name: string;
  }): Promise<AuthResult> {
    const users = readUsers();
    if (
      users.some(
        (u) => u.email.toLowerCase() === input.email.trim().toLowerCase(),
      )
    ) {
      return { ok: false, error: "An account with this email already exists" };
    }
    if (input.password.length < 6)
      return { ok: false, error: "Password must be at least 6 characters" };
    const user: LocalUser = {
      id: crypto.randomUUID(),
      email: input.email.trim(),
      name: input.name.trim() || "User",
      role: "user",
      created_at: new Date().toISOString(),
      password: input.password,
    };
    users.push(user);
    writeUsers(users);
    const token = crypto.randomUUID();
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ token, userId: user.id }),
    );
    return { ok: true, user: toPublic(user), token };
  },

  async login(input: { email: string; password: string }): Promise<AuthResult> {
    const users = readUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === input.email.trim().toLowerCase(),
    );
    if (!user || user.password !== input.password) {
      return { ok: false, error: "Invalid email or password" };
    }
    const token = crypto.randomUUID();
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ token, userId: user.id }),
    );
    return { ok: true, user: toPublic(user), token };
  },

  async logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  async me(token: string | null): Promise<PublicUser | null> {
    if (!token) return null;
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as { token: string; userId: string };
    if (session.token !== token) return null;
    const user = readUsers().find((u) => u.id === session.userId);
    return user ? toPublic(user) : null;
  },

  async listPdfs(): Promise<PdfItem[]> {
    const pdfs = await readPdfs();
    return pdfs.map(({ base64: _b, ...rest }) => rest);
  },

  async uploadPdf(input: {
    title: string;
    description?: string;
    fileName: string;
    bytes: number[];
  }): Promise<PdfItem> {
    const pdfs = await readPdfs();
    const bytes = new Uint8Array(input.bytes);
    const blob = new Blob([bytes], { type: "application/pdf" });
    const item: LocalPdf = {
      id: crypto.randomUUID(),
      title: input.title.trim() || input.fileName,
      description: input.description?.trim() ?? "",
      file_name: input.fileName,
      created_at: new Date().toISOString(),
      base64: await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      }),
    };

    pdfs.unshift(item);
    await writePdfs(pdfs);
    const { base64: _b, ...rest } = item;
    return rest;
  },

  async getPdfData(id: string) {
    const pdf = (await readPdfs()).find((p) => p.id === id);
    if (!pdf) throw new Error("PDF not found");
    const rawBase64 = pdf.base64;
    const base64 = rawBase64.includes(",")
      ? rawBase64.split(",")[1]
      : rawBase64;
    return { fileName: pdf.file_name, base64, mime: "application/pdf" };
  },

  async deletePdf(id: string) {
    const pdfs = await readPdfs();
    await writePdfs(pdfs.filter((p) => p.id !== id));
    return { id, deleted: true };
  },
};
