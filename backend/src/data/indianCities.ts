export interface IndianCity {
  name: string;
  state: string;
  displayName: string;
  baseTariff: number; // in ₹ / kWh
}

export const INDIAN_CITIES: IndianCity[] = [
  // Maharashtra
  { name: "Mumbai", state: "Maharashtra", displayName: "Mumbai, Maharashtra", baseTariff: 7.50 },
  { name: "Pune", state: "Maharashtra", displayName: "Pune, Maharashtra", baseTariff: 7.45 },
  { name: "Nagpur", state: "Maharashtra", displayName: "Nagpur, Maharashtra", baseTariff: 7.40 },
  { name: "Thane", state: "Maharashtra", displayName: "Thane, Maharashtra", baseTariff: 7.50 },
  { name: "Nashik", state: "Maharashtra", displayName: "Nashik, Maharashtra", baseTariff: 7.35 },
  { name: "Pimpri-Chinchwad", state: "Maharashtra", displayName: "Pimpri-Chinchwad, Maharashtra", baseTariff: 7.45 },
  { name: "Kalyan-Dombivli", state: "Maharashtra", displayName: "Kalyan-Dombivli, Maharashtra", baseTariff: 7.50 },
  { name: "Vasai-Virar", state: "Maharashtra", displayName: "Vasai-Virar, Maharashtra", baseTariff: 7.40 },
  { name: "Aurangabad", state: "Maharashtra", displayName: "Aurangabad (Chhatrapati Sambhajinagar), Maharashtra", baseTariff: 7.30 },
  { name: "Navi Mumbai", state: "Maharashtra", displayName: "Navi Mumbai, Maharashtra", baseTariff: 7.50 },
  { name: "Solapur", state: "Maharashtra", displayName: "Solapur, Maharashtra", baseTariff: 7.25 },
  { name: "Mira-Bhayandar", state: "Maharashtra", displayName: "Mira-Bhayandar, Maharashtra", baseTariff: 7.50 },
  { name: "Bhiwandi", state: "Maharashtra", displayName: "Bhiwandi, Maharashtra", baseTariff: 7.35 },
  { name: "Amravati", state: "Maharashtra", displayName: "Amravati, Maharashtra", baseTariff: 7.25 },
  { name: "Nanded", state: "Maharashtra", displayName: "Nanded, Maharashtra", baseTariff: 7.20 },
  { name: "Kolhapur", state: "Maharashtra", displayName: "Kolhapur, Maharashtra", baseTariff: 7.30 },
  { name: "Akola", state: "Maharashtra", displayName: "Akola, Maharashtra", baseTariff: 7.20 },
  { name: "Ulhasnagar", state: "Maharashtra", displayName: "Ulhasnagar, Maharashtra", baseTariff: 7.40 },
  { name: "Sangli", state: "Maharashtra", displayName: "Sangli-Miraj, Maharashtra", baseTariff: 7.25 },
  { name: "Malegaon", state: "Maharashtra", displayName: "Malegaon, Maharashtra", baseTariff: 7.20 },
  { name: "Jalgaon", state: "Maharashtra", displayName: "Jalgaon, Maharashtra", baseTariff: 7.20 },
  { name: "Latur", state: "Maharashtra", displayName: "Latur, Maharashtra", baseTariff: 7.15 },
  { name: "Dhule", state: "Maharashtra", displayName: "Dhule, Maharashtra", baseTariff: 7.15 },
  { name: "Ahmednagar", state: "Maharashtra", displayName: "Ahmednagar, Maharashtra", baseTariff: 7.20 },
  { name: "Satara", state: "Maharashtra", displayName: "Satara, Maharashtra", baseTariff: 7.20 },
  { name: "Chandrapur", state: "Maharashtra", displayName: "Chandrapur, Maharashtra", baseTariff: 7.15 },

  // Karnataka
  { name: "Bengaluru", state: "Karnataka", displayName: "Bengaluru, Karnataka", baseTariff: 7.20 },
  { name: "Hubballi-Dharwad", state: "Karnataka", displayName: "Hubballi-Dharwad, Karnataka", baseTariff: 7.00 },
  { name: "Mysuru", state: "Karnataka", displayName: "Mysuru (Mysore), Karnataka", baseTariff: 7.10 },
  { name: "Mangaluru", state: "Karnataka", displayName: "Mangaluru (Mangalore), Karnataka", baseTariff: 7.15 },
  { name: "Belagavi", state: "Karnataka", displayName: "Belagavi (Belgaum), Karnataka", baseTariff: 7.00 },
  { name: "Gulbarga", state: "Karnataka", displayName: "Kalaburagi (Gulbarga), Karnataka", baseTariff: 6.95 },
  { name: "Davanagere", state: "Karnataka", displayName: "Davanagere, Karnataka", baseTariff: 6.90 },
  { name: "Bellary", state: "Karnataka", displayName: "Ballari (Bellary), Karnataka", baseTariff: 6.95 },
  { name: "Bijapur", state: "Karnataka", displayName: "Vijayapura (Bijapur), Karnataka", baseTariff: 6.90 },
  { name: "Shimoga", state: "Karnataka", displayName: "Shivamogga (Shimoga), Karnataka", baseTariff: 6.95 },

  // Delhi NCR / Haryana / Punjab
  { name: "Delhi", state: "Delhi", displayName: "Delhi NCR", baseTariff: 6.80 },
  { name: "Gurugram", state: "Haryana", displayName: "Gurugram (Gurgaon), Haryana", baseTariff: 7.10 },
  { name: "Faridabad", state: "Haryana", displayName: "Faridabad, Haryana", baseTariff: 7.05 },
  { name: "Noida", state: "Uttar Pradesh", displayName: "Noida, Uttar Pradesh", baseTariff: 7.15 },
  { name: "Greater Noida", state: "Uttar Pradesh", displayName: "Greater Noida, Uttar Pradesh", baseTariff: 7.15 },
  { name: "Ghaziabad", state: "Uttar Pradesh", displayName: "Ghaziabad, Uttar Pradesh", baseTariff: 7.10 },
  { name: "Chandigarh", state: "Chandigarh", displayName: "Chandigarh (UT)", baseTariff: 6.50 },
  { name: "Ludhiana", state: "Punjab", displayName: "Ludhiana, Punjab", baseTariff: 6.90 },
  { name: "Amritsar", state: "Punjab", displayName: "Amritsar, Punjab", baseTariff: 6.85 },
  { name: "Jalandhar", state: "Punjab", displayName: "Jalandhar, Punjab", baseTariff: 6.85 },
  { name: "Patiala", state: "Punjab", displayName: "Patiala, Punjab", baseTariff: 6.80 },
  { name: "Rohtak", state: "Haryana", displayName: "Rohtak, Haryana", baseTariff: 6.90 },

  // Tamil Nadu
  { name: "Chennai", state: "Tamil Nadu", displayName: "Chennai, Tamil Nadu", baseTariff: 7.00 },
  { name: "Coimbatore", state: "Tamil Nadu", displayName: "Coimbatore, Tamil Nadu", baseTariff: 6.95 },
  { name: "Madurai", state: "Tamil Nadu", displayName: "Madurai, Tamil Nadu", baseTariff: 6.90 },
  { name: "Tiruchirappalli", state: "Tamil Nadu", displayName: "Tiruchirappalli (Trichy), Tamil Nadu", baseTariff: 6.85 },
  { name: "Salem", state: "Tamil Nadu", displayName: "Salem, Tamil Nadu", baseTariff: 6.85 },
  { name: "Tirunelveli", state: "Tamil Nadu", displayName: "Tirunelveli, Tamil Nadu", baseTariff: 6.80 },
  { name: "Erode", state: "Tamil Nadu", displayName: "Erode, Tamil Nadu", baseTariff: 6.85 },
  { name: "Vellore", state: "Tamil Nadu", displayName: "Vellore, Tamil Nadu", baseTariff: 6.80 },
  { name: "Thoothukudi", state: "Tamil Nadu", displayName: "Thoothukudi (Tuticorin), Tamil Nadu", baseTariff: 6.80 },

  // Telangana & Andhra Pradesh
  { name: "Hyderabad", state: "Telangana", displayName: "Hyderabad, Telangana", baseTariff: 7.30 },
  { name: "Warangal", state: "Telangana", displayName: "Warangal, Telangana", baseTariff: 7.10 },
  { name: "Nizamabad", state: "Telangana", displayName: "Nizamabad, Telangana", baseTariff: 7.00 },
  { name: "Visakhapatnam", state: "Andhra Pradesh", displayName: "Visakhapatnam, Andhra Pradesh", baseTariff: 7.15 },
  { name: "Vijayawada", state: "Andhra Pradesh", displayName: "Vijayawada, Andhra Pradesh", baseTariff: 7.10 },
  { name: "Guntur", state: "Andhra Pradesh", displayName: "Guntur, Andhra Pradesh", baseTariff: 7.05 },
  { name: "Nellore", state: "Andhra Pradesh", displayName: "Nellore, Andhra Pradesh", baseTariff: 7.00 },
  { name: "Kurnool", state: "Andhra Pradesh", displayName: "Kurnool, Andhra Pradesh", baseTariff: 6.95 },
  { name: "Rajahmundry", state: "Andhra Pradesh", displayName: "Rajahmundry, Andhra Pradesh", baseTariff: 7.00 },
  { name: "Tirupati", state: "Andhra Pradesh", displayName: "Tirupati, Andhra Pradesh", baseTariff: 7.05 },
  { name: "Kakinada", state: "Andhra Pradesh", displayName: "Kakinada, Andhra Pradesh", baseTariff: 7.00 },
  { name: "Kadapa", state: "Andhra Pradesh", displayName: "Kadapa, Andhra Pradesh", baseTariff: 6.95 },

  // West Bengal
  { name: "Kolkata", state: "West Bengal", displayName: "Kolkata, West Bengal", baseTariff: 7.40 },
  { name: "Howrah", state: "West Bengal", displayName: "Howrah, West Bengal", baseTariff: 7.35 },
  { name: "Durgapur", state: "West Bengal", displayName: "Durgapur, West Bengal", baseTariff: 7.20 },
  { name: "Asansol", state: "West Bengal", displayName: "Asansol, West Bengal", baseTariff: 7.20 },
  { name: "Siliguri", state: "West Bengal", displayName: "Siliguri, West Bengal", baseTariff: 7.15 },
  { name: "Bardhaman", state: "West Bengal", displayName: "Bardhaman, West Bengal", baseTariff: 7.10 },

  // Gujarat
  { name: "Ahmedabad", state: "Gujarat", displayName: "Ahmedabad, Gujarat", baseTariff: 6.95 },
  { name: "Surat", state: "Gujarat", displayName: "Surat, Gujarat", baseTariff: 6.90 },
  { name: "Vadodara", state: "Gujarat", displayName: "Vadodara, Gujarat", baseTariff: 6.85 },
  { name: "Rajkot", state: "Gujarat", displayName: "Rajkot, Gujarat", baseTariff: 6.85 },
  { name: "Bhavnagar", state: "Gujarat", displayName: "Bhavnagar, Gujarat", baseTariff: 6.80 },
  { name: "Jamnagar", state: "Gujarat", displayName: "Jamnagar, Gujarat", baseTariff: 6.80 },
  { name: "Gandhinagar", state: "Gujarat", displayName: "Gandhinagar, Gujarat", baseTariff: 6.90 },
  { name: "Junagadh", state: "Gujarat", displayName: "Junagadh, Gujarat", baseTariff: 6.75 },

  // Rajasthan
  { name: "Jaipur", state: "Rajasthan", displayName: "Jaipur, Rajasthan", baseTariff: 7.25 },
  { name: "Jodhpur", state: "Rajasthan", displayName: "Jodhpur, Rajasthan", baseTariff: 7.15 },
  { name: "Kota", state: "Rajasthan", displayName: "Kota, Rajasthan", baseTariff: 7.10 },
  { name: "Bikaner", state: "Rajasthan", displayName: "Bikaner, Rajasthan", baseTariff: 7.05 },
  { name: "Ajmer", state: "Rajasthan", displayName: "Ajmer, Rajasthan", baseTariff: 7.10 },
  { name: "Udaipur", state: "Rajasthan", displayName: "Udaipur, Rajasthan", baseTariff: 7.15 },
  { name: "Bhilwara", state: "Rajasthan", displayName: "Bhilwara, Rajasthan", baseTariff: 7.00 },
  { name: "Alwar", state: "Rajasthan", displayName: "Alwar, Rajasthan", baseTariff: 7.05 },

  // Uttar Pradesh
  { name: "Lucknow", state: "Uttar Pradesh", displayName: "Lucknow, Uttar Pradesh", baseTariff: 7.10 },
  { name: "Kanpur", state: "Uttar Pradesh", displayName: "Kanpur, Uttar Pradesh", baseTariff: 7.05 },
  { name: "Agra", state: "Uttar Pradesh", displayName: "Agra, Uttar Pradesh", baseTariff: 7.00 },
  { name: "Varanasi", state: "Uttar Pradesh", displayName: "Varanasi, Uttar Pradesh", baseTariff: 7.05 },
  { name: "Prayagraj", state: "Uttar Pradesh", displayName: "Prayagraj (Allahabad), Uttar Pradesh", baseTariff: 7.00 },
  { name: "Meerut", state: "Uttar Pradesh", displayName: "Meerut, Uttar Pradesh", baseTariff: 7.05 },
  { name: "Bareilly", state: "Uttar Pradesh", displayName: "Bareilly, Uttar Pradesh", baseTariff: 6.95 },
  { name: "Aligarh", state: "Uttar Pradesh", displayName: "Aligarh, Uttar Pradesh", baseTariff: 6.95 },
  { name: "Moradabad", state: "Uttar Pradesh", displayName: "Moradabad, Uttar Pradesh", baseTariff: 6.90 },
  { name: "Gorakhpur", state: "Uttar Pradesh", displayName: "Gorakhpur, Uttar Pradesh", baseTariff: 6.95 },
  { name: "Saharanpur", state: "Uttar Pradesh", displayName: "Saharanpur, Uttar Pradesh", baseTariff: 6.90 },
  { name: "Jhansi", state: "Uttar Pradesh", displayName: "Jhansi, Uttar Pradesh", baseTariff: 6.90 },
  { name: "Mathura", state: "Uttar Pradesh", displayName: "Mathura, Uttar Pradesh", baseTariff: 6.95 },

  // Kerala
  { name: "Kochi", state: "Kerala", displayName: "Kochi, Kerala", baseTariff: 7.15 },
  { name: "Thiruvananthapuram", state: "Kerala", displayName: "Thiruvananthapuram, Kerala", baseTariff: 7.10 },
  { name: "Kozhikode", state: "Kerala", displayName: "Kozhikode (Calicut), Kerala", baseTariff: 7.05 },
  { name: "Thrissur", state: "Kerala", displayName: "Thrissur, Kerala", baseTariff: 7.00 },
  { name: "Kollam", state: "Kerala", displayName: "Kollam, Kerala", baseTariff: 6.95 },
  { name: "Kannur", state: "Kerala", displayName: "Kannur, Kerala", baseTariff: 6.95 },

  // Madhya Pradesh & Chhattisgarh
  { name: "Indore", state: "Madhya Pradesh", displayName: "Indore, Madhya Pradesh", baseTariff: 7.20 },
  { name: "Bhopal", state: "Madhya Pradesh", displayName: "Bhopal, Madhya Pradesh", baseTariff: 7.15 },
  { name: "Jabalpur", state: "Madhya Pradesh", displayName: "Jabalpur, Madhya Pradesh", baseTariff: 7.05 },
  { name: "Gwalior", state: "Madhya Pradesh", displayName: "Gwalior, Madhya Pradesh", baseTariff: 7.05 },
  { name: "Ujjain", state: "Madhya Pradesh", displayName: "Ujjain, Madhya Pradesh", baseTariff: 7.00 },
  { name: "Raipur", state: "Chhattisgarh", displayName: "Raipur, Chhattisgarh", baseTariff: 6.85 },
  { name: "Bhilai", state: "Chhattisgarh", displayName: "Bhilai, Chhattisgarh", baseTariff: 6.80 },
  { name: "Bilaspur", state: "Chhattisgarh", displayName: "Bilaspur, Chhattisgarh", baseTariff: 6.75 },

  // Bihar & Jharkhand
  { name: "Patna", state: "Bihar", displayName: "Patna, Bihar", baseTariff: 7.10 },
  { name: "Gaya", state: "Bihar", displayName: "Gaya, Bihar", baseTariff: 6.90 },
  { name: "Bhagalpur", state: "Bihar", displayName: "Bhagalpur, Bihar", baseTariff: 6.85 },
  { name: "Muzaffarpur", state: "Bihar", displayName: "Muzaffarpur, Bihar", baseTariff: 6.85 },
  { name: "Ranchi", state: "Jharkhand", displayName: "Ranchi, Jharkhand", baseTariff: 6.95 },
  { name: "Jamshedpur", state: "Jharkhand", displayName: "Jamshedpur, Jharkhand", baseTariff: 7.00 },
  { name: "Dhanbad", state: "Jharkhand", displayName: "Dhanbad, Jharkhand", baseTariff: 6.90 },
  { name: "Bokaro", state: "Jharkhand", displayName: "Bokaro Steel City, Jharkhand", baseTariff: 6.90 },

  // Odisha
  { name: "Bhubaneswar", state: "Odisha", displayName: "Bhubaneswar, Odisha", baseTariff: 6.90 },
  { name: "Cuttack", state: "Odisha", displayName: "Cuttack, Odisha", baseTariff: 6.85 },
  { name: "Rourkela", state: "Odisha", displayName: "Rourkela, Odisha", baseTariff: 6.80 },
  { name: "Berhampur", state: "Odisha", displayName: "Berhampur, Odisha", baseTariff: 6.75 },
  { name: "Sambalpur", state: "Odisha", displayName: "Sambalpur, Odisha", baseTariff: 6.75 },

  // Assam & Northeast
  { name: "Guwahati", state: "Assam", displayName: "Guwahati, Assam", baseTariff: 6.90 },
  { name: "Silchar", state: "Assam", displayName: "Silchar, Assam", baseTariff: 6.80 },
  { name: "Dibrugarh", state: "Assam", displayName: "Dibrugarh, Assam", baseTariff: 6.80 },
  { name: "Agartala", state: "Tripura", displayName: "Agartala, Tripura", baseTariff: 6.75 },
  { name: "Shillong", state: "Meghalaya", displayName: "Shillong, Meghalaya", baseTariff: 6.80 },
  { name: "Aizawl", state: "Mizoram", displayName: "Aizawl, Mizoram", baseTariff: 6.70 },
  { name: "Imphal", state: "Manipur", displayName: "Imphal, Manipur", baseTariff: 6.75 },
  { name: "Kohima", state: "Nagaland", displayName: "Kohima, Nagaland", baseTariff: 6.75 },
  { name: "Gangtok", state: "Sikkim", displayName: "Gangtok, Sikkim", baseTariff: 6.80 },
  { name: "Itanagar", state: "Arunachal Pradesh", displayName: "Itanagar, Arunachal Pradesh", baseTariff: 6.70 },

  // Uttarakhand & Himachal Pradesh
  { name: "Dehradun", state: "Uttarakhand", displayName: "Dehradun, Uttarakhand", baseTariff: 6.80 },
  { name: "Haridwar", state: "Uttarakhand", displayName: "Haridwar, Uttarakhand", baseTariff: 6.75 },
  { name: "Roorkee", state: "Uttarakhand", displayName: "Roorkee, Uttarakhand", baseTariff: 6.75 },
  { name: "Shimla", state: "Himachal Pradesh", displayName: "Shimla, Himachal Pradesh", baseTariff: 6.60 },
  { name: "Dharamshala", state: "Himachal Pradesh", displayName: "Dharamshala, Himachal Pradesh", baseTariff: 6.60 },
  { name: "Kullu-Manali", state: "Himachal Pradesh", displayName: "Kullu-Manali, Himachal Pradesh", baseTariff: 6.55 },

  // Goa & UTs
  { name: "Panaji", state: "Goa", displayName: "Panaji, Goa", baseTariff: 6.90 },
  { name: "Margao", state: "Goa", displayName: "Margao, Goa", baseTariff: 6.85 },
  { name: "Puducherry", state: "Puducherry", displayName: "Puducherry (UT)", baseTariff: 6.70 },
  { name: "Srinagar", state: "Jammu & Kashmir", displayName: "Srinagar, Jammu & Kashmir", baseTariff: 6.50 },
  { name: "Jammu", state: "Jammu & Kashmir", displayName: "Jammu, Jammu & Kashmir", baseTariff: 6.55 },
  { name: "Leh", state: "Ladakh", displayName: "Leh, Ladakh", baseTariff: 6.50 },
  { name: "Port Blair", state: "Andaman & Nicobar", displayName: "Port Blair, Andaman & Nicobar", baseTariff: 7.20 }
];
