/**
 * Loading Skeleton Component
 * Shows placeholder content while loading
 */
function LoadingSkeleton({ type = 'card', count = 1 }) {
  const CardSkeleton = () => (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 animate-pulse">
      <div className="h-8 bg-gray-300 rounded-lg w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
    </div>
  )

  const ImageSkeleton = () => (
    <div className="bg-gray-300 rounded-xl animate-pulse aspect-square"></div>
  )

  const ButtonSkeleton = () => (
    <div className="h-12 bg-gray-300 rounded-full w-48 animate-pulse"></div>
  )

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return <CardSkeleton />
      case 'image':
        return <ImageSkeleton />
      case 'button':
        return <ButtonSkeleton />
      default:
        return <CardSkeleton />
    }
  }

  return (
    <div className={`${type === 'image' ? 'grid gap-4' : 'flex flex-col gap-4'}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  )
}

export default LoadingSkeleton
