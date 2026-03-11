import { Injectable } from "@nestjs/common";
import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import nlp from "compromise";

const SKILL_DICTIONARY = [
  "javascript",
  "typescript",
  "react",
  "next.js",
  "node.js",
  "nestjs",
  "postgresql",
  "mysql",
  "mongodb",
  "aws",
  "gcp",
  "azure",
  "docker",
  "kubernetes",
  "playwright",
  "n8n",
  "python",
  "java",
  "golang",
  "ci/cd",
  "graphql",
  "rest",
  "tailwind",
  "figma",
];

@Injectable()
export class ResumeParserService {
  async parse(filePath: string) {
    const ext = path.extname(filePath).toLowerCase();
    let text = "";

    if (ext === ".pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      text = data.text ?? "";
    } else if (ext === ".docx") {
      const data = await mammoth.extractRawText({ path: filePath });
      text = data.value ?? "";
    } else {
      text = "";
    }

    const lower = text.toLowerCase();
    const matched = SKILL_DICTIONARY.filter((skill) => lower.includes(skill));

    const nouns = nlp(text).nouns().out("array");
    const extracted = [...new Set([...matched, ...nouns])]
      .map((s) => s.toLowerCase())
      .filter((s) => s.length <= 40);

    return { text, skills: extracted.slice(0, 50) };
  }
}

