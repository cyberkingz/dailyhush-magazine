import { useParams } from 'react-router-dom'

export default function CategoryList() {
  const { slug } = useParams()
  return (
    <main className="container-prose py-10">
      <h1 className="text-2xl font-semibold mb-4">Category: {slug}</h1>
      <p>Posts in this category will appear here.</p>
    </main>
  )
}

