import ShopBanner from '../components/shop/ShopBanner'
import ShopProduct from '../components/shop/ShopProduct'
import ShopBenefits from '../components/shop/ShopBenefits'

const Shop = () => {
  return (
    <div className="shop-page">
      <ShopBanner />
      <ShopProduct />
      <ShopBenefits />
    </div>
  )
}

export default Shop
