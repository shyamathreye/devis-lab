// Word banks for Devi's Lab.
//
// Words are organised by LENGTH bucket (baby=3, kid=4, adult=5, thatha=6-7),
// NOT by theme. Themes mainly set the look & feel; for variety the games draw
// from one big shared rotation pool per bucket. THEME_WORDS only flavours the
// FIRST round of a session so it feels on-theme, then we range freely.
//
// Each entry: { word, emoji, clue }
//  - emoji  : the picture hint (must clearly match the word)
//  - clue   : a kid-friendly description that never contains the word itself
//             (used by the 3-stage Hint: clue -> say -> spell)

import { shuffle } from '../lib/scramble.js'

// ---------------------------------------------------------------------------
// Theme-flavoured words — used to bias the opening round of each game.
// ---------------------------------------------------------------------------
export const THEME_WORDS = {
  unicorn: {
    baby: [
      { word: 'bow', emoji: '🎀', clue: 'A pretty ribbon you tie in your hair.' },
      { word: 'gem', emoji: '💎', clue: 'A shiny, sparkly jewel.' },
      { word: 'hat', emoji: '🎩', clue: 'You wear this on your head.' },
      { word: 'key', emoji: '🔑', clue: 'It opens a lock or a door.' },
    ],
    kid: [
      { word: 'pony', emoji: '🐴', clue: 'A little baby horse.' },
      { word: 'star', emoji: '⭐', clue: 'It twinkles in the night sky.' },
      { word: 'wand', emoji: '🪄', clue: 'A magic stick that goes swish!' },
      { word: 'ring', emoji: '💍', clue: 'You wear it on your finger.' },
    ],
    adult: [
      { word: 'crown', emoji: '👑', clue: 'A queen or king wears it on their head.' },
      { word: 'fairy', emoji: '🧚', clue: 'A tiny magic person with wings.' },
      { word: 'candy', emoji: '🍬', clue: 'A sweet, sugary treat.' },
      { word: 'heart', emoji: '❤️', clue: 'A shape that means love.' },
    ],
    thatha: [
      { word: 'rainbow', emoji: '🌈', clue: 'Colorful arc in the sky after rain.' },
      { word: 'unicorn', emoji: '🦄', clue: 'A magic horse with one horn.' },
      { word: 'dragon', emoji: '🐉', clue: 'A big creature that breathes fire.' },
      { word: 'castle', emoji: '🏰', clue: 'A huge home where a king lives.' },
    ],
  },
  animals: {
    baby: [
      { word: 'dog', emoji: '🐶', clue: 'A pet that barks and wags its tail.' },
      { word: 'pig', emoji: '🐷', clue: 'A pink farm animal that says oink.' },
      { word: 'cow', emoji: '🐮', clue: 'A farm animal that gives us milk.' },
      { word: 'owl', emoji: '🦉', clue: 'A bird that says hoo at night.' },
    ],
    kid: [
      { word: 'frog', emoji: '🐸', clue: 'A green animal that hops and says ribbit.' },
      { word: 'lion', emoji: '🦁', clue: 'The big cat that roars.' },
      { word: 'bear', emoji: '🐻', clue: 'A big furry animal that loves honey.' },
      { word: 'duck', emoji: '🦆', clue: 'A bird that says quack and swims.' },
    ],
    adult: [
      { word: 'tiger', emoji: '🐯', clue: 'A big cat with orange and black stripes.' },
      { word: 'panda', emoji: '🐼', clue: 'A black-and-white bear that eats bamboo.' },
      { word: 'zebra', emoji: '🦓', clue: 'A horse with black-and-white stripes.' },
      { word: 'koala', emoji: '🐨', clue: 'A grey animal that hugs trees.' },
    ],
    thatha: [
      { word: 'giraffe', emoji: '🦒', clue: 'The tallest animal, with a long neck.' },
      { word: 'penguin', emoji: '🐧', clue: "A black-and-white bird that can't fly." },
      { word: 'monkey', emoji: '🐵', clue: 'It swings in trees and loves bananas.' },
      { word: 'rabbit', emoji: '🐰', clue: 'A hoppy animal with long ears.' },
    ],
  },
  ocean: {
    baby: [
      { word: 'sea', emoji: '🌊', clue: 'The big salty water where fish live.' },
      { word: 'ice', emoji: '🧊', clue: "Frozen water that's very cold." },
      { word: 'fin', emoji: '🐟', clue: 'A fish flaps these to swim.' },
      { word: 'oar', emoji: '🚣', clue: 'You paddle a little boat with it.' },
    ],
    kid: [
      { word: 'crab', emoji: '🦀', clue: 'It walks sideways and has claws.' },
      { word: 'wave', emoji: '🌊', clue: 'Water that rolls onto the beach.' },
      { word: 'seal', emoji: '🦭', clue: 'A smooth animal that claps and barks.' },
      { word: 'boat', emoji: '⛵', clue: 'It floats and carries you on water.' },
    ],
    adult: [
      { word: 'whale', emoji: '🐋', clue: 'The biggest animal in the sea.' },
      { word: 'shark', emoji: '🦈', clue: 'A fish with sharp teeth and a top fin.' },
      { word: 'shell', emoji: '🐚', clue: 'The hard home a sea snail leaves behind.' },
      { word: 'coral', emoji: '🪸', clue: 'Colorful rock-like homes for fish.' },
    ],
    thatha: [
      { word: 'octopus', emoji: '🐙', clue: 'A sea animal with eight arms.' },
      { word: 'dolphin', emoji: '🐬', clue: 'A playful animal that leaps from the waves.' },
      { word: 'mermaid', emoji: '🧜', clue: 'Half person, half fish.' },
      { word: 'turtle', emoji: '🐢', clue: 'It swims slowly and carries its home.' },
    ],
  },
  space: {
    baby: [
      { word: 'sun', emoji: '☀️', clue: 'The bright star that warms our day.' },
      { word: 'sky', emoji: '🌌', clue: 'Way up high, where the stars are.' },
      { word: 'ufo', emoji: '🛸', clue: 'A flying saucer from outer space.' },
      { word: 'bot', emoji: '🤖', clue: 'A robot — beep boop!' },
    ],
    kid: [
      { word: 'star', emoji: '⭐', clue: 'It twinkles in the night sky.' },
      { word: 'moon', emoji: '🌙', clue: 'It glows in the sky at night.' },
      { word: 'mars', emoji: '🔴', clue: 'The red planet.' },
      { word: 'glow', emoji: '✨', clue: 'A soft, shiny light.' },
    ],
    adult: [
      { word: 'comet', emoji: '☄️', clue: 'A space snowball with a glowing tail.' },
      { word: 'earth', emoji: '🌍', clue: 'The planet where we all live.' },
      { word: 'alien', emoji: '👽', clue: 'A creature from another planet.' },
      { word: 'rover', emoji: '🤖', clue: 'A robot car that drives on Mars.' },
    ],
    thatha: [
      { word: 'rocket', emoji: '🚀', clue: 'It blasts off to fly into space.' },
      { word: 'planet', emoji: '🪐', clue: 'A big round world out in space.' },
      { word: 'galaxy', emoji: '🌌', clue: 'A huge group of millions of stars.' },
      { word: 'meteor', emoji: '☄️', clue: 'A space rock that streaks across the sky.' },
    ],
  },
}

// ---------------------------------------------------------------------------
// General rotation pools — lots of words so games stay fresh on replay.
// ---------------------------------------------------------------------------
export const GENERAL = {
  // 3-letter words
  baby: [
    { word: 'cat', emoji: '🐱', clue: 'A soft pet that says meow.' },
    { word: 'dog', emoji: '🐶', clue: 'A pet that barks and wags its tail.' },
    { word: 'pig', emoji: '🐷', clue: 'A pink farm animal that says oink.' },
    { word: 'cow', emoji: '🐮', clue: 'A farm animal that gives us milk.' },
    { word: 'owl', emoji: '🦉', clue: 'A bird that says hoo at night.' },
    { word: 'bee', emoji: '🐝', clue: 'A buzzy bug that makes honey.' },
    { word: 'fox', emoji: '🦊', clue: 'An orange animal with a bushy tail.' },
    { word: 'ant', emoji: '🐜', clue: 'A tiny bug that marches in a line.' },
    { word: 'bat', emoji: '🦇', clue: 'A flying animal that sleeps upside down.' },
    { word: 'bug', emoji: '🐛', clue: 'A little crawly creature.' },
    { word: 'hen', emoji: '🐔', clue: 'A farm bird that lays eggs.' },
    { word: 'rat', emoji: '🐀', clue: 'A small animal with a long tail.' },
    { word: 'sun', emoji: '☀️', clue: 'It shines bright in the daytime sky.' },
    { word: 'egg', emoji: '🥚', clue: 'A hen lays it; you can eat it.' },
    { word: 'pie', emoji: '🥧', clue: 'A yummy baked treat.' },
    { word: 'jam', emoji: '🍓', clue: 'Sweet fruit spread for your toast.' },
    { word: 'tea', emoji: '☕', clue: 'A warm drink in a cup.' },
    { word: 'ice', emoji: '🧊', clue: 'Frozen water that is very cold.' },
    { word: 'bun', emoji: '🍞', clue: 'A soft round bit of bread.' },
    { word: 'nut', emoji: '🥜', clue: 'A little crunchy snack.' },
    { word: 'car', emoji: '🚗', clue: 'It has four wheels and you drive it.' },
    { word: 'bus', emoji: '🚌', clue: 'A big vehicle that carries lots of people.' },
    { word: 'van', emoji: '🚐', clue: 'A vehicle bigger than a car.' },
    { word: 'key', emoji: '🔑', clue: 'It opens a lock or a door.' },
    { word: 'hat', emoji: '🎩', clue: 'You wear this on your head.' },
    { word: 'bow', emoji: '🎀', clue: 'A pretty ribbon for your hair.' },
    { word: 'gem', emoji: '💎', clue: 'A shiny, sparkly jewel.' },
    { word: 'toy', emoji: '🧸', clue: 'A thing you play with.' },
    { word: 'cup', emoji: '🥤', clue: 'You drink from it.' },
    { word: 'pot', emoji: '🍲', clue: 'You cook food in it.' },
    { word: 'bed', emoji: '🛏️', clue: 'You sleep in it at night.' },
    { word: 'fan', emoji: '🪭', clue: 'It waves to make cool air.' },
    { word: 'map', emoji: '🗺️', clue: 'It shows you where to go.' },
    { word: 'pen', emoji: '🖊️', clue: 'You write with it.' },
    { word: 'saw', emoji: '🪚', clue: 'A tool that cuts wood.' },
    { word: 'axe', emoji: '🪓', clue: 'A tool for chopping wood.' },
    { word: 'eye', emoji: '👁️', clue: 'You see with it.' },
    { word: 'ear', emoji: '👂', clue: 'You hear with it.' },
    { word: 'arm', emoji: '💪', clue: 'Part of your body for hugging.' },
    { word: 'leg', emoji: '🦵', clue: 'You walk and run with it.' },
    { word: 'toe', emoji: '🦶', clue: 'A little part at the end of your foot.' },
    { word: 'lip', emoji: '👄', clue: 'Part of your mouth.' },
    { word: 'sad', emoji: '😢', clue: 'How you feel when you want to cry.' },
    { word: 'cry', emoji: '😭', clue: 'Tears falling when you are upset.' },
    { word: 'hug', emoji: '🤗', clue: 'A warm squeeze with your arms.' },
    { word: 'sky', emoji: '🌌', clue: 'Way up high where the clouds are.' },
    { word: 'fog', emoji: '🌫️', clue: 'Thick misty cloud near the ground.' },
    { word: 'web', emoji: '🕸️', clue: 'A sticky net a spider spins.' },
    { word: 'ski', emoji: '⛷️', clue: 'You slide down snowy hills on these.' },
  ],
  // 4-letter words
  kid: [
    { word: 'frog', emoji: '🐸', clue: 'A green animal that hops and says ribbit.' },
    { word: 'lion', emoji: '🦁', clue: 'The big cat that roars.' },
    { word: 'bear', emoji: '🐻', clue: 'A big furry animal that loves honey.' },
    { word: 'duck', emoji: '🦆', clue: 'A bird that says quack and swims.' },
    { word: 'fish', emoji: '🐟', clue: 'It swims in water with fins.' },
    { word: 'goat', emoji: '🐐', clue: 'A farm animal with horns that eats grass.' },
    { word: 'wolf', emoji: '🐺', clue: 'A wild animal that howls at the moon.' },
    { word: 'deer', emoji: '🦌', clue: 'A gentle forest animal with antlers.' },
    { word: 'swan', emoji: '🦢', clue: 'A white bird that swims gracefully.' },
    { word: 'worm', emoji: '🪱', clue: 'A wiggly creature in the soil.' },
    { word: 'lamb', emoji: '🐑', clue: 'A baby sheep.' },
    { word: 'hare', emoji: '🐇', clue: 'A fast hopping animal like a rabbit.' },
    { word: 'bird', emoji: '🐦', clue: 'An animal with feathers that flies.' },
    { word: 'star', emoji: '⭐', clue: 'It twinkles in the night sky.' },
    { word: 'moon', emoji: '🌙', clue: 'It glows in the sky at night.' },
    { word: 'tree', emoji: '🌳', clue: 'A tall plant with leaves and branches.' },
    { word: 'leaf', emoji: '🍃', clue: 'It grows on trees and falls in autumn.' },
    { word: 'rain', emoji: '🌧️', clue: 'Water drops falling from the sky.' },
    { word: 'snow', emoji: '❄️', clue: 'Cold white flakes in winter.' },
    { word: 'fire', emoji: '🔥', clue: 'Hot orange flames.' },
    { word: 'rock', emoji: '🪨', clue: 'A hard, heavy stone.' },
    { word: 'cake', emoji: '🎂', clue: 'A sweet treat for birthdays.' },
    { word: 'milk', emoji: '🥛', clue: 'A white drink that is good for you.' },
    { word: 'corn', emoji: '🌽', clue: 'A yellow veggie on a cob.' },
    { word: 'soup', emoji: '🍲', clue: 'A warm meal you eat with a spoon.' },
    { word: 'rice', emoji: '🍚', clue: 'Little white grains you eat.' },
    { word: 'taco', emoji: '🌮', clue: 'A folded snack with yummy filling.' },
    { word: 'pear', emoji: '🍐', clue: 'A green fruit shaped like a bell.' },
    { word: 'kiwi', emoji: '🥝', clue: 'A fuzzy fruit, green inside.' },
    { word: 'bell', emoji: '🔔', clue: 'It rings ding-dong.' },
    { word: 'ball', emoji: '⚽', clue: 'You kick or throw it to play.' },
    { word: 'book', emoji: '📖', clue: 'You read stories in it.' },
    { word: 'drum', emoji: '🥁', clue: 'You bang it to make music.' },
    { word: 'kite', emoji: '🪁', clue: 'It flies high on a windy day.' },
    { word: 'boat', emoji: '⛵', clue: 'It floats on water.' },
    { word: 'ship', emoji: '🚢', clue: 'A really big boat.' },
    { word: 'bike', emoji: '🚲', clue: 'Two wheels you pedal.' },
    { word: 'cart', emoji: '🛒', clue: 'You push it around the shop.' },
    { word: 'door', emoji: '🚪', clue: 'You open it to go into a room.' },
    { word: 'lamp', emoji: '💡', clue: 'It gives light in a room.' },
    { word: 'sock', emoji: '🧦', clue: 'You wear it on your foot.' },
    { word: 'shoe', emoji: '👟', clue: 'You wear it to walk outside.' },
    { word: 'ring', emoji: '💍', clue: 'You wear it on your finger.' },
    { word: 'gift', emoji: '🎁', clue: 'A present wrapped with a bow.' },
    { word: 'coin', emoji: '🪙', clue: 'Round metal money.' },
    { word: 'hand', emoji: '✋', clue: 'You wave and clap with it.' },
    { word: 'foot', emoji: '🦶', clue: 'You stand on two of these.' },
    { word: 'nose', emoji: '👃', clue: 'You smell with it.' },
    { word: 'baby', emoji: '👶', clue: 'A tiny new person.' },
    { word: 'cold', emoji: '🥶', clue: 'Brrr — not warm at all.' },
    { word: 'sick', emoji: '🤒', clue: 'Not feeling well, maybe with a fever.' },
    { word: 'love', emoji: '❤️', clue: 'A big warm feeling for someone.' },
    { word: 'song', emoji: '🎵', clue: 'Words and music you sing.' },
    { word: 'swim', emoji: '🏊', clue: 'Move through water with arms and legs.' },
    { word: 'jump', emoji: '🤸', clue: 'Push off the ground into the air.' },
    { word: 'clap', emoji: '👏', clue: 'Hit your hands together.' },
    { word: 'cool', emoji: '😎', clue: 'Really awesome!' },
  ],
  // 5-letter words
  adult: [
    { word: 'horse', emoji: '🐎', clue: 'A big animal you can ride.' },
    { word: 'puppy', emoji: '🐶', clue: 'A baby dog.' },
    { word: 'kitty', emoji: '🐱', clue: 'A baby cat.' },
    { word: 'bunny', emoji: '🐰', clue: 'A cute hopping animal.' },
    { word: 'snake', emoji: '🐍', clue: 'A long animal with no legs.' },
    { word: 'snail', emoji: '🐌', clue: 'It moves slowly and carries a shell.' },
    { word: 'whale', emoji: '🐋', clue: 'The biggest animal in the sea.' },
    { word: 'shark', emoji: '🦈', clue: 'A fish with sharp teeth.' },
    { word: 'eagle', emoji: '🦅', clue: 'A big bird that soars up high.' },
    { word: 'camel', emoji: '🐫', clue: 'A desert animal with humps.' },
    { word: 'apple', emoji: '🍎', clue: 'A round red fruit, crunchy and sweet.' },
    { word: 'mango', emoji: '🥭', clue: 'A juicy orange tropical fruit.' },
    { word: 'lemon', emoji: '🍋', clue: 'A sour yellow fruit.' },
    { word: 'grape', emoji: '🍇', clue: 'Tiny round fruit that grows in bunches.' },
    { word: 'peach', emoji: '🍑', clue: 'A soft, fuzzy fruit.' },
    { word: 'melon', emoji: '🍈', clue: 'A big juicy fruit.' },
    { word: 'bread', emoji: '🍞', clue: 'We make sandwiches with it.' },
    { word: 'pizza', emoji: '🍕', clue: 'A round cheesy treat with toppings.' },
    { word: 'donut', emoji: '🍩', clue: 'A sweet ring with a hole in the middle.' },
    { word: 'candy', emoji: '🍬', clue: 'A sweet, sugary treat.' },
    { word: 'honey', emoji: '🍯', clue: 'Sweet, sticky food that bees make.' },
    { word: 'juice', emoji: '🧃', clue: 'A fruity drink in a box.' },
    { word: 'water', emoji: '💧', clue: 'We drink it, and it has no color.' },
    { word: 'plant', emoji: '🪴', clue: 'A green growing thing in a pot.' },
    { word: 'cloud', emoji: '☁️', clue: 'Fluffy white thing in the sky.' },
    { word: 'storm', emoji: '⛈️', clue: 'Wind, rain, and thunder together.' },
    { word: 'beach', emoji: '🏖️', clue: 'Sandy place next to the sea.' },
    { word: 'river', emoji: '🏞️', clue: 'Water that flows across the land.' },
    { word: 'house', emoji: '🏠', clue: 'A building where people live.' },
    { word: 'train', emoji: '🚂', clue: 'A long vehicle that runs on tracks.' },
    { word: 'plane', emoji: '✈️', clue: 'It flies people across the sky.' },
    { word: 'truck', emoji: '🚚', clue: 'A big vehicle that carries heavy loads.' },
    { word: 'cycle', emoji: '🚲', clue: 'Two wheels you pedal to ride.' },
    { word: 'clock', emoji: '🕐', clue: 'It tells you the time.' },
    { word: 'chair', emoji: '🪑', clue: 'You sit on it.' },
    { word: 'phone', emoji: '📱', clue: 'You call and tap on it.' },
    { word: 'brush', emoji: '🪥', clue: 'You clean your teeth with it.' },
    { word: 'teddy', emoji: '🧸', clue: 'A soft, cuddly toy bear.' },
    { word: 'happy', emoji: '😊', clue: 'How you feel when you are glad.' },
    { word: 'angry', emoji: '😠', clue: 'How you feel when you are cross.' },
    { word: 'tired', emoji: '🥱', clue: 'Very sleepy and needing rest.' },
    { word: 'smile', emoji: '😄', clue: 'What your mouth does when you are glad.' },
    { word: 'laugh', emoji: '😂', clue: 'The ha-ha sound when something is funny.' },
    { word: 'heart', emoji: '❤️', clue: 'A shape that means love.' },
    { word: 'queen', emoji: '👸', clue: 'A royal lady who rules a land.' },
    { word: 'crown', emoji: '👑', clue: 'A king or queen wears it.' },
    { word: 'vomit', emoji: '🤮', clue: 'When your tummy is sick and food comes back up.' },
    { word: 'fever', emoji: '🤒', clue: 'When your body feels too hot and unwell.' },
    { word: 'sleep', emoji: '🛌', clue: 'What you do in bed at night.' },
    { word: 'dance', emoji: '💃', clue: 'Move your body to the music.' },
    { word: 'music', emoji: '🎵', clue: 'Sounds that make a song.' },
    { word: 'ghost', emoji: '👻', clue: 'A spooky, see-through spirit.' },
  ],
  // 6-7 letter words
  thatha: [
    { word: 'family', emoji: '👨‍👩‍👧‍👦', clue: 'Mum, dad, and children all together.' },
    { word: 'mother', emoji: '👩', clue: 'Your mum.' },
    { word: 'father', emoji: '👨', clue: 'Your dad.' },
    { word: 'sister', emoji: '👧', clue: 'A girl in your family.' },
    { word: 'brother', emoji: '🧒', clue: 'A boy in your family.' },
    { word: 'friend', emoji: '🧑‍🤝‍🧑', clue: 'Someone you like to play with.' },
    { word: 'doctor', emoji: '👩‍⚕️', clue: 'They help you feel better when you are sick.' },
    { word: 'school', emoji: '🏫', clue: 'Where you go to learn.' },
    { word: 'garden', emoji: '🌷', clue: 'A place where flowers and plants grow.' },
    { word: 'forest', emoji: '🌲', clue: 'Lots and lots of trees together.' },
    { word: 'butter', emoji: '🧈', clue: 'Yellow spread that melts on toast.' },
    { word: 'cookie', emoji: '🍪', clue: 'A sweet, round baked treat.' },
    { word: 'cheese', emoji: '🧀', clue: 'Yellow food made from milk.' },
    { word: 'carrot', emoji: '🥕', clue: 'An orange veggie bunnies love.' },
    { word: 'tomato', emoji: '🍅', clue: 'A round red fruit for salads.' },
    { word: 'banana', emoji: '🍌', clue: 'A long yellow fruit monkeys love.' },
    { word: 'cherry', emoji: '🍒', clue: 'A tiny red fruit with a stalk.' },
    { word: 'orange', emoji: '🍊', clue: 'A round juicy fruit, and a color too.' },
    { word: 'pepper', emoji: '🌶️', clue: 'A spicy red veggie.' },
    { word: 'pumpkin', emoji: '🎃', clue: 'A big orange veggie carved at Halloween.' },
    { word: 'basket', emoji: '🧺', clue: 'You carry things in it.' },
    { word: 'pencil', emoji: '✏️', clue: 'You write and draw with it.' },
    { word: 'guitar', emoji: '🎸', clue: 'A music toy with strings.' },
    { word: 'window', emoji: '🪟', clue: 'Glass you look through in a house.' },
    { word: 'bottle', emoji: '🍼', clue: 'A baby drinks milk from it.' },
    { word: 'camera', emoji: '📷', clue: 'It takes photos.' },
    { word: 'crayon', emoji: '🖍️', clue: 'You color with it.' },
    { word: 'bucket', emoji: '🪣', clue: 'You carry water or sand in it.' },
    { word: 'zombie', emoji: '🧟', clue: 'A spooky walking monster.' },
    { word: 'wizard', emoji: '🧙', clue: 'A person who casts magic spells.' },
    { word: 'pirate', emoji: '🏴‍☠️', clue: 'A sailor who hunts for treasure.' },
    { word: 'parrot', emoji: '🦜', clue: 'A colorful bird that can talk.' },
    { word: 'spider', emoji: '🕷️', clue: 'A creepy crawly with eight legs.' },
    { word: 'winter', emoji: '❄️', clue: 'The cold, snowy season.' },
    { word: 'summer', emoji: '🏖️', clue: 'The hot, sunny season.' },
    { word: 'cuddle', emoji: '🤗', clue: 'A big, warm hug.' },
    { word: 'sneeze', emoji: '🤧', clue: 'Aaa-choo!' },
    { word: 'tongue', emoji: '👅', clue: 'The pink part in your mouth for tasting.' },
    { word: 'finger', emoji: '☝️', clue: 'You point with it.' },
    { word: 'rocket', emoji: '🚀', clue: 'It blasts off to fly into space.' },
    { word: 'flower', emoji: '🌸', clue: 'A pretty bloom that smells nice.' },
    { word: 'turtle', emoji: '🐢', clue: 'It swims slowly and carries its home.' },
  ],
}

// ---------------------------------------------------------------------------
// Pool helpers
// ---------------------------------------------------------------------------
function dedupeByWord(list) {
  const seen = new Set()
  const out = []
  for (const w of list) {
    if (!seen.has(w.word)) {
      seen.add(w.word)
      out.push(w)
    }
  }
  return out
}

// All words available for a bucket: theme-flavoured first, then the big pool.
function poolFor(themeId, bucket) {
  const themePool = (THEME_WORDS[themeId] && THEME_WORDS[themeId][bucket]) || []
  const general = GENERAL[bucket] || []
  return dedupeByWord([...themePool, ...general])
}

// Pick a single random word (used by Hangman), optionally avoiding a recent one.
export function pickWord(themeId, bucket, avoid) {
  const pool = poolFor(themeId, bucket)
  const choices = avoid && pool.length > 1 ? pool.filter((w) => w.word !== avoid) : pool
  return choices[Math.floor(Math.random() * choices.length)]
}

// Build a shuffled list of `count` unique words for a multi-round session.
// The first word is theme-flavoured (when available); the rest range across the
// whole pool so replays keep serving fresh words.
export function getRounds(themeId, bucket, count = 6) {
  const themePool = (THEME_WORDS[themeId] && THEME_WORDS[themeId][bucket]) || []
  const all = shuffle(poolFor(themeId, bucket))
  const out = []
  const seen = new Set()

  const first = shuffle([...themePool])[0]
  if (first) {
    out.push(first)
    seen.add(first.word)
  }
  for (const w of all) {
    if (out.length >= count) break
    if (!seen.has(w.word)) {
      seen.add(w.word)
      out.push(w)
    }
  }
  // Pad (only needed if a pool is smaller than `count`).
  let i = 0
  while (out.length < count && all.length) {
    out.push(all[i % all.length])
    i++
  }
  return out.slice(0, count)
}
