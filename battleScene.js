const battleBackgroundImage = new Image()
battleBackgroundImage.src = `./img/battleBackground.png`
const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage
})
let vikingMan
let dracolich
let draggle
let emby
let renderedSprites
let battleAnimationId
let queue
let demonBoy
let beastBoy
let myEquippedMonster = [emby = new Monster(monsters.Emby)]
const map1Monsters = [beastBoy = new Monster(monsters.BeastBoy), demonBoy = new Monster(monsters.DemonBoy),
dracolich = new Monster(monsters.Dracolich), vikingMan = new Monster(monsters.VikingMan), draggle = new Monster(monsters.Draggle)]
let currentMapMonsters = map1Monsters

function initBattle(mapMonsters, myEquippedMonster, number, variation) {
  var container = document.querySelector('.container');

  container.style.opacity = '0';


  container.style.pointerEvents = 'none';

  document.querySelector('#userInterface').style.display = 'block'
  document.querySelector('#dialogueBox').style.display = 'none'
  document.querySelector('#enemyHealthBar').style.width = '100%'
  document.querySelector('#playerHealthBar').style.width = '100%'
  document.querySelector('#attacksBox').replaceChildren()
  let enemyHealthBar = document.querySelector('#enemyHealthBar')
  let enemyLevel = document.querySelector(`#enemyLevel`)
  let myHealthBar = document.querySelector('#playerHealthBar')
  let playerLevel = document.querySelector('#playerLevel')

  funMonster = myEquippedMonster[0]
  let myEquippedMonsterHealth = funMonster.health
  let myEquippedMonsterAttackStat = funMonster.attackStat
  let myEquippedMonsterDefense = funMonster.defense
  let myEquippedMonsterxpYield = funMonster.xpYield


  funMonster.opacity = 1
  funMonster.health += (funMonster.level * funMonster.healthMultiplier)
  funMonster.attackStat += (funMonster.level * funMonster.attackMultiplier)
  funMonster.defense += (funMonster.level * funMonster.defenseMultiplier)
  funMonster.xpYield += (funMonster.level * funMonster.xpYieldMultiplier)

  let holderVariable = [Math.floor(Math.random() * mapMonsters.length)]
  enemyMonster = mapMonsters[holderVariable]
  let restoreEnemyHealth = enemyMonster.health
  let enemyMonsterAttackStat = enemyMonster.attackStat
  let enemyMonsterDefense = enemyMonster.defense
  let enemyMonsterxpYield = enemyMonster.xpYield

  document.querySelector('#enemyName').innerText = enemyMonster.name

  enemyMonster.position.x = mapMonsters[holderVariable].position.x
  enemyMonster.position.y = mapMonsters[holderVariable].position.y
  enemyMonster.level = number + Math.floor(Math.random() * variation)
  enemyMonster.opacity = 1
  enemyMonster.health += (enemyMonster.level * enemyMonster.healthMultiplier)
  enemyMonster.attackStat += (enemyMonster.level * enemyMonster.attackMultiplier)
  enemyMonster.defense += (enemyMonster.level * enemyMonster.defenseMultiplier)
  enemyMonster.xpYield += (enemyMonster.level * enemyMonster.xpYieldMultiplier)

  renderedSprites = [enemyMonster, funMonster]

  queue = []

  enemyLevel.innerText = 'Lv.' + enemyMonster.level
  playerLevel.innerText = 'Lv.5'
  funMonster.attacks.forEach((attack) => {
    const button = document.createElement('button')
    button.innerHTML = attack.name
    document.querySelector('#attacksBox').append(button)
  })


  // our event listeners for our buttons (attack)
  document.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML]
      funMonster.attack({
        attacker: funMonster,
        attack: selectedAttack,
        recipient: enemyMonster,
        renderedSprites
      })
      gsap.to(enemyHealthBar, {
        width: enemyMonster.health / (restoreEnemyHealth + (enemyMonster.level * enemyMonster.healthMultiplier)) * 100 + '%',
      })
      if (enemyMonster.health <= 0) {
        queue.push(() => {
          enemyMonster.faint()
        })
        queue.push(() => {
          // fade back to black
          gsap.to('#overlappingDiv', {
            opacity: 1,
            onComplete: () => {
              cancelAnimationFrame(battleAnimationId)
              animate()
              document.querySelector('#userInterface').style.display = 'none'
              funMonster.xpAmount += enemyMonster.xpYield
              enemyMonster.health = restoreEnemyHealth
              enemyMonster.attackStat = enemyMonsterAttackStat
              enemyMonster.defense = enemyMonsterDefense
              enemyMonster.xpYield = enemyMonsterxpYield
              funMonster.health = myEquippedMonsterHealth
              funMonster.attackStat = myEquippedMonsterAttackStat
              funMonster.defense = myEquippedMonsterDefense
              funMonster.xpYield = myEquippedMonsterxpYield
              // Select the container div
              var container = document.querySelector('.container');

              // Reset the opacity to fully opaque
              container.style.opacity = '1';

              // Allow pointer events on the container
              container.style.pointerEvents = 'auto';

              gsap.to('#overlappingDiv', {
                opacity: 0
              })
              battle.initiated = false
              audio.Map.play()
            }
          })
        })
      }

      // enemyMonster or enemy attacks right here
      const randomAttack =
        enemyMonster.attacks[Math.floor(Math.random() * enemyMonster.attacks.length)]

      queue.push(() => {
        enemyMonster.attack({
          attacker: enemyMonster,
          attack: randomAttack,
          recipient: funMonster,
          renderedSprites
        })
        gsap.to(myHealthBar, {
          width: funMonster.health / (myEquippedMonsterHealth) * 100 + '%'
        })

        if (funMonster.health <= 0) {
          queue.push(() => {
            funMonster.faint(),

              enemyMonster = restoreEnemyHealth
            enemyMonster.attackStat = enemyMonsterAttackStat
            enemyMonster.defense = enemyMonsterDefense
            enemyMonster.xpYield = enemyMonsterxpYield
            funMonster.health = myEquippedMonsterHealth
            funMonster.health = myEquippedMonsterHealth
            funMonster.attackStat = myEquippedMonsterAttackStat
            funMonster.defense = myEquippedMonsterDefense
            funMonster.xpYield = myEquippedMonsterxpYield

            // Select the container div
            var container = document.querySelector('.container');

            // Reset the opacity to fully opaque
            container.style.opacity = '1';

            // Allow pointer events on the container
            container.style.pointerEvents = 'auto';
          })

          queue.push(() => {
            // fade back to black
            gsap.to('#overlappingDiv', {
              opacity: 1,
              onComplete: () => {
                cancelAnimationFrame(battleAnimationId)
                animate()
                document.querySelector('#userInterface').style.display = 'none'

                gsap.to('#overlappingDiv', {
                  opacity: 0
                })

                battle.initiated = false
                audio.Map.play()
              }
            })
          })
        }
      })
    })

    button.addEventListener('mouseenter', (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML]
      document.querySelector('#attackType').innerHTML = selectedAttack.type
      document.querySelector('#attackType').style.color = selectedAttack.color
    })

    button.addEventListener(`mouseleave`, (button) => {
      document.querySelector('#attackType').innerHTML = 'Attack Type'
      document.querySelector('#attackType').style.color = 'black'
    })
  })
}

function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle)
  battleBackground.draw()
  renderedSprites.forEach((sprite) => {
    sprite.draw()
  })
}

// initBattle()
// animateBattle()


document.querySelector('#dialogueBox').addEventListener('click', (e) => {

  if (queue.length > 0) {
    queue[0]()
    queue.shift()
  } else e.currentTarget.style.display = 'none'
})
