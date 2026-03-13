import type { FaqItem } from "@/components/faq/faq-accordion";

export type FaqSection = {
  title: string;
  items: FaqItem[];
};

export const FAQ_SECTIONS: FaqSection[] = [
  {
    title: "Sobre la compra de vehículos",
    items: [
      {
        question: "¿Los autos tienen garantía?",
        answer:
          "Sí. Todos nuestros vehículos pasan por un proceso de revisión mecánica y documental antes de publicarse. Además, ofrecemos 3 meses de garantía de motor y caja para brindarte mayor tranquilidad en tu compra.",
      },
      {
        question: "¿Puedo reservar un auto online?",
        answer:
          "Sí. Podés reservar una unidad mediante transferencia bancaria. La reserva asegura que el vehículo no se venda a otro cliente mientras avanzamos con el proceso de compra.",
      },
      {
        question: "¿Los autos tienen todos los papeles al día?",
        answer:
          "Sí. Verificamos que cada vehículo tenga toda su documentación en regla antes de ofrecerlo a la venta.",
      },
      {
        question: "¿Puedo ver el auto antes de comprarlo?",
        answer:
          "Sí. Podés coordinar una visita para ver el vehículo personalmente en la sucursal más cercana.",
      },
      {
        question: "¿Puedo comprar un auto desde otra provincia?",
        answer:
          "Sí. Muchos clientes compran desde otras ciudades. Podemos enviarte fotos, videos y documentación para que evalúes el vehículo con tranquilidad. También podemos coordinar el envío del auto a tu domicilio.",
      },
      {
        question: "¿Los precios publicados incluyen transferencia?",
        answer:
          "No. El valor publicado corresponde únicamente al precio del vehículo. Los gastos de transferencia se calculan según cada unidad.",
      },
    ],
  },
  {
    title: "Sobre la financiación",
    items: [
      {
        question: "¿Ofrecen financiación para comprar un auto?",
        answer:
          "Sí. Trabajamos con distintas entidades financieras para ofrecer planes de financiación según tu perfil crediticio. La misma puede ser personal o prendaria según el banco.",
      },
      {
        question: "¿Puedo financiar una parte del vehículo?",
        answer:
          "Sí. Podés pagar una parte al contado y financiar el resto del valor del vehículo.",
      },
      {
        question: "¿Puedo entregar mi auto como parte de pago?",
        answer:
          "Sí. Tomamos tu vehículo usado como parte de pago, lo que facilita la operación y reduce el monto a financiar.",
      },
      {
        question: "¿Cómo sé cuánto puedo financiar?",
        answer:
          "Nuestros asesores pueden evaluar tu perfil crediticio y ofrecerte distintas alternativas de financiación según tu situación.",
      },
    ],
  },
  {
    title: "Sobre vender tu auto a Car Advice",
    items: [
      {
        question: "¿Compran autos usados?",
        answer: "Sí. Compramos vehículos directamente a particulares.",
      },
      {
        question: "¿Qué autos compran?",
        answer:
          "En general buscamos vehículos modelo 2016 en adelante y con menos de 150.000 km, aunque puede variar según el modelo. Si tu vehículo no cumple con esas condiciones, contamos con nuestra unidad de negocio mayorista, Vestri, que puede evaluar la compra del mismo.",
      },
      {
        question: "¿Cómo tasan mi auto?",
        answer:
          "La tasación se realiza evaluando: estado general, kilometraje, demanda del mercado y precios de referencia del modelo.",
      },
      {
        question: "¿Cuánto tarda el proceso de venta?",
        answer:
          "En muchos casos podemos concretar la operación en el mismo día, una vez confirmada la tasación.",
      },
      {
        question: "¿Cómo se realiza el pago?",
        answer:
          "El pago se realiza mediante e-check, transferencia bancaria u otros medios acordados, dependiendo del caso.",
      },
    ],
  },
  {
    title: "Sobre la documentación",
    items: [
      {
        question: "¿Quién se encarga de la transferencia?",
        answer:
          "Nuestra gestoría especializada se ocupa de todo el proceso administrativo para que la operación sea simple, segura y transparente.",
      },
      {
        question: "¿Cuánto demora la transferencia del vehículo?",
        answer:
          "Depende del registro automotor correspondiente, pero normalmente se completa dentro de los plazos habituales del sistema registral.",
      },
      {
        question: "¿Qué documentación necesito para vender mi auto?",
        answer:
          "Generalmente se requiere: DNI, título del vehículo, cédula de identificación del automotor, formulario 08 firmado y certificado, y verificación policial. De todas maneras, nuestros asesores te acompañarán en cada paso del proceso.",
      },
    ],
  },
];
