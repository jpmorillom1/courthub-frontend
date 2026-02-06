export function SportSelector({ sports, onSelect }) {
  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {sports.map((sport) => (
        <button
          key={sport.id}
          onClick={() => onSelect(sport.id)}
          className="group bg-white rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border-4 border-white hover:border-[#cbab42]"
        >
          <div className="h-48 overflow-hidden">
            <img
              src={sport.image}
              alt={sport.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </div>
          <div className="p-6 text-center">
            <h3 className="text-2xl font-black uppercase tracking-tight text-gray-800">
              {sport.name}
            </h3>
          </div>
        </button>
      ))}
    </div>
  );
}
