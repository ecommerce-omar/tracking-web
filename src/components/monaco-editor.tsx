"use client";

import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";

interface MonacoEditorProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
}

const MonacoEditor = ({ value, onChange }: MonacoEditorProps) => {
  const { resolvedTheme } = useTheme();

  // Define o tema do Monaco baseado no tema resolvido
  const monacoTheme = resolvedTheme === "dark" ? "vs-dark" : "light";

  return (
    <div className="h-[350px] rounded-md overflow-hidden border w-full">
      <Editor
        height="100%"
        defaultLanguage="html"
        theme={monacoTheme}
        value={value}
        onChange={onChange}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          wordWrap: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default MonacoEditor;