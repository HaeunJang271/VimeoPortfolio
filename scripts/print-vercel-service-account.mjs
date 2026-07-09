#!/usr/bin/env node
/**
 * Vercel용 FIREBASE_SERVICE_ACCOUNT_KEY 값 출력
 * 사용: node scripts/print-vercel-service-account.mjs
 */
import { readFileSync } from "fs";
import { resolve } from "path";

const filePath = resolve(process.cwd(), "firebase-service-account.json");
const json = readFileSync(filePath, "utf8");
const minified = JSON.stringify(JSON.parse(json));

console.log("Vercel Environment Variable:");
console.log("Name: FIREBASE_SERVICE_ACCOUNT_KEY");
console.log("Value (아래 한 줄 전체 복사):");
console.log(minified);
