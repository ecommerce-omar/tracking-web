import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createShipmentSchema } from "@/schemas/create-shipment-schema";

export async function POST(request: NextRequest) {
  try {
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
    const validationResult = createShipmentSchema.safeParse(body);

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

    // Criar o tracking no Supabase
    const { data: newTracking, error: insertError } = await supabase
      .from("tracking")
      .insert({
        name: data.name,
        cpf: data.cpf,
        email: data.email,
        contact: data.contact,
        order_id: data.order_id,
        tracking_code: data.tracking_code,
        sender: data.sender,
        delivery_channel: data.delivery_channel,
        category: data.category,
        quantity: totalQuantity,
        products: data.products,
        current_status: "Etiqueta emitida",
        events: [],
      })
      .select()
      .single();

    if (insertError) {
      console.error("Erro ao criar tracking:", insertError);
      return NextResponse.json(
        { error: "Erro ao criar envio", details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Envio criado com sucesso", data: newTracking },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro na API de criação:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
