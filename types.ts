

export interface IdCardData {
  id?: string; // Supabase UUID
  cardType: 'kisan' | 'bc_agent';
  header: string;
  subHeader: string;
  name: string;
  hindiName?: string;
  fatherName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  idNumber: string;
  address: string;
  phone: string;
  photoUrl: string | null;
  signatureUrl: string | null;
  issueDate: string;
  // New Agricultural Fields
  district: string;
  taluka: string;
  village: string;
  gatNumber: string;
  area: string;
  // New BC Agent Fields
  issuerCompany: string;
  branchName?: string;
  logoUrl?: string | null;
}

export const INITIAL_ID_DATA: IdCardData = {
  cardType: 'kisan',
  header: "KISAN IDENTITY CARD",
  subHeader: "Private Farmer Profile",
  name: "Gopal Dattatray Kale",
  hindiName: "गोपाळ दत्तात्रय काळे",
  fatherName: "Dattatray Kale",
  dob: "1998-06-16",
  gender: "Male",
  idNumber: "529820666611",
  address: "At Karla Post Salgara Divti",
  phone: "7447656004",
  photoUrl: null,
  signatureUrl: null,
  issueDate: new Date().toISOString().split('T')[0],
  // Initial values for new fields
  district: "Dharashiv",
  taluka: "Tuljapur",
  village: "Karla",
  gatNumber: "34",
  area: "0.81",
  issuerCompany: "Integra Micro Systems Pvt Ltd",
  branchName: "Tuljapur Main Branch",
  logoUrl: null
};
