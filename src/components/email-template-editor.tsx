"use client";

import { CodeXml, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MonacoEditor from "@/components/monaco-editor";

interface EmailTemplateEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string | number;
  className?: string;
}

export function EmailTemplateEditor({
  value,
  onChange,
  height = "350px",
  className,
}: EmailTemplateEditorProps) {
  return (
    <div className={cn(className)}>
      <Tabs defaultValue="preview" className="flex flex-col h-full">
        <TabsList className="w-fit">
          <TabsTrigger value="preview">
            <Mail />
            Preview
          </TabsTrigger>
          <TabsTrigger value="html">
            <CodeXml />
            Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value="html" className="flex-1 mt-0">
          <div style={{ height }}>
            <MonacoEditor
              value={value}
              onChange={(newValue) => onChange(newValue || "")}
            />
          </div>
        </TabsContent>

        <TabsContent value="preview" className="flex-1 mt-0">
          <div className="border rounded-md overflow-auto" style={{ height }}>
            {value ? (
              <iframe
                srcDoc={value}
                className="w-full h-full border-0"
                title="Preview"
              />
            ) : (
              <div className="w-full h-full bg-muted/50 flex items-center justify-center">
                <span className="text-muted-foreground text-sm">
                  Nenhum conteúdo para visualizar
                </span>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
