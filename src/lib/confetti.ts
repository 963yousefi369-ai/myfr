export async function fireConfetti() {
  const { default: confetti } = await import('canvas-confetti')
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#1A56DB', '#0891B2', '#D97706', '#059669', '#F59E0B'],
  })
}

export async function fireAddToCartConfetti() {
  const { default: confetti } = await import('canvas-confetti')
  const count = 200
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  }

  function fire(particleRatio: number, opts: any) {
    confetti({
      ...defaults,
      particleCount: Math.floor(count * particleRatio),
      ...opts,
    })
  }

  fire(0.25, { spread: 26, startVelocity: 55, colors: ['#1A56DB', '#0891B2'] })
  fire(0.2, { spread: 60, colors: ['#D97706', '#F59E0B'] })
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#059669', '#10B981'] })
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors: ['#1A56DB'] })
  fire(0.1, { spread: 120, startVelocity: 45, colors: ['#D97706'] })
}

export async function fireSuccessConfetti() {
  const { default: confetti } = await import('canvas-confetti')
  const duration = 3 * 1000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    const timeLeft = animationEnd - Date.now()
    if (timeLeft <= 0) return clearInterval(interval)
    const particleCount = 50 * (timeLeft / duration)
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#1A56DB', '#0891B2', '#059669'],
    })
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#D97706', '#F59E0B', '#1A56DB'],
    })
  }, 250)
}
