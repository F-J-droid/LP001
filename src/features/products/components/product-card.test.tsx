import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ProductCard } from './product-card'
import type { TireProduct } from '../types'

const mockProduct: TireProduct = {
  id: "test1",
  slug: "test-product",
  sku: "TEST-123",
  brand: "TestBrand",
  model: "TestModel 500",
  width: 205,
  profile: 55,
  rim: 16,
  loadIndex: "91",
  speedIndex: "V",
  vehicleType: "Passeio",
  runFlat: false,
  reinforced: false,
  price: 500,
  stockStatus: "available",
  imageUrl: "",
  badges: ["Oferta"]
}

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText('TestBrand')).toBeInTheDocument()
    expect(screen.getByText('TestModel 500')).toBeInTheDocument()
    expect(screen.getByText('205/55 R16')).toBeInTheDocument()
    expect(screen.getByText('Oferta')).toBeInTheDocument()
    expect(screen.getByText('COMPRAR AGORA')).toBeInTheDocument()
  })

  it('renders out of stock state correctly', () => {
    render(<ProductCard product={{ ...mockProduct, stockStatus: 'out_of_stock' }} />)
    
    expect(screen.getByText('Esgotado')).toBeInTheDocument()
    expect(screen.getByText('ESGOTADO')).toBeInTheDocument()
  })
})
