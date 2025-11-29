'use client'

import { useState, useEffect } from 'react'
import ModOptions from './components/ModOptions'
import GameSimulation from './components/GameSimulation'

export default function Home() {
  const [damageMultiplier, setDamageMultiplier] = useState(1.5)
  const [speedLevel, setSpeedLevel] = useState(1)
  const [isModActive, setIsModActive] = useState(false)

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            SmartTeammates
          </h1>
          <p className="text-xl text-gray-400">by Skyline</p>
          <p className="text-sm text-gray-500 mt-2">
            Мод для улучшения характеристик ботов-тимейтов
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ModOptions
            damageMultiplier={damageMultiplier}
            setDamageMultiplier={setDamageMultiplier}
            speedLevel={speedLevel}
            setSpeedLevel={setSpeedLevel}
            isModActive={isModActive}
            setIsModActive={setIsModActive}
          />
          <GameSimulation
            damageMultiplier={damageMultiplier}
            speedLevel={speedLevel}
            isModActive={isModActive}
          />
        </div>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>© 2024 SmartTeammates Mod by Skyline</p>
          <p className="mt-2">Версия 1.0.0</p>
        </footer>
      </div>
    </main>
  )
}
