
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
  name: "",
  hindiName: "",
  fatherName: "",
  dob: "",
  gender: "Male",
  idNumber: "",
  address: "",
  phone: "",
  photoUrl: null,
  signatureUrl: null,
  issueDate: new Date().toISOString().split('T')[0],
  // Initial values for new fields
  district: "",
  taluka: "",
  village: "",
  gatNumber: "",
  area: "",
  issuerCompany: "",
  branchName: "",
  logoUrl: null
};
