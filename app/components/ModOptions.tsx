'use client'

interface ModOptionsProps {
  damageMultiplier: number
  setDamageMultiplier: (value: number) => void
  speedLevel: number
  setSpeedLevel: (value: number) => void
  isModActive: boolean
  setIsModActive: (value: boolean) => void
}

export default function ModOptions({
  damageMultiplier,
  setDamageMultiplier,
  speedLevel,
  setSpeedLevel,
  isModActive,
  setIsModActive,
}: ModOptionsProps) {
  const speedLabels = {
    1: 'Стандартная',
    2: 'Быстрая',
    3: 'Очень быстрая',
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl">
      <h2 className="text-3xl font-bold mb-6 text-blue-400">Настройки мода</h2>

      {/* Mod Status */}
      <div className="mb-8 pb-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-1">Статус мода</h3>
            <p className="text-sm text-gray-400">
              {isModActive ? 'Активирован' : 'Деактивирован'}
            </p>
          </div>
          <button
            onClick={() => setIsModActive(!isModActive)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
              isModActive
                ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/50'
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {isModActive ? 'Активен' : 'Выключен'}
          </button>
        </div>
      </div>

      {/* Damage Multiplier */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold">Множитель урона</h3>
          <span className="text-2xl font-bold text-orange-400">
            {damageMultiplier.toFixed(1)}x
          </span>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          Увеличивает урон, наносимый ботами-тимейтами врагам
        </p>
        <input
          type="range"
          min="1"
          max="5"
          step="0.1"
          value={damageMultiplier}
          onChange={(e) => setDamageMultiplier(parseFloat(e.target.value))}
          className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-6
                     [&::-webkit-slider-thumb]:h-6
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-orange-500
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:shadow-lg
                     [&::-webkit-slider-thumb]:shadow-orange-500/50
                     [&::-webkit-slider-thumb]:hover:bg-orange-400
                     [&::-webkit-slider-thumb]:transition-all"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>1.0x</span>
          <span>2.5x</span>
          <span>5.0x</span>
        </div>
      </div>

      {/* Movement Speed */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold">Скорость передвижения</h3>
          <span className="text-2xl font-bold text-purple-400">
            {speedLabels[speedLevel as keyof typeof speedLabels]}
          </span>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          Управляет скоростью передвижения ботов-тимейтов
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((level) => (
            <button
              key={level}
              onClick={() => setSpeedLevel(level)}
              className={`py-3 px-4 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                speedLevel === level
                  ? 'bg-purple-600 shadow-lg shadow-purple-600/50'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <div className="text-xs text-gray-300 mb-1">Уровень {level}</div>
              <div className="text-sm">
                {speedLabels[level as keyof typeof speedLabels]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-8 p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
        <h4 className="font-semibold mb-2 text-blue-300">ℹ️ Информация</h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Множитель урона: {damageMultiplier.toFixed(1)}x</li>
          <li>
            • Скорость: {speedLabels[speedLevel as keyof typeof speedLabels]}
          </li>
          <li>
            • Модификаторы применяются ко всем ботам-тимейтам в команде
          </li>
        </ul>
      </div>
    </div>
  )
}
