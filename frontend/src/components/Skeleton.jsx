import "./Skeleton.css";

export function ProductCardSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-line skeleton-text"></div>
        <div className="skeleton-line skeleton-price"></div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="skeleton-page">
      <div className="skeleton-header">
        <div className="skeleton-line skeleton-title-large"></div>
        <div className="skeleton-line skeleton-text-medium"></div>
      </div>
      <ProductGridSkeleton />
    </div>
  );
}

