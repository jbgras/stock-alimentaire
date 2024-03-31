export default function Inventory (props) {
  const { data } = props;

  return (
    <p>
      <strong>Articles:{JSON.stringify(data)}</strong>
    </p>
  )
}
