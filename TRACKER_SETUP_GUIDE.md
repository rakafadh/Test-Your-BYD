# 🚀 BYD Bekasi Timur Tracker App - Setup Guide

## 📋 **Overview**
Multi-tracker system dengan 2 fitur utama:
1. **Test Drive Tracker** - Tracking kendaraan test drive dengan status OUT/IN
2. **Charging AC/DC Tracker** - Monitoring aktivitas charging di station AC dan DC

## 🗄️ **Database Setup**

### **1. Jalankan SQL untuk Test Drive (jika belum ada):**
```sql
-- Copy dan paste dari file: setup_supabase_database.sql
```

### **2. Jalankan SQL untuk Charging:**
```sql
-- Copy dan paste dari file: setup_charging_database.sql
```

## 🔧 **Environment Variables**

Update file `.env` dengan kredensial baru:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Cloudinary Configuration  
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## 📱 **Features Overview**

### **Landing Page**
- Welcome screen dengan logo BYD
- 2 pilihan tracker dengan desain card modern
- Responsive design mobile-first

### **Test Drive Tracker**
- Dashboard dengan statistik: Total OUT, Total IN, Pending, Total Records
- Form dengan field: Customer, Employee, Date/Time, Status (OUT/IN), Police Number, Car Model, 6 foto
- List dengan filter dan export Excel
- Auto-delete settings

### **Charging AC/DC Tracker**  
- Dashboard dengan statistik: Total Records, Today, This Week, DC vs AC
- Form dengan field: Customer, Employee, Date/Time, Police Number, Phone, Car Model, Station Type (AC/DC), 2 foto, Notes
- List dengan filter dan export Excel
- Auto-delete settings

## 🎨 **Design System**
- **Color Palette**: Calm blue dengan accent colors
- **Layout**: Card-based, clean, modern
- **Navigation**: Breadcrumb + tracker-specific menu
- **Mobile-first**: Responsive di semua devices

## 🚀 **Deployment**

### **Vercel Setup:**
1. Push ke GitHub repository
2. Connect ke Vercel
3. Add environment variables di Vercel dashboard
4. Deploy

### **File Structure:**
```
src/
├── components/
│   ├── common/          # Shared components (Breadcrumb, TrackerLayout)
│   ├── testdrive/       # Test Drive specific components
│   ├── charging/        # Charging specific components
│   └── (other shared)   # DeleteModal, CameraCapture, etc.
├── context/             # TestDriveContext, ChargingContext
├── pages/               # LandingPage
├── utils/               # supabase, cloudinary
└── App.jsx              # Main routing
```

## ✅ **Testing Checklist**

### **Test Drive Tracker:**
- [ ] Dashboard statistics benar
- [ ] Form submission berhasil
- [ ] Status OUT/IN working
- [ ] Photo capture working
- [ ] List filter & export working
- [ ] Delete & auto-delete working

### **Charging Tracker:**
- [ ] Dashboard statistics benar  
- [ ] Form submission berhasil
- [ ] Station type AC/DC working
- [ ] Photo capture working
- [ ] List filter & export working
- [ ] Delete & auto-delete working

### **General:**
- [ ] Landing page navigation working
- [ ] Breadcrumb navigation working
- [ ] Responsive design working
- [ ] Offline functionality working
- [ ] Toast notifications working

## 🔧 **Development Commands**

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📞 **Support**
Jika ada issue atau pertanyaan, silahkan hubungi developer.

---
**BYD Bekasi Timur Tracker App v2.0** 🚗⚡
