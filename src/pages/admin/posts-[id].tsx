import { useParams } from 'react-router-dom'

export default function AdminPostEdit() {
  const { id } = useParams()
  return (
    <main className="container-prose py-10">
      <h1 className="text-2xl font-semibold mb-4 text-white">Edit Post {id}</h1>
      <p className="text-white/70">Editor form coming soon.</p>
    </main>
  )
}

