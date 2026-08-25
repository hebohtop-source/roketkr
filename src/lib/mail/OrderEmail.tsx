import {
  Html, Body, Container, Heading, Text, Hr, Row, Column, Section
} from "@react-email/components";

type Item = {
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
};

type Props = {
  orderNumber: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  deliveryCity: string;
  notes: string;
  items: Item[];
  total: string;
};

const col = {
  name: { width: "35%", padding: "8px 4px" },
  sku: { width: "25%", padding: "8px 4px" },
  qty: { width: "10%", padding: "8px 4px", textAlign: "center" as const },
  price: { width: "15%", padding: "8px 4px", textAlign: "right" as const },
  total: { width: "15%", padding: "8px 4px", textAlign: "right" as const },
};

export function OrderEmail({
  orderNumber, contactName, contactPhone, contactEmail,
  deliveryCity, notes, items, total,
}: Props) {
  return (
    <Html>
      <Body style={{ fontFamily: "sans-serif", background: "#f9f9f9", padding: "24px" }}>
        <Container style={{ background: "#fff", borderRadius: "8px", padding: "32px", maxWidth: "600px" }}>

          <Heading style={{ fontSize: "24px", marginBottom: "8px" }}>
            Новый заказ № {orderNumber}
          </Heading>
          <Hr />

          <Section style={{ marginTop: "16px" }}>
            <Text><b>Имя:</b> {contactName}</Text>
            <Text><b>Телефон:</b> {contactPhone}</Text>
            <Text><b>Email:</b> {contactEmail}</Text>
            <Text><b>Адрес:</b> {deliveryCity}</Text>
            <Text><b>Комментарий:</b> {notes || "—"}</Text>
          </Section>
          <Hr />

          {/* Header row */}
          <Row style={{ background: "#f4f4f4", fontWeight: "bold" }}>
            <Column style={col.name}>Товар</Column>
            <Column style={col.sku}>Артикул</Column>
            <Column style={col.qty}>Кол-во</Column>
            <Column style={col.price}>Цена</Column>
            <Column style={col.total}>Итого</Column>
          </Row>

          {/* Item rows */}
          {items.map((item, i) => (
            <Row key={i} style={{ borderBottom: "1px solid #eee" }}>
              <Column style={col.name}>{item.productName}</Column>
              <Column style={col.sku}>{item.productSku}</Column>
              <Column style={col.qty}>{item.quantity}</Column>
              <Column style={col.price}>{Number(item.unitPrice).toLocaleString("ru-RU")} ₽</Column>
              <Column style={col.total}>{Number(item.totalPrice).toLocaleString("ru-RU")} ₽</Column>
            </Row>
          ))}

          <Hr />
          <Text style={{ fontSize: "18px", fontWeight: "bold" }}>
            Итого: {Number(total).toLocaleString("ru-RU")} ₽
          </Text>

        </Container>
      </Body>
    </Html>
  );
}
