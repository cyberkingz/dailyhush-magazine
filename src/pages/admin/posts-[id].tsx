import { useParams } from 'react-router-dom'

export default function AdminPostEdit() {
  const { id } = useParams()
  return (
    <main className="container-prose py-10">
      <h1 className="text-2xl font-semibold mb-4">Edit Post {id}</h1>
      <p>Editor form coming soon.</p>
    </main>
  )
}

