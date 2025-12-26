"use client";

import { TrackingSearchByCode } from "@/components/tracking-search-by-code";
import { TrackingSearchByCpf } from "@/components/tracking-search-by-cpf";
import { FadeInWrapper } from "@/components/fade-in-wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TrackingPage() {
  return (
    <FadeInWrapper className="space-y-4">
      <Tabs defaultValue="code">
        <TabsList>
          <TabsTrigger value="code">Consulta por Código</TabsTrigger>
          <TabsTrigger value="cpf">Consulta por CPF</TabsTrigger>
        </TabsList>
        <TabsContent value="code" className="space-y-4">
          <TrackingSearchByCode />
        </TabsContent>
        <TabsContent value="cpf" className="space-y-4">
          <TrackingSearchByCpf />
        </TabsContent>
      </Tabs>
    </FadeInWrapper>
  );
}
