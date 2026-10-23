import { Animal } from '../types';
import snowLeopardImg from '../assets/images/snow_leopard_portrait_1792739124603.jpg';
import redPandaImg from '../assets/images/red_panda_portrait_1792739125638.jpg';
import goldenLionImg from '../assets/images/golden_lion_portrait_1792739126774.jpg';
import arcticFoxImg from '../assets/images/arctic_fox_portrait_1792739128370.jpg';
import barnOwlImg from '../assets/images/barn_owl_portrait_1792739127467.jpg';

export const ANIMALS: Animal[] = [
  {
    id: 'snow-leopard',
    name: 'Snow Leopard',
    subtitle: 'Ghost of the High Himalayas',
    species: 'Panthera uncia',
    habitat: 'Central Asian Mountain Ranges',
    fact: 'Equipped with wide paws acting as natural snowshoes and a long tail used for balance and warmth.',
    imageUrl: snowLeopardImg,
    accentColor: '#38bdf8', // sky-400
  },
  {
    id: 'red-panda',
    name: 'Red Panda',
    subtitle: 'Arboreal Acrobats of the Mist',
    species: 'Ailurus fulgens',
    habitat: 'Temperate Forests of the Eastern Himalayas',
    fact: 'Uses an elongated wrist bone as a pseudo-thumb to grasp bamboo shoots with dexterous precision.',
    imageUrl: redPandaImg,
    accentColor: '#fb923c', // orange-400
  },
  {
    id: 'golden-lion',
    name: 'African Lion',
    subtitle: 'Monarch of the Sunlit Plains',
    species: 'Panthera leo',
    habitat: 'Sub-Saharan African Grasslands & Savannas',
    fact: 'The roar of an adult male lion can reach 114 decibels and be heard up to 8 kilometers away.',
    imageUrl: goldenLionImg,
    accentColor: '#fbbf24', // amber-400
  },
  {
    id: 'arctic-fox',
    name: 'Arctic Fox',
    subtitle: 'White Mirage of the Frozen Tundra',
    species: 'Vulpes lagopus',
    habitat: 'Circumpolar Arctic Tundra',
    fact: 'Their multi-layered dense coat possesses the greatest thermal insulation of any mammal on Earth.',
    imageUrl: arcticFoxImg,
    accentColor: '#a78bfa', // violet-400
  },
  {
    id: 'barn-owl',
    name: 'Barn Owl',
    subtitle: 'Silent Winged Hunter of Dusk',
    species: 'Tyto alba',
    habitat: 'Farmlands, Grasslands & Open Woodlands',
    fact: 'Comb-like serrations on their wing feathers muffle sound, enabling virtually silent flight in pitch darkness.',
    imageUrl: barnOwlImg,
    accentColor: '#f59e0b', // amber-500
  },
];
