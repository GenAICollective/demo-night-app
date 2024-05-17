export enum AttendeeType {
  Founder = "Founder",
  Investor = "Investor",
  Engineer = "Engineer",
  ProductManager = "Product Manager",
  Designer = "Designer",
  Other = "Other",
}

export const ATTENDEE_TYPES = Object.values(AttendeeType);

export function colorForAttendeeType(type: string): string {
  switch (type) {
    case AttendeeType.Founder:
      return "bg-blue-200";
    case AttendeeType.Investor:
      return "bg-green-200";
    case AttendeeType.Engineer:
      return "bg-purple-200";
    case AttendeeType.ProductManager:
      return "bg-yellow-200";
    case AttendeeType.Designer:
      return "bg-pink-200";
    case AttendeeType.Other:
    default:
      return "bg-gray-200";
  }
}
