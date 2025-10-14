export default function Item({ params }: { params: { itemId: string } }) {
  return <h1>Item page: {params.itemId}</h1>;
}
