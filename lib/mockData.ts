// lib/mockData.ts
/**
 * Mock data for testing forms
 * This file contains example data that can be used to pre-fill forms for testing purposes
 */

// Example owner data
export const mockOwners = [
  {
    name: "Jan de Vries",
    companyName: "De Vries Accommodaties",
    email: "jan@devriesaccommodaties.nl",
    phone: "+31612345678",
    address: "Dorpsstraat 123, Amsterdam",
    contactDetails: "Bereikbaar op werkdagen van 9 tot 17 uur",
    countryId: 136, // Netherlands
    languageId: 1, // Dutch
  },
  {
    name: "Maria Jansen",
    companyName: "Jansen Verhuur",
    email: "maria@jansenverhuur.nl",
    phone: "+31698765432",
    address: "Kerkweg 45, Utrecht",
    contactDetails: "Voorkeur voor contact via e-mail",
    countryId: 136,
    languageId: 1,
  },
  {
    name: "Peter Bakker",
    companyName: "Bakker Groepsverblijven",
    email: "info@bakkergroepsverblijven.nl",
    phone: "+31655443322",
    address: "Bosweg 78, Arnhem",
    contactDetails: "Telefonisch bereikbaar in het weekend",
    countryId: 136,
    languageId: 1,
  },
];

// Example accommodation data
export const mockAccommodations = [
  {
    name: "Boshuis De Dennenhof",
    code: 1001,
    online: "online",
    onlineVisible: true,
    disabled: false,
    memo: "Gerenoveerd in 2024. Nieuwe boiler geïnstalleerd.",
    address: "Bosweg 45",
    postalCode: "7361 AB",
    city: "Beekbergen",
    countryId: 136,
    minPersonCount: 10,
    maxPersonCount: 24,
    personsIncludedInRent: 20,
    petsAllowed: true,
    numberOfPetsAllowed: 2,
    surface: 350,
    arrivalTime: "15:00",
    departureTime: "10:00",
  },
  {
    name: "Vakantiehuis De Waterkant",
    code: 1002,
    online: "online",
    onlineVisible: true,
    disabled: false,
    memo: "Direct aan het meer gelegen. Eigen aanlegsteiger voor boten.",
    address: "Meerkade 12",
    postalCode: "8536 VK",
    city: "Giethoorn",
    countryId: 136,
    minPersonCount: 8,
    maxPersonCount: 16,
    personsIncludedInRent: 16,
    petsAllowed: false,
    numberOfPetsAllowed: 0,
    surface: 280,
    arrivalTime: "16:00",
    departureTime: "11:00",
  },
  {
    name: "Groepsboerderij Het Achterhuis",
    code: 1003,
    online: "online",
    onlineVisible: true,
    disabled: false,
    memo: "Authentieke boerderij uit 1912. Grote schuur beschikbaar voor activiteiten.",
    address: "Langeweg 78",
    postalCode: "5541 CE",
    city: "Reusel",
    countryId: 136,
    minPersonCount: 15,
    maxPersonCount: 32,
    personsIncludedInRent: 25,
    petsAllowed: true,
    numberOfPetsAllowed: 3,
    surface: 520,
    arrivalTime: "14:00",
    departureTime: "10:30",
  },
];

// Example features data (with IDs that match common features)
export const mockFeatures = [
  { featureID: 1, value: "1" }, // WiFi
  { featureID: 3, value: "4" }, // Toilets
  { featureID: 4, value: "3" }, // Showers
  { featureID: 5, value: "2" }, // TVs
  { featureID: 2, value: "1" }, // Swimming pool
  { featureID: 6, value: "12" }, // Beds
];

// Example rooms data
export const mockRooms = [
  {
    accommodationRoomType: 1, // Bedroom
    floor: 0,
    position: 0,
    suffix: "Slaapkamer 1 (4 pers)",
  },
  {
    accommodationRoomType: 1, // Bedroom
    floor: 0,
    position: 1,
    suffix: "Slaapkamer 2 (4 pers)",
  },
  {
    accommodationRoomType: 1, // Bedroom
    floor: 1,
    position: 2,
    suffix: "Slaapkamer 3 (6 pers)",
  },
  {
    accommodationRoomType: 1, // Bedroom
    floor: 1,
    position: 3,
    suffix: "Slaapkamer 4 (6 pers)",
  },
  {
    accommodationRoomType: 2, // Bathroom
    floor: 0,
    position: 4,
    suffix: "Badkamer beneden",
  },
  {
    accommodationRoomType: 2, // Bathroom
    floor: 1,
    position: 5,
    suffix: "Badkamer boven",
  },
  {
    accommodationRoomType: 3, // Kitchen
    floor: 0,
    position: 6,
    suffix: "Keuken",
  },
  {
    accommodationRoomType: 4, // Living room
    floor: 0,
    position: 7,
    suffix: "Woonkamer",
  },
];

// Example room features data
export const mockRoomFeatures = [
  { roomId: 0, featureId: 6, value: "4" }, // 4 beds in room 0
  { roomId: 1, featureId: 6, value: "4" }, // 4 beds in room 1
  { roomId: 2, featureId: 6, value: "6" }, // 6 beds in room 2
  { roomId: 3, featureId: 6, value: "6" }, // 6 beds in room 3
  { roomId: 4, featureId: 3, value: "2" }, // 2 toilets in bathroom 0
  { roomId: 4, featureId: 4, value: "1" }, // 1 shower in bathroom 0
  { roomId: 5, featureId: 3, value: "2" }, // 2 toilets in bathroom 1
  { roomId: 5, featureId: 4, value: "2" }, // 2 showers in bathroom 1
  { roomId: 7, featureId: 5, value: "1" }, // 1 TV in living room
];
