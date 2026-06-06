import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  Timestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Mod {
  id: string;
  title: string;
  description: string;
  type: "Texture Pack" | "Add-on" | "Map" | "Skin" | "Shader" | "Mod" | "Other";
  platform: "Java" | "Bedrock" | "Both";
  images: string[];
  downloadUrl: string;
  fileSize: string;
  price: "Free" | string;
  downloads: number;
  authorId: string;
  authorName: string;
  verified: boolean;
  searchKeywords: string[];
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  isAdmin: boolean;
  favorites: string[];
  createdAt: Timestamp | null;
}

function modFromDoc(docSnap: DocumentSnapshot | QueryDocumentSnapshot): Mod {
  const data = docSnap.data() as Omit<Mod, "id">;
  return { id: docSnap.id, ...data };
}

export async function getMods(filters?: {
  platform?: "Java" | "Bedrock" | "Both";
  type?: string;
  limitCount?: number;
  orderByField?: "createdAt" | "downloads";
}): Promise<Mod[]> {
  const modsRef = collection(db, "mods");
  const constraints: Parameters<typeof query>[1][] = [];

  constraints.push(orderBy(filters?.orderByField || "createdAt", "desc"));
  constraints.push(limit(200));

  const q = query(modsRef, ...constraints);
  const snapshot = await getDocs(q);
  let results = snapshot.docs.map(modFromDoc);

  if (filters?.platform && filters.platform !== "Both") {
    results = results.filter(m => m.platform === filters.platform || m.platform === "Both");
  }
  if (filters?.type) {
    results = results.filter(m => m.type === filters.type);
  }
  if (filters?.limitCount) {
    results = results.slice(0, filters.limitCount);
  }

  return results;
}

export async function getMod(id: string): Promise<Mod | null> {
  const docRef = doc(db, "mods", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return modFromDoc(docSnap);
}

export async function createMod(modData: Omit<Mod, "id" | "createdAt" | "updatedAt" | "downloads" | "verified" | "searchKeywords">): Promise<string> {
  const keywords = generateKeywords(modData.title);
  const docRef = await addDoc(collection(db, "mods"), {
    ...modData,
    downloads: 0,
    verified: false,
    searchKeywords: keywords,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateMod(id: string, data: Partial<Mod>): Promise<void> {
  const docRef = doc(db, "mods", id);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteMod(id: string): Promise<void> {
  await deleteDoc(doc(db, "mods", id));
}

export async function incrementDownloads(id: string): Promise<void> {
  const docRef = doc(db, "mods", id);
  await updateDoc(docRef, { downloads: increment(1) });
}

export async function searchMods(searchTerm: string): Promise<Mod[]> {
  const term = searchTerm.toLowerCase().trim();
  if (!term) return [];

  const modsRef = collection(db, "mods");
  const q = query(
    modsRef,
    where("searchKeywords", "array-contains", term),
    limit(50)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(modFromDoc);
}

export async function searchModsByTitle(searchTerm: string): Promise<Mod[]> {
  const term = searchTerm.toLowerCase().trim();
  if (!term) return [];

  const allMods = await getMods({ limitCount: 200 });
  return allMods.filter(mod =>
    mod.title.toLowerCase().includes(term) ||
    mod.description.toLowerCase().includes(term) ||
    mod.type.toLowerCase().includes(term) ||
    mod.platform.toLowerCase().includes(term)
  );
}

export async function getRelatedMods(mod: Mod, limitCount = 6): Promise<Mod[]> {
  const modsRef = collection(db, "mods");
  const q = query(
    modsRef,
    where("type", "==", mod.type),
    limit(limitCount + 1)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(modFromDoc)
    .filter(m => m.id !== mod.id)
    .slice(0, limitCount);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { uid: docSnap.id, ...docSnap.data() } as UserProfile;
}

export async function createUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  await setDoc(doc(db, "users", uid), {
    ...data,
    isAdmin: false,
    favorites: [],
    createdAt: serverTimestamp(),
  }, { merge: true });
}

export async function toggleFavorite(uid: string, modId: string, isFavorite: boolean): Promise<void> {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    favorites: isFavorite ? arrayUnion(modId) : arrayRemove(modId),
  });
}

export async function getFavoriteMods(favoriteIds: string[]): Promise<Mod[]> {
  if (!favoriteIds.length) return [];
  const mods: Mod[] = [];
  for (const id of favoriteIds.slice(0, 20)) {
    const mod = await getMod(id);
    if (mod) mods.push(mod);
  }
  return mods;
}

export async function deleteAllMods(): Promise<number> {
  const modsRef = collection(db, "mods");
  const snapshot = await getDocs(modsRef);
  const batchSize = snapshot.docs.length;
  await Promise.all(snapshot.docs.map(d => deleteDoc(d.ref)));
  return batchSize;
}

function generateKeywords(title: string): string[] {
  const words = title.toLowerCase().split(/\s+/);
  const keywords: string[] = [];

  for (const word of words) {
    if (word.length > 1) {
      for (let i = 1; i <= word.length; i++) {
        keywords.push(word.slice(0, i));
      }
    }
  }

  keywords.push(title.toLowerCase());
  return [...new Set(keywords)];
}
