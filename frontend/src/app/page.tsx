'use client'
import React from 'react'
import Section1 from '@/components/section1'
import Section2 from '@/components/section2'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import Galeria from '@/components/galeria'
import CTA from '@/components/CTA'
export default function page() {
  return (
    <div className='min-h-screen bg-slate-950'>

      <Navbar />
      <Section1 />
      <Section2 />
      <Galeria />
      <CTA />
      <Footer />
    </div>
  )
}
