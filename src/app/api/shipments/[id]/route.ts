import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { editShipmentSchema } from "@/schemas/edit-shipment-schema";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Criar cliente Supabase
    const supabase = await createClient();

    // Verificar autenticação
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    // Parse e validação do body
    const body = await request.json();
    const validationResult = editShipmentSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Calcular a quantidade total de produtos
    const totalQuantity = data.products.reduce(
      (sum, product) => sum + product.quantity,
      0
    );

    // Atualizar o tracking no Supabase
    const { data: updatedTracking, error: updateError } = await supabase
      .from("tracking")
      .update({
        name: data.name,
        cpf: data.cpf,
        email: data.email,
        contact: data.contact,
        quantity: totalQuantity,
        products: data.products,
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Erro ao atualizar tracking:", updateError);
      return NextResponse.json(
        { error: "Erro ao atualizar envio", details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Envio atualizado com sucesso", data: updatedTracking },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro na API de atualização:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
