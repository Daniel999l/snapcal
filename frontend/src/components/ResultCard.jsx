export default function ResultCard({ result }) {
  if (!result) return null;
  return (
    <div className="mt-6 bg-white shadow-md rounded-xl p-6 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-2">Estimated Nutrition</h2>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-blue-50 p-3 rounded-lg">
          <span className="block text-gray-500">Calories</span>
          <span className="text-2xl font-bold">{result.calories}</span>
          <span className="text-gray-500"> kcal</span>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <span className="block text-gray-500">Protein</span>
          <span className="text-2xl font-bold">{result.protein}</span>
          <span className="text-gray-500"> g</span>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg">
          <span className="block text-gray-500">Carbs</span>
          <span className="text-2xl font-bold">{result.carbs}</span>
          <span className="text-gray-500"> g</span>
        </div>
        <div className="bg-red-50 p-3 rounded-lg">
          <span className="block text-gray-500">Fat</span>
          <span className="text-2xl font-bold">{result.fat}</span>
          <span className="text-gray-500"> g</span>
        </div>
      </div>
      {result.ingredients && result.ingredients.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium mb-1">Ingredients</h3>
          <div className="flex flex-wrap gap-1">
            {result.ingredients.map((ing, i) => (
              <span key={i} className="bg-gray-100 text-sm px-2 py-1 rounded-full">{ing}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}