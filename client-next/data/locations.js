// Comprehensive Indian Cities Database

// Top Tech Cities / Metro Cities
export const TOP_TECH_CITIES = [
  "Bangalore", "Hyderabad", "Pune", "Gurgaon", "Mumbai", "Chennai",
  "Delhi", "Noida", "Kolkata", "Ahmedabad", "Chandigarh", "Kochi"
];

// All Indian Cities by State
export const INDIAN_CITIES = {
  // Top Tech Hubs & Metros
  techHubs: [
    "Bangalore", "Hyderabad", "Pune", "Gurgaon", "Mumbai", "Chennai",
    "Delhi", "Noida", "Gurugram", "Kolkata", "Ahmedabad", "Chandigarh",
    "Kochi", "Indore", "Jaipur", "Coimbatore", "Visakhapatnam", "Bhubaneswar",
    "Thiruvananthapuram", "Vadodara", "Nagpur", "Lucknow", "Surat", "Mangalore"
  ],

  // Karnataka
  karnataka: [
    "Bangalore", "Mysore", "Mangalore", "Hubli", "Belgaum", "Gulbarga",
    "Davangere", "Bellary", "Bijapur", "Shimoga", "Tumkur", "Raichur",
    "Bidar", "Hospet", "Hassan", "Gadag", "Udupi", "Chitradurga"
  ],

  // Maharashtra
  maharashtra: [
    "Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur",
    "Amravati", "Kolhapur", "Sangli", "Jalgaon", "Akola", "Latur",
    "Dhule", "Ahmednagar", "Chandrapur", "Parbhani", "Ichalkaranji",
    "Jalna", "Bhusawal", "Nanded", "Satara", "Beed", "Yavatmal", "Navi Mumbai", "Thane"
  ],

  // Delhi NCR
  delhiNcr: [
    "Delhi", "New Delhi", "Noida", "Greater Noida", "Gurgaon", "Gurugram",
    "Faridabad", "Ghaziabad", "Sonipat", "Panipat", "Rohtak", "Meerut",
    "Baghpat", "Gautam Buddha Nagar", "Hapur", "Muzaffarnagar"
  ],

  // Tamil Nadu
  tamilNadu: [
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli",
    "Tiruppur", "Ranipet", "Nagercoil", "Thanjavur", "Vellore", "Kanchipuram",
    "Erode", "Tiruvannamalai", "Pollachi", "Dindigul", "Cuddalore", "Hosur",
    "Karur", "Kumbakonam", "Neyveli", "Ooty", "Tuticorin"
  ],

  // Telangana & Andhra Pradesh
  telanganaAndhra: [
    "Hyderabad", "Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool",
    "Rajahmundry", "Kakinada", "Tirupati", "Anantapur", "Kadapa", "Vizianagaram",
    "Eluru", "Ongole", "Nandyal", "Machilipatnam", "Adoni", "Tenali",
    "Chittoor", "Hindupur", "Proddatur", "Bhimavaram", "Madanapalle", "Guntakal",
    "Dharmavaram", "Gudivada", "Srikakulam", "Narasaraopet", "Tadepalligudem",
    "Secunderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"
  ],

  // West Bengal
  westBengal: [
    "Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman",
    "Malda", "Baharampur", "Habra", "Kharagpur", "Shantipur", "Dankuni",
    "Dhulian", "Ranaghat", "Haldia", "Raiganj", "Krishnanagar", "Nabadwip",
    "Medinipur", "Jalpaiguri", "Balurghat", "Basirhat", "Bankura", "Chakdaha",
    "Darjeeling", "Alipurduar", "Purulia", "Jangipur"
  ],

  // Gujarat
  gujarat: [
    "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar",
    "Gandhinagar", "Junagadh", "Gandhidham", "Anand", "Navsari", "Morbi",
    "Nadiad", "Surendranagar", "Bharuch", "Mehsana", "Bhuj", "Porbandar",
    "Palanpur", "Valsad", "Vapi", "Gondal", "Veraval", "Godhra",
    "Patan", "Kalol", "Dahod", "Botad", "Amreli", "Deesa"
  ],

  // Rajasthan
  rajasthan: [
    "Jaipur", "Jodhpur", "Kota", "Bikaner", "Udaipur", "Ajmer",
    "Bhilwara", "Alwar", "Bharatpur", "Pali", "Barmer", "Sikar",
    "Tonk", "Sadulpur", "Sawai Madhopur", "Nagaur", "Makrana", "Sujangarh",
    "Sardarshahar", "Ladnu", "Ratangarh", "Nokha", "Nimbahera", "Suratgarh",
    "Rajsamand", "Lachhmangarh", "Rajgarh", "Nasirabad", "Nohar", "Phalodi"
  ],

  // Kerala
  kerala: [
    "Thiruvananthapuram", "Kochi", "Kozhikode", "Kollam", "Thrissur", "Palakkad",
    "Alappuzha", "Malappuram", "Kannur", "Kasaragod", "Kottayam", "Pathanamthitta",
    "Idukki", "Ernakulam", "Wayanad", "Guruvayur", "Thalassery", "Ponnani",
    "Vatakara", "Kanhangad", "Payyanur", "Koyilandy", "Parappanangadi", "Kalamassery"
  ],

  // Punjab & Haryana & Chandigarh
  punjabHaryanaChandigarh: [
    "Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda",
    "Mohali", "Pathankot", "Hoshiarpur", "Batala", "Moga", "Malerkotla",
    "Khanna", "Phagwara", "Muktsar", "Barnala", "Rajpura", "Firozpur",
    "Kapurthala", "Faridkot", "Zirakpur", "Panchkula", "Ambala", "Karnal",
    "Yamunanagar", "Rohtak", "Hisar", "Panipat", "Kurukshetra", "Kaithal",
    "Bhiwani", "Sirsa", "Bahadurgarh", "Jind", "Thanesar", "Rewari",
    "Palwal", "Pinjore"
  ],

  // Madhya Pradesh & Chhattisgarh
  madhyaPradeshChhattisgarh: [
    "Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar",
    "Dewas", "Satna", "Ratlam", "Rewa", "Murwara", "Singrauli",
    "Burhanpur", "Khandwa", "Bhind", "Chhindwara", "Guna", "Shivpuri",
    "Vidisha", "Damoh", "Mandsaur", "Khargone", "Neemuch", "Pithampur",
    "Hoshangabad", "Itarsi", "Sehore", "Betul", "Seoni", "Datia",
    "Nagda", "Raipur", "Bhilai", "Bilaspur", "Korba", "Durg",
    "Rajnandgaon", "Jagdalpur", "Raigarh", "Ambikapur", "Mahasamund", "Dhamtari"
  ],

  // Uttar Pradesh
  uttarPradesh: [
    "Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut",
    "Allahabad", "Prayagraj", "Bareilly", "Aligarh", "Moradabad", "Saharanpur",
    "Gorakhpur", "Noida", "Firozabad", "Jhansi", "Muzaffarnagar", "Mathura",
    "Rampur", "Shahjahanpur", "Farrukhabad", "Ayodhya", "Maunath Bhanjan",
    "Hapur", "Etawah", "Mirzapur", "Bulandshahr", "Sambhal", "Amroha",
    "Hardoi", "Fatehpur", "Raebareli", "Orai", "Sitapur", "Bahraich",
    "Modinagar", "Unnao", "Jaunpur", "Lakhimpur", "Hathras", "Banda",
    "Pilibhit", "Barabanki", "Khurja", "Gonda", "Mainpuri", "Lalitpur",
    "Greater Noida", "Faizabad"
  ],

  // Bihar & Jharkhand
  biharJharkhand: [
    "Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Arrah",
    "Begusarai", "Katihar", "Munger", "Chhapra", "Danapur", "Bettiah",
    "Saharsa", "Sasaram", "Hajipur", "Dehri", "Siwan", "Motihari",
    "Nawada", "Bagaha", "Buxar", "Kishanganj", "Sitamarhi", "Jamalpur",
    "Jehanabad", "Aurangabad", "Ranchi", "Jamshedpur", "Dhanbad", "Bokaro",
    "Deoghar", "Hazaribag", "Giridih", "Ramgarh", "Phusro", "Adityapur"
  ],

  // Odisha
  odisha: [
    "Bhubaneswar", "Cuttack", "Rourkela", "Brahmapur", "Sambalpur", "Puri",
    "Balasore", "Bhadrak", "Baripada", "Jharsuguda", "Jeypore", "Barbil",
    "Paradip", "Bhawanipatna", "Dhenkanal", "Balangir", "Rayagada", "Jatani"
  ],

  // Assam & North East
  assamNorthEast: [
    "Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia",
    "Tezpur", "Bongaigaon", "Diphu", "Dhubri", "North Lakhimpur", "Karimganj",
    "Sibsagar", "Goalpara", "Barpeta", "Lanka", "Lumding", "Haflong",
    "Kokrajhar", "Hailakandi", "Imphal", "Aizawl", "Agartala", "Shillong",
    "Itanagar", "Kohima", "Dimapur", "Gangtok"
  ],

  // Uttarakhand & Himachal Pradesh
  uttarakhandHimachal: [
    "Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur",
    "Rishikesh", "Ramnagar", "Pithoragarh", "Jaspur", "Manglaur", "Nainital",
    "Mussoorie", "Shimla", "Mandi", "Solan", "Nahan", "Palampur",
    "Sundernagar", "Kullu", "Hamirpur", "Una", "Bilaspur", "Chamba",
    "Dharamshala", "Kangra", "Manali"
  ],

  // Jammu & Kashmir & Ladakh
  jammukashmirLadakh: [
    "Srinagar", "Jammu", "Anantnag", "Baramulla", "Sopore", "Kathua",
    "Udhampur", "Punch", "Rajauri", "Leh", "Kargil"
  ],

  // Goa
  goa: [
    "Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim",
    "Curchorem", "Sanquelim", "Cuncolim", "Quepem", "Canacona"
  ],

  // Remote/Work From Home
  remote: [
    "Remote", "Work From Home", "WFH", "Virtual"
  ]
};

// Flatten all cities into a single searchable array
export const ALL_INDIAN_CITIES = [
  ...new Set([
    ...TOP_TECH_CITIES,
    ...Object.values(INDIAN_CITIES).flat()
  ])
].sort();

// Search Indian cities
export const searchIndianCities = (query) => {
  if (!query) return ALL_INDIAN_CITIES;
  
  const lowerQuery = query.toLowerCase();
  return ALL_INDIAN_CITIES.filter(city => 
    city.toLowerCase().includes(lowerQuery)
  );
};

// Get cities by state
export const getCitiesByState = (state) => {
  return INDIAN_CITIES[state] || [];
};

export default {
  TOP_TECH_CITIES,
  INDIAN_CITIES,
  ALL_INDIAN_CITIES,
  searchIndianCities,
  getCitiesByState
};
