'use client'

import { useState, useEffect, useRef } from 'react'

interface Bot {
  id: number
  name: string
  x: number
  y: number
  health: number
  maxHealth: number
  targetX: number
  targetY: number
  isAttacking: boolean
}

interface Enemy {
  id: number
  x: number
  y: number
  health: number
  maxHealth: number
}

interface GameSimulationProps {
  damageMultiplier: number
  speedLevel: number
  isModActive: boolean
}

export default function GameSimulation({
  damageMultiplier,
  speedLevel,
  isModActive,
}: GameSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [bots, setBots] = useState<Bot[]>([
    {
      id: 1,
      name: 'Бот-1',
      x: 100,
      y: 200,
      health: 100,
      maxHealth: 100,
      targetX: 100,
      targetY: 200,
      isAttacking: false,
    },
    {
      id: 2,
      name: 'Бот-2',
      x: 100,
      y: 300,
      health: 100,
      maxHealth: 100,
      targetX: 100,
      targetY: 300,
      isAttacking: false,
    },
    {
      id: 3,
      name: 'Бот-3',
      x: 100,
      y: 400,
      health: 100,
      maxHealth: 100,
      targetX: 100,
      targetY: 400,
      isAttacking: false,
    },
  ])
  const [enemies, setEnemies] = useState<Enemy[]>([
    { id: 1, x: 600, y: 250, health: 100, maxHealth: 100 },
    { id: 2, x: 600, y: 350, health: 100, maxHealth: 100 },
  ])
  const [totalDamageDealt, setTotalDamageDealt] = useState(0)
  const [kills, setKills] = useState(0)

  const getSpeedMultiplier = () => {
    if (!isModActive) return 1
    switch (speedLevel) {
      case 1:
        return 1
      case 2:
        return 1.75
      case 3:
        return 2.5
      default:
        return 1
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const gameLoop = setInterval(() => {
      // Clear canvas
      ctx.fillStyle = '#1a1a2e'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      ctx.strokeStyle = '#2a2a3e'
      ctx.lineWidth = 1
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, canvas.height)
        ctx.stroke()
      }
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(canvas.width, i)
        ctx.stroke()
      }

      // Update and draw bots
      setBots((prevBots) =>
        prevBots.map((bot) => {
          const nearestEnemy = enemies
            .filter((e) => e.health > 0)
            .reduce(
              (nearest, enemy) => {
                const dist = Math.hypot(enemy.x - bot.x, enemy.y - bot.y)
                return dist < nearest.dist ? { enemy, dist } : nearest
              },
              {
                enemy: null as Enemy | null,
                dist: Infinity,
              }
            )

          if (nearestEnemy.enemy && isModActive) {
            const dx = nearestEnemy.enemy.x - bot.x
            const dy = nearestEnemy.enemy.y - bot.y
            const distance = Math.hypot(dx, dy)

            if (distance > 150) {
              // Move towards enemy
              const speed = 2 * getSpeedMultiplier()
              bot.x += (dx / distance) * speed
              bot.y += (dy / distance) * speed
              bot.isAttacking = false
            } else {
              // Attack
              bot.isAttacking = true
            }
          } else if (!isModActive) {
            // Random movement when mod is off
            if (Math.random() > 0.98) {
              bot.targetX = Math.random() * 300
              bot.targetY = 100 + Math.random() * 400
            }
            const dx = bot.targetX - bot.x
            const dy = bot.targetY - bot.y
            const distance = Math.hypot(dx, dy)
            if (distance > 5) {
              bot.x += (dx / distance) * 1
              bot.y += (dy / distance) * 1
            }
            bot.isAttacking = false
          }

          // Draw bot
          ctx.fillStyle = bot.isAttacking ? '#ff6b6b' : '#4ecdc4'
          ctx.beginPath()
          ctx.arc(bot.x, bot.y, 15, 0, Math.PI * 2)
          ctx.fill()

          // Draw bot health bar
          ctx.fillStyle = '#333'
          ctx.fillRect(bot.x - 20, bot.y - 30, 40, 4)
          ctx.fillStyle = '#4ade80'
          ctx.fillRect(
            bot.x - 20,
            bot.y - 30,
            40 * (bot.health / bot.maxHealth),
            4
          )

          // Draw bot name
          ctx.fillStyle = '#fff'
          ctx.font = '10px Inter'
          ctx.textAlign = 'center'
          ctx.fillText(bot.name, bot.x, bot.y - 35)

          // Draw attack line
          if (bot.isAttacking && nearestEnemy.enemy) {
            ctx.strokeStyle = '#ff6b6b'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(bot.x, bot.y)
            ctx.lineTo(nearestEnemy.enemy.x, nearestEnemy.enemy.y)
            ctx.stroke()
          }

          return bot
        })
      )

      // Update and draw enemies
      setEnemies((prevEnemies) => {
        const updatedEnemies = prevEnemies.map((enemy) => {
          if (enemy.health <= 0) return enemy

          const attackingBots = bots.filter(
            (bot) =>
              bot.isAttacking &&
              Math.hypot(bot.x - enemy.x, bot.y - enemy.y) < 150
          )

          if (attackingBots.length > 0 && isModActive) {
            const baseDamage = 0.5
            const modifiedDamage = baseDamage * damageMultiplier
            enemy.health = Math.max(
              0,
              enemy.health - modifiedDamage * attackingBots.length
            )
            setTotalDamageDealt(
              (prev) => prev + modifiedDamage * attackingBots.length
            )

            if (enemy.health === 0) {
              setKills((prev) => prev + 1)
            }
          }

          // Draw enemy
          ctx.fillStyle = enemy.health > 0 ? '#e74c3c' : '#555'
          ctx.beginPath()
          ctx.arc(enemy.x, enemy.y, 20, 0, Math.PI * 2)
          ctx.fill()

          // Draw enemy health bar
          if (enemy.health > 0) {
            ctx.fillStyle = '#333'
            ctx.fillRect(enemy.x - 25, enemy.y - 35, 50, 5)
            ctx.fillStyle = '#f87171'
            ctx.fillRect(
              enemy.x - 25,
              enemy.y - 35,
              50 * (enemy.health / enemy.maxHealth),
              5
            )

            // Draw enemy health text
            ctx.fillStyle = '#fff'
            ctx.font = '10px Inter'
            ctx.textAlign = 'center'
            ctx.fillText(
              `${Math.ceil(enemy.health)}`,
              enemy.x,
              enemy.y - 40
            )
          } else {
            // Draw X for dead enemy
            ctx.strokeStyle = '#fff'
            ctx.lineWidth = 3
            ctx.beginPath()
            ctx.moveTo(enemy.x - 10, enemy.y - 10)
            ctx.lineTo(enemy.x + 10, enemy.y + 10)
            ctx.moveTo(enemy.x + 10, enemy.y - 10)
            ctx.lineTo(enemy.x - 10, enemy.y + 10)
            ctx.stroke()
          }

          return enemy
        })

        // Respawn enemies if all are dead
        const allDead = updatedEnemies.every((e) => e.health <= 0)
        if (allDead) {
          setTimeout(() => {
            setEnemies([
              {
                id: Date.now(),
                x: 600,
                y: 250,
                health: 100,
                maxHealth: 100,
              },
              {
                id: Date.now() + 1,
                x: 600,
                y: 350,
                health: 100,
                maxHealth: 100,
              },
            ])
          }, 2000)
        }

        return updatedEnemies
      })
    }, 1000 / 60)

    return () => clearInterval(gameLoop)
  }, [bots, enemies, damageMultiplier, speedLevel, isModActive])

  const resetSimulation = () => {
    setBots([
      {
        id: 1,
        name: 'Бот-1',
        x: 100,
        y: 200,
        health: 100,
        maxHealth: 100,
        targetX: 100,
        targetY: 200,
        isAttacking: false,
      },
      {
        id: 2,
        name: 'Бот-2',
        x: 100,
        y: 300,
        health: 100,
        maxHealth: 100,
        targetX: 100,
        targetY: 300,
        isAttacking: false,
      },
      {
        id: 3,
        name: 'Бот-3',
        x: 100,
        y: 400,
        health: 100,
        maxHealth: 100,
        targetX: 100,
        targetY: 400,
        isAttacking: false,
      },
    ])
    setEnemies([
      { id: Date.now(), x: 600, y: 250, health: 100, maxHealth: 100 },
      { id: Date.now() + 1, x: 600, y: 350, health: 100, maxHealth: 100 },
    ])
    setTotalDamageDealt(0)
    setKills(0)
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-purple-400">
          Симуляция боя
        </h2>
        <button
          onClick={resetSimulation}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all"
        >
          Сбросить
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={700}
        height={500}
        className="w-full rounded-lg border-2 border-gray-700 mb-6"
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">Множитель урона</div>
          <div className="text-2xl font-bold text-orange-400">
            {isModActive ? `${damageMultiplier.toFixed(1)}x` : '1.0x'}
          </div>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">Урон нанесён</div>
          <div className="text-2xl font-bold text-blue-400">
            {Math.floor(totalDamageDealt)}
          </div>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">Убийств</div>
          <div className="text-2xl font-bold text-green-400">{kills}</div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 p-4 bg-gray-900/30 rounded-lg border border-gray-700">
        <h3 className="font-semibold mb-3 text-gray-300">Легенда</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#4ecdc4]"></div>
            <span className="text-gray-400">Бот-тимейт (покой)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#ff6b6b]"></div>
            <span className="text-gray-400">Бот-тимейт (атака)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#e74c3c]"></div>
            <span className="text-gray-400">Враг</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#555]"></div>
            <span className="text-gray-400">Мёртвый враг</span>
          </div>
        </div>
      </div>

      {!isModActive && (
        <div className="mt-4 p-4 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
          <p className="text-yellow-300 text-sm">
            ⚠️ Мод деактивирован. Активируйте мод в настройках, чтобы увидеть
            эффекты модификаций.
          </p>
        </div>
      )}
    </div>
  )
}
