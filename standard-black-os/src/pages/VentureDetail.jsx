import { useParams } from 'react-router-dom'
export default function VentureDetail() {
  const { id } = useParams()
  return <div style={{ color: '#F5F1E8', padding: 24 }}>Venture: {id} — placeholder</div>
}
