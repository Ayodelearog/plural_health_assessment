# Plural Health Dashboard

A modern healthcare appointment management system built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **Dashboard View**: Comprehensive appointments table with patient information, clinic details, wallet balances, and appointment status
- **Add New Patient**: Modal form for registering new patients with personal information, photo upload, and fingerprint capture
- **Create Appointment**: Modal for scheduling appointments with calendar selection, clinic assignment, and time management
- **Responsive Design**: Pixel-perfect implementation matching the provided designs
- **Interactive UI**: Smooth animations, transitions, and hover effects throughout the application
- **State Management**: Fully functional forms with validation and data handling

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Font**: Gilroy (placeholder - to be replaced with actual font files)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
plural_health_assessment/
├── app/
│   ├── fonts/          # Font files (Gilroy)
│   ├── globals.css     # Global styles and animations
│   ├── layout.tsx      # Root layout with font configuration
│   └── page.tsx        # Main dashboard page
├── components/
│   ├── Header.tsx              # Top navigation with logo and user info
│   ├── SearchBar.tsx           # Patient search functionality
│   ├── AppointmentsTable.tsx   # Main appointments data table
│   ├── AddPatientModal.tsx     # New patient registration modal
│   └── AddAppointmentModal.tsx # Appointment creation modal
├── data/
│   └── data.ts         # Mock data for appointments, clinics, and patients
├── tailwind.config.ts  # Tailwind configuration with custom colors
└── tsconfig.json       # TypeScript configuration
```

## Design System

### Colors

- **Primary Brand**: `#0B0C7D` (Deep Blue)


### Typography

The application uses Gilroy font family. 


## Features Implementation

### Dashboard
- Displays all appointments in a sortable, paginated table
- Shows patient information with avatars
- Clinic icons and names
- Wallet balances
- Time/date with color-coded status
- Status badges with icons
- Expandable rows for additional details

### Add New Patient Modal
- Patient ID field with auto-generation
- Personal information form (name, DOB, gender, phone)
- Photo upload functionality
- Fingerprint capture
- New to hospital toggle
- Form validation
- Smooth modal animations

### Create Appointment Modal
- Patient search with fingerprint option
- Clinic selection
- Appointment type selection
- Interactive calendar with month navigation
- Time selection
- Repeat options
- Save and create invoice actions

## Development

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Lint Code

```bash
npm run lint
```


## License

ISC

## Author
Ayodele Arogundade for Plural Health

