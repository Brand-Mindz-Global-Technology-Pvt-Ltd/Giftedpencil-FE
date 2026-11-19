import { ArrowRight } from 'lucide-react'
import category1 from '../../assets/category/C-1.png'
import category2 from '../../assets/category/C-2.png'
import category3 from '../../assets/category/C-3.png'
import category4 from '../../assets/category/C-4.png'

interface CategoryItem {
  id: string
  name: string
  image: string
}

const categoriesData: CategoryItem[] = [
  {
    id: 'for-kids',
    name: 'For Kids',
    image: category1,
  },
  {
    id: 'for-teenagers',
    name: 'For Teenagers',
    image: category2,
  },
  {
    id: 'for-adults',
    name: 'For Adults',
    image: category3,
  },
  {
    id: 'for-expecting-mothers',
    name: 'For Expecting Mothers',
    image: category4,
  },
]

const Categories = () => {
  return (
    <section className="categories-section" aria-label="Shop by Category">
      <div className="categories-container">
        {/* Section Heading */}
        <div className="categories-header">
          <span className="categories-header-line" aria-hidden="true" />
          <h2 className="categories-title">Shop by Category</h2>
          <span className="categories-header-line" aria-hidden="true" />
        </div>

        {/* Categories Grid */}
        <div className="categories-grid">
          {categoriesData.map((category) => (
            <div
              key={category.id}
              className="category-card"
              role="button"
              tabIndex={0}
              aria-label={`Browse ${category.name}`}
            >
              {/* Category Image */}
              <div className="category-image-wrap">
                <img
                  src={category.image}
                  alt={category.name}
                  className="category-image"
                  loading="lazy"
                />
              </div>

              {/* Category Pill Badge */}
              <div className="category-pill">
                <span className="category-name">{category.name}</span>
                <span className="category-arrow-circle" aria-hidden="true">
                  <ArrowRight size={13} strokeWidth={2.4} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categories
