export type Location = 'base' | 'deployZone' | 'battlefieldA' | 'battlefieldB' | 'hand'
export type CardType = 'hero' | 'signature' | 'hybrid' | 'generic' | 'spell' | 'item' | 'artifact'
export type PlayerId = 'player1' | 'player2'

// Color System Types
export type Color = 'red' | 'blue' | 'white' | 'black' | 'green'
export type ColorCombo = Color | `${Color}${Color}` | `${Color}${Color}${Color}` // Single, dual, or triple color

// Rarity System
export type Rarity = 'common' | 'uncommon' | 'rare'

// Rune System Types - Simplified: Runes are just color requirements
export type RuneColor = Color // R, W, U, B, G

export interface RunePool {
  runes: RuneColor[] // Array of permanent runes (e.g., ['red', 'red', 'white', 'white', 'blue', 'green', 'black'])
  temporaryRunes: RuneColor[] // Temporary runes that clear at end of turn (like Dark Ritual)
}

// Seal - Permanent rune generator (like mana rocks in MTG)
export interface Seal {
  id: string
  name: string
  color: RuneColor // Color of rune it generates each turn
  owner: PlayerId
}

// Maximum colors allowed per deck
// Increased to 4 to enable 3-4 color strategies (design advantage of 2-battlefield structure)
export const MAX_COLORS_PER_DECK = 4

// Archetype Types
export type Archetype = 
  // Two-color guilds (primary)
  | 'guild-rg'   // Red-Green: Efficient creatures + cleave
  | 'guild-wg'   // White-Green: Efficient creatures + tower protection
  | 'guild-wu'   // White-Blue: Spellcaster + tower protection
  | 'guild-ub'   // Blue-Black: Spellcaster + removal
  | 'guild-br'   // Black-Red: Removal + aggro
  | 'guild-rw'   // Red-White Legion: Go-wide (special strong 2-color)
  // Three-color wedges (splash)
  | 'wedge-rgw'  // Naya
  | 'wedge-gwu'  // Bant: Midrange value
  | 'wedge-wub'  // Esper: Control/finishers
  | 'wedge-ubr'  // Grixis: Spellcaster control
  | 'wedge-brg'  // Jund: Midrange value
  | 'five-color' // Rainbow (high-roll deck)
  // Legacy (for compatibility)
  | 'rw-legion'
  | 'ub-control'
  | 'ubg-control'
  | 'all'

export interface BaseCard {
  id: string
  name: string
  description: string
  cardType: CardType
  rarity?: Rarity // Card rarity (defaults to 'common' if not specified)
  manaCost?: number // Cost to play this card (uses mana)
  colors?: Color[] // Colors required to cast in lane with matching hero color
  consumesRunes?: boolean // If true, casting this card consumes runes from the pool
  bloodMagic?: BloodMagicConfig // Built-in Blood Magic for GBR/GBR+ cards
}

export interface Item {
  id: string
  name: string
  description: string
  cost: number
  tier: 1 | 2
  hpBonus?: number
  attackBonus?: number
  goldPerTurn?: number
  armor?: number // Tower armor bonus (for Tower Shield)
  // Special abilities (for future implementation)
  hasActivatedAbility?: boolean
  activatedAbilityDescription?: string
  specialEffects?: string[] // e.g., ['cleave', 'siege', 'regeneration', 'taunt', 'retaliate', 'tower_armor', 'create_unit', 'refresh_cooldowns']
}

export type BattlefieldId = 'battlefieldA' | 'battlefieldB'
export type BattlefieldBuffEffectType = 'combat' | 'spell' | 'mana' | 'tower' | 'gold' | 'unit_power' | 'death_counter' | 'quick_deploy'

export interface BattlefieldBuff {
  id: string
  name: string
  description: string
  cost: number
  battlefieldId: BattlefieldId
  playerId: PlayerId
  effectType: BattlefieldBuffEffectType
  effectValue: number
}

// Shop item type - can be either a hero item or a battlefield buff template
export type ShopItem = Item | (Omit<BattlefieldBuff, 'id' | 'battlefieldId' | 'playerId'> & { type: 'battlefieldBuff' })

export type TurnPhase = 'deploy' | 'play' | 'combatA' | 'adjust' | 'combatB'

// Combat System Types
export type AttackTargetType = 'unit' | 'tower'

export interface AttackTarget {
  type: AttackTargetType
  targetId?: string // Unit ID if type is 'unit', undefined if 'tower'
  targetSlot?: number // Slot number for tower targeting (positional reference)
}

export interface CombatAction {
  attackerId: string // ID of the attacking unit
  attackerSlot: number // Slot position of attacker
  target: AttackTarget // What the attacker is targeting
}

export interface GameMetadata {
  currentTurn: number
  activePlayer: PlayerId
  currentPhase: TurnPhase
  player1Gold: number
  player2Gold: number
  // Legacy mana system (kept for backward compatibility during migration)
  player1Mana: number // Current mana
  player2Mana: number
  player1MaxMana: number // Maximum mana (increases by 1 per turn)
  player2MaxMana: number
  // Rune system
  player1RunePool: RunePool
  player2RunePool: RunePool
  // Seals - Permanent rune generators (like mana rocks)
  player1Seals: Seal[]
  player2Seals: Seal[]
  player1NexusHP: number
  player2NexusHP: number
  towerA_player1_HP: number
  towerA_player2_HP: number
  towerB_player1_HP: number
  towerB_player2_HP: number
  // Tower armor: Damage reduction for each tower (reduces incoming damage before applying to HP)
  towerA_player1_Armor: number
  towerA_player2_Armor: number
  towerB_player1_Armor: number
  towerB_player2_Armor: number
  player1Tier: 1 | 2
  player2Tier: 1 | 2
  // Death cooldown: Record of card ID -> cooldown counter (starts at 2, decreases by 1 each turn, 0 = ready)
  // Using Record instead of Map for JSON serialization
  deathCooldowns: Record<string, number>
  // Movement tracking: Track if each player has moved a hero to base this turn
  player1MovedToBase: boolean
  player2MovedToBase: boolean
  // Deploy phase tracking: How many heroes each player has deployed this turn
  player1HeroesDeployedThisTurn: number
  player2HeroesDeployedThisTurn: number
  // Played cards: Record of card ID -> boolean (for toggle X overlay in base - works for any card type)
  // Using Record instead of Set for JSON serialization
  playedSpells: Record<string, boolean>
  // Battlefield buffs: Permanent upgrades that only affect owner's units in that battlefield
  player1BattlefieldBuffs: BattlefieldBuff[]
  player2BattlefieldBuffs: BattlefieldBuff[]
  // Battlefield death counters: For RW-bf2 (death counter -> draw card mechanic)
  // Format: `player-battlefield` -> count
  battlefieldDeathCounters: Record<string, number>
  // Action: Which player can act right now (current turn)
  actionPlayer: PlayerId | null
  // Initiative: Which player has initiative (will have action first next turn)
  // Initiative is separate from action - you can have action but not initiative
  initiativePlayer: PlayerId | null
  // Hero ability cooldowns: Record of hero ID -> turn last used (to track cooldowns)
  // Format: `heroId` -> turn number
  heroAbilityCooldowns: Record<string, number>
  // Pass tracking: Track if each player has passed this turn (for combat trigger)
  player1Passed: boolean
  player2Passed: boolean
  // Stunned heroes: Record of hero ID -> boolean (stunned heroes don't deal combat damage, only receive it)
  // Using Record instead of Set for JSON serialization
  stunnedHeroes: Record<string, boolean>
  // Turn 1 deployment state: Track turn 1 deployment phase (Artifact-style counter-deployment)
  // 'p1_lane1' -> Player 1 deploys hero to lane 1 (battlefieldA)
  // 'p2_lane1' -> Player 2 can counter-deploy to lane 1 (battlefieldA)
  // 'p2_lane2' -> Player 2 deploys hero to lane 2 (battlefieldB)
  // 'p1_lane2' -> Player 1 can counter-deploy to lane 2 (battlefieldB)
  // 'complete' -> Turn 1 deployment done
  turn1DeploymentPhase?: 'p1_lane1' | 'p2_lane1' | 'p2_lane2' | 'p1_lane2' | 'complete'
  // Spellcaster synergy tracking
  player1SpellsCastThisTurn: number
  player2SpellsCastThisTurn: number
  // Evolve/diversity tracking
  player1ColorsPlayedThisTurn: Color[]
  player2ColorsPlayedThisTurn: Color[]
  player1CardTypesPlayedThisTurn: CardType[]
  player2CardTypesPlayedThisTurn: CardType[]
  // Blood Magic: Pending tower damage from blood magic usage (applied during deployment)
  pendingBloodMagicCost?: number
  // Hero counters: Track counters on specific heroes (e.g., WB hero life-spent counters)
  heroCounters?: Record<string, number> // Format: heroId -> counter count
}

// Hero Ability Types
export type HeroAbilityEffectType = 
  | 'buff_units' // Buff all units
  | 'damage_target' // Deal damage to target
  | 'draw_card' // Draw card(s)
  | 'heal_target' // Heal target
  | 'move_hero' // Move hero
  | 'create_unit' // Create/spawn a unit
  | 'steal_unit' // Take control of enemy unit
  | 'move_cross_battlefield' // Move hero across battlefields
  | 'rune_to_damage' // Spend runes to deal tower damage (combo payoff)
  | 'sacrifice_unit' // Sacrifice a unit for effect
  | 'custom' // Custom effect

export type HeroAbilityTrigger = 
  | 'on_deploy'
  | 'on_spell_cast' // New: Triggers when you cast a spell
  | 'start_of_turn'
  | 'passive'
  | 'activated' // Manual activation with mana cost

// Chromatic Payoff System - Green's rune identity
export interface ChromaticPayoff {
  triggerColors: RuneColor[] // Which colors trigger the payoff (colors this hero doesn't produce)
  effectType: 'damage' | 'heal' | 'buff' | 'draw' | 'mana' | 'rune'
  effectValue: number // Magnitude of the bonus
  perRuneSpent?: boolean // If true, triggers once per rune spent (default: false = once per spell)
  description: string // Display text for the payoff
}

// Blood Magic System - Black's rune identity
export interface BloodMagicConfig {
  enabled: boolean
  costReduction?: number // Reduce all costs by this amount (min 1)
  maxSubstitutions?: number // Max runes you can substitute (undefined = unlimited)
  description: string
}

export interface HeroAbility {
  name: string
  description: string
  trigger?: HeroAbilityTrigger // When the ability triggers (defaults to 'activated')
  manaCost: number // Typically 1
  cooldown: number // Turns until can use again (typically 2-3)
  effectType: HeroAbilityEffectType
  effectValue?: number // Value for the effect (damage, heal amount, etc.)
  startsOnCooldown?: boolean // If true, ability starts on cooldown at game start
  runeCost?: RuneColor[] // Rune cost for ability (e.g., ['black', 'black', 'black'] for 3 any-color runes)
  // Spellcaster-specific fields
  manaRestore?: number // Restore N mana when you cast a spell
  spellCostReduction?: number // Your spells cost N less
  spellDamageBonus?: number // Your spells deal +N damage
  // Chromatic Payoff field - Green's unique rune identity
  chromaticPayoff?: ChromaticPayoff // Triggers when player spends off-color runes
  // Blood Magic field - Black's unique rune identity
  bloodMagic?: BloodMagicConfig // Pay life for missing runes
  // For tracking cooldown: Record<heroId, turnLastUsed>
  // Stored in GameMetadata.heroAbilityCooldowns
}

export interface Hero extends BaseCard {
  cardType: 'hero'
  colors: Color[] // Hero's color(s) - single color for monocolor heroes
  attack: number
  health: number
  maxHealth: number // Track max health for restoration
  currentHealth: number // Track current health for combat
  temporaryHP?: number // Temporary HP bonus (resets at end of turn)
  temporaryAttack?: number // Temporary attack bonus (resets at end of turn)
  supportEffect?: string
  location: Location
  owner: PlayerId
  slot?: number // Slot position 1-5 on battlefield
  equippedItems?: string[] // Array of item IDs
  attachedEquipment?: string[] // IDs of equipment artifacts attached to this hero
  signatureCardId?: string // ID of the signature card for this hero (2 copies added to deck)
  bonusVsHeroes?: number // Bonus damage when attacking heroes (e.g., +3 for assassins)
  ability?: HeroAbility // Hero's activated ability (mana cost + cooldown)
}

export interface SignatureCard extends BaseCard {
  cardType: 'signature'
  heroName: string // Which hero this card belongs to
  attack: number
  health: number
  maxHealth: number
  currentHealth: number
  location: Location
  owner: PlayerId
  slot?: number
  effect?: string // Special effect when played
}

export interface HybridCard extends BaseCard {
  cardType: 'hybrid'
  attack: number
  health: number
  maxHealth: number
  currentHealth: number
  baseBuff?: string // Effect when in base
  location: Location
  owner: PlayerId
  slot?: number
}

export interface GenericUnit extends BaseCard {
  cardType: 'generic'
  attack: number
  health: number
  maxHealth: number
  currentHealth: number
  temporaryHP?: number // Temporary HP bonus (resets at end of turn)
  temporaryAttack?: number // Temporary attack bonus (resets at end of turn)
  location: Location
  owner: PlayerId
  slot?: number
  stackedWith?: string // ID of generic unit this is stacked with (if any)
  stackPower?: number // Combined power if stacked
  stackHealth?: number // Combined health if stacked
  rangedAttack?: number // If set, this unit can attack from base/deployZone, dealing damage evenly to both towers
  attachedEquipment?: string[] // IDs of equipment artifacts attached to this unit
  // Evolve mechanics
  evolveThreshold?: number // Number of different colors/types needed to evolve
  evolveBonus?: {
    attack?: number
    health?: number
    abilities?: string[]
  }
  isEvolved?: boolean // Has this unit evolved this turn?
}

// Spell Effect Types
export type SpellEffectType = 
  | 'damage' // Deal damage to target
  | 'aoe_damage' // Area of effect damage
  | 'board_wipe' // Destroy all units/heroes
  | 'targeted_damage' // Damage to specific target(s)
  | 'multi_target_damage' // Choose multiple separate targets (e.g., "Deal 2 damage to up to 2 targets")
  | 'chain_damage' // Sequential damage to adjacent units (e.g., "3 damage, then 2 to adjacent, then 1")
  | 'split_damage' // Distribute damage among targets (e.g., "Deal 3 damage split among up to 3 targets")
  | 'adjacent_damage' // Damage to adjacent units
  | 'all_units_damage' // Damage to all units
  | 'stun' // Stun target (cannot attack this turn)
  | 'damage_and_stun' // Deal damage and stun
  | 'front_damage' // Damage to enemy in front of caster's hero
  | 'swap_heroes' // Swap hero positions
  | 'add_temporary_runes' // Add temporary runes (like Dark Ritual)
  | 'create_seal' // Create a permanent seal/mana rock
  | 'add_permanent_rune' // Add permanent rune to pool
  | 'return_to_base' // Returns target card to its owner's base
  | 'draw_and_heal' // Draws cards and heals
  | 'steal_unit' // Take control of target enemy unit

export interface SpellEffect {
  type: SpellEffectType
  damage?: number // Damage amount
  targetCount?: number // For multi-target spells: how many targets can be selected
  maxTargets?: number // Maximum number of targets for split/multi-target
  chainDamages?: number[] // For chain damage: array of damage values [3, 2, 1]
  affectsHeroes?: boolean // Does it affect heroes?
  affectsUnits?: boolean // Does it affect units?
  affectsOwnUnits?: boolean // For board wipes: affects own units too?
  affectsEnemyUnits?: boolean // For board wipes: affects enemy units?
  adjacentCount?: number // For adjacent damage: how many adjacent units
  stunDuration?: number // Turns stunned (default 1)
  // Rune generation effects
  runeColors?: RuneColor[] // Colors of runes to add (e.g., ['black', 'black', 'black'] for Dark Ritual)
  sealColor?: RuneColor // Color of seal to create
  // Draw and heal effects
  drawCount?: number // Number of cards to draw
  healAmount?: number // Amount of life to gain
}

export interface SpellCard extends BaseCard {
  cardType: 'spell'
  location: Location
  owner: PlayerId
  effect: SpellEffect
  description: string // Flavor text describing the spell
  initiative?: boolean // Does this spell give initiative (like Artifact)?
  refundMana?: number // Mana to refund after casting (for "free spell" mechanic inspired by Urza block)
}

export interface ItemCard extends BaseCard {
  cardType: 'item'
  itemId: string // Reference to the Item template
  location: Location
  owner: PlayerId
}

// Artifact Effect Types
export type ArtifactEffectType = 
  | 'mana_generation' // Generate mana each turn
  | 'damage_amplifier' // Increase unit attack damage
  | 'spell_amplifier' // Increase spell damage
  | 'defensive_buff' // Increase unit health/defense
  | 'rune_generation' // Generate runes each turn
  | 'tower_armor' // Increase tower armor
  | 'card_draw' // Draw cards each turn
  | 'creep_modifier' // Modifies creep spawn stats
  | 'tower_heal' // Heals towers at start of turn
  | 'cleave_aura' // Grants cleave to all allies
  | 'target_buff' // Single-target buff
  | 'life_loss_draw' // Lose life but draw card
  | 'token_generation' // Spawns tokens each turn
  | 'equipment' // Can be attached to units
  | 'saga' // Saga-like artifact with multiple chapters

export interface ArtifactCard extends BaseCard {
  cardType: 'artifact'
  location: 'base' // Artifacts always live in base
  owner: PlayerId
  effectType: ArtifactEffectType
  effectValue: number // Value for the effect (e.g., +1 attack, +1 mana, etc.)
  // Equipment-specific fields
  attachedToUnitId?: string // ID of unit this equipment is attached to (undefined if in base)
  equipCost?: number // Mana cost to re-equip after unit dies
  equipmentBonuses?: {
    attack?: number
    health?: number
    maxHealth?: number
    abilities?: string[] // e.g., ['cleave', 'taunt', 'flying']
  }
  // Saga-specific fields
  sagaCounters?: number // Current chapter number (1, 2, or 3). Artifact is destroyed when it reaches 3
  sagaEffects?: {
    chapter1?: string // Effect description for chapter 1
    chapter2?: string // Effect description for chapter 2
    chapter3?: string // Effect description for chapter 3
  }
}

export type Card = Hero | SignatureCard | HybridCard | GenericUnit | SpellCard | ItemCard | ArtifactCard

export interface Battlefield {
  player1: Card[]
  player2: Card[]
}

export interface BattlefieldDefinition {
  id: string
  name: string
  description: string
  colors: Color[] // Battlefield's color(s)
  staticAbility: string // Description of the static ability
  staticAbilityId: string // Identifier for the ability type (e.g., 'same-color-buff', 'gold-on-kill')
}

// Draft System Types
export type DraftPickType = 'hero' | 'card' | 'battlefield'

// Draft pool item (what's available to pick)
export interface DraftPoolItem {
  id: string
  type: DraftPickType
  item: Hero | BaseCard | BattlefieldDefinition
  packNumber: number
}

// Draft pack
export interface DraftPack {
  packNumber: number
  heroes: Hero[] // 2 heroes
  cards: BaseCard[] // 8-9 cards
  battlefields: BattlefieldDefinition[] // 1 battlefield
  remainingItems: DraftPoolItem[] // Items not yet picked
  picks: DraftPick[] // Picks made from this pack
  isComplete: boolean
}

// Draft pick record
export interface DraftPick {
  pickNumber: number
  packNumber: number
  player: PlayerId
  pickType: DraftPickType
  pick: Hero | BaseCard | BattlefieldDefinition
  timestamp: number // For ordering
}

// Drafted items (all picks, not final selections)
export interface DraftedItems {
  heroes: Hero[]
  cards: BaseCard[]
  battlefields: BattlefieldDefinition[]
}

// Final selections (chosen after draft)
export interface FinalDraftSelection {
  heroes: Hero[] // Exactly 4
  cards: BaseCard[] // Exactly 12
  battlefield: BattlefieldDefinition // Exactly 1
}

// Updated DraftState - Round-based system
export interface DraftState {
  currentRound: number // Current round number
  currentPack: DraftPack | null // Current pack being drafted from
  currentPicker: PlayerId
  pickNumber: number // Overall pick number
  picksRemainingThisTurn: number // How many picks the current player has left this turn
  roundPicksRemaining: number // Picks remaining in current round
  roundPattern: number // Which pattern we're in (0 = P1 P2 P2, 1 = P2 P1 P1 P2)
  
  // All picks (not final selections) - visible to both players
  player1Drafted: DraftedItems
  player2Drafted: DraftedItems
  
  // Final selections (chosen after draft, private until game starts)
  player1Final: FinalDraftSelection | null
  player2Final: FinalDraftSelection | null
  
  isDraftComplete: boolean // Both players have enough items
  isSelectionComplete: boolean // Final selections made
}

export interface GameState {
  player1Hand: Card[]
  player2Hand: Card[]
  player1Base: Card[]
  player2Base: Card[]
  player1DeployZone: Card[]
  player2DeployZone: Card[]
  battlefieldA: Battlefield
  battlefieldB: Battlefield
  cardLibrary: BaseCard[] // All available cards in the library (for sidebar)
  metadata: GameMetadata
  // Draft system (to be implemented)
  draftState?: DraftState
  player1DraftedHeroes?: Hero[]
  player2DraftedHeroes?: Hero[]
  player1Battlefields?: BattlefieldDefinition[]
  player2Battlefields?: BattlefieldDefinition[]
}

export const BATTLEFIELD_SLOT_LIMIT = 5
export const TOWER_HP = 20
export const NEXUS_HP = 30
export const STARTING_GOLD = 5

// Draft System Constants
export const DECK_SIZE = 30
export const HEROES_REQUIRED = 4
export const CARDS_REQUIRED = 30 // 22 drafted + 8 signature cards (2 copies × 4 heroes = 8 signature cards, auto-added when heroes are drafted)
export const BATTLEFIELDS_REQUIRED = 1
export const SIGNATURE_CARDS_PER_HERO = 2 // 2 copies of each hero's signature card are added to the deck

export const DRAFT_PACKS = 5
export const PICKS_PER_PACK = 7
export const TOTAL_PICKS_PER_PLAYER = DRAFT_PACKS * PICKS_PER_PACK // 28

export const HEROES_PER_PACK = 3
export const CARDS_PER_PACK = 15
export const BATTLEFIELDS_PER_PACK = 3
export const ITEMS_PER_PACK = HEROES_PER_PACK + CARDS_PER_PACK + BATTLEFIELDS_PER_PACK // 21

// Pick distribution expectations
export const EXPECTED_HERO_PICKS = 4 // Required, but can draft 2-6
export const EXPECTED_BATTLEFIELD_PICKS = 1 // Required, but can draft 0-3
export const EXPECTED_CARD_PICKS = 12 // For deck, but will draft more for hate/specing
