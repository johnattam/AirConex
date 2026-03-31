// app/page.tsx
import Hero from '@/components/home/Hero'
import CategoryGrid from '@/components/home/CategoryGrid'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import HomeCTA from '@/components/home/HomeCTA'
import { getCategorias, getDepoimentos } from '@/sanity/queries'

export const revalidate = 3600

export default async function HomePage() {
  const [categorias, depoimentos] = await Promise.all([
    getCategorias(),
    getDepoimentos(),
  ])

  return (
    <>
      <Hero />
      <CategoryGrid categorias={categorias} />
      <TestimonialsSection depoimentos={depoimentos} />
      <HomeCTA />
    </>
  )
}
