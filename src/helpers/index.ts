export enum LearnType {
  LEARN_LISTEN = 'LEARN_LISTEN',
  LEARN_VOCABULARY = 'LEARN_VOCABULARY',
}

export enum WordType {
  LEARNED = 'LEARNED',
  LEARN = 'LEARN',
}

export enum LogType {
  LISTEN = "LISTEN",
  WRITE = "WRITE",
  WRITE_ERROR = "WRITE_ERROR",
}

export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}